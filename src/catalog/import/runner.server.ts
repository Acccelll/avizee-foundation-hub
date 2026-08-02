/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Execução da importação controlada (§26–§34 da Etapa 6).
 * Regra central: nenhuma execução ocorre sem simulação prévia bem-sucedida
 * e sem que a assinatura do plano confirmado bata com a simulação registrada.
 */
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit.server";
import type { Authorized } from "@/catalog/guard.server";
import {
  IMPORT_SCHEMA_VERSION,
  parseDelimited,
  validateHeader,
  validateRows,
  type RowError,
} from "./schema";
import { buildPlan, planSignature, type ExistingProduct, type ImportPlan } from "./plan";

async function sha256(content: string) {
  const bytes = new TextEncoder().encode(content);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function loadContext(auth: Authorized) {
  const [families, products] = await Promise.all([
    auth.admin.from("product_families").select("id, slug").is("deleted_at", null),
    auth.admin
      .from("products")
      .select(
        "id, public_sku, public_name, family_id, variation_label, measure, capacity, unit, public_description, is_on_request, product_families(slug)",
      )
      .is("deleted_at", null),
  ]);

  const familyBySlug = new Map<string, string>();
  for (const row of (families.data ?? []) as { id: string; slug: string }[]) {
    familyBySlug.set(row.slug, row.id);
  }

  const existing = ((products.data ?? []) as Record<string, unknown>[]).map<ExistingProduct>((row) => ({
    id: String(row["id"]),
    public_sku: String(row["public_sku"] ?? ""),
    public_name: String(row["public_name"] ?? ""),
    family_slug:
      (row["product_families"] as { slug?: string } | null)?.slug ?? null,
    variation_label: (row["variation_label"] as string) ?? null,
    measure: (row["measure"] as string) ?? null,
    capacity: (row["capacity"] as string) ?? null,
    unit: (row["unit"] as string) ?? null,
    public_description: (row["public_description"] as string) ?? null,
    is_on_request: Boolean(row["is_on_request"]),
  }));

  return { familyBySlug, existing };
}

export interface DryRunResult {
  jobId: string;
  signature: string;
  schemaVersion: string;
  errors: RowError[];
  plan: ImportPlan;
}

/** Simulação obrigatória: valida, planeja e registra o job sem alterar o catálogo. */
export async function runDryRun(
  auth: Authorized,
  input: { filename: string; content: string; schemaVersion: string; allowedSkus?: string[] | null | undefined },
): Promise<DryRunResult> {
  if (input.schemaVersion !== IMPORT_SCHEMA_VERSION) {
    throw new AppError(
      "VALIDATION_ERROR",
      undefined,
      `Versão de contrato incompatível. Esperada: ${IMPORT_SCHEMA_VERSION}`,
    );
  }

  const parsed = parseDelimited(input.content);
  const headerErrors = validateHeader(parsed.header);
  if (headerErrors.length > 0) {
    throw new AppError("VALIDATION_ERROR", { headerErrors }, headerErrors.map((e) => e.message).join("; "));
  }

  const { valid, errors } = validateRows(parsed.rows);
  const { familyBySlug, existing } = await loadContext(auth);
  const plan = buildPlan({
    rows: valid,
    existing,
    knownFamilySlugs: [...familyBySlug.keys()],
    allowedSkus: input.allowedSkus ?? null,
  });
  const signature = planSignature(plan);

  const { data, error } = await auth.admin
    .from("import_jobs")
    .insert({
      filename: input.filename,
      file_hash: await sha256(input.content),
      schema_version: input.schemaVersion,
      entity: "products",
      mode: "DRY_RUN",
      status: "SIMULATED",
      target_layer: "CANONICAL",
      total_rows: parsed.rows.length,
      valid_rows: valid.length,
      invalid_rows: errors.length,
      new_rows: plan.summary.create,
      updated_rows: plan.summary.update,
      unchanged_rows: plan.summary.unchanged,
      blocked_rows: plan.summary.blocked,
      operator_id: auth.userId,
      summary: { signature, summary: plan.summary },
    })
    .select("id")
    .single();
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });
  const jobId = (data as { id: string }).id;

  if (errors.length > 0) {
    await auth.admin.from("import_errors").insert(
      errors.map((e) => ({
        import_job_id: jobId,
        row_number: e.line,
        column_name: e.column,
        error_code: "VALIDATION",
        message: e.message,
        severity: "ERROR",
      })),
    );
  }

  await auth.admin.from("import_job_rows").insert(
    plan.items.map((item) => ({
      import_job_id: jobId,
      row_number: item.line,
      source_reference: item.sku,
      entity: "products",
      outcome: item.operation,
      entity_id: item.productId,
      new_values: { ...item.data },
      messages: { warnings: item.warnings, block: item.blockReason },
    })),
  );

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "import.dry_run",
    entity: "import_jobs",
    entityId: jobId,
    context: { filename: input.filename, summary: plan.summary, signature },
  });

  return { jobId, signature, schemaVersion: input.schemaVersion, errors, plan };
}

/** Execução: só prossegue com a mesma assinatura da simulação (§28). */
export async function runExecute(
  auth: Authorized,
  input: { dryRunJobId: string; signature: string; content: string; allowedSkus?: string[] | null | undefined },
) {
  const job = (
    await auth.admin.from("import_jobs").select("*").eq("id", input.dryRunJobId).maybeSingle()
  ).data as Record<string, unknown> | null;
  if (!job) throw new AppError("NOT_FOUND", { entity: "import_jobs" });
  if (job["mode"] !== "DRY_RUN" || job["status"] !== "SIMULATED") {
    throw new AppError("CONFLICT", undefined, "A simulação informada não está apta a execução.");
  }
  const storedSignature = (job["summary"] as { signature?: string } | null)?.signature;
  if (storedSignature !== input.signature) {
    throw new AppError("CONFLICT", undefined, "O arquivo mudou desde a simulação. Refaça a simulação.");
  }
  if ((await sha256(input.content)) !== job["file_hash"]) {
    throw new AppError("CONFLICT", undefined, "Conteúdo divergente da simulação confirmada.");
  }

  const parsed = parseDelimited(input.content);
  const { valid } = validateRows(parsed.rows);
  const { familyBySlug, existing } = await loadContext(auth);
  const plan = buildPlan({
    rows: valid,
    existing,
    knownFamilySlugs: [...familyBySlug.keys()],
    allowedSkus: input.allowedSkus ?? null,
  });
  if (planSignature(plan) !== input.signature) {
    throw new AppError("CONFLICT", undefined, "O estado do catálogo mudou. Refaça a simulação.");
  }

  const { data: created, error } = await auth.admin
    .from("import_jobs")
    .insert({
      filename: job["filename"],
      file_hash: job["file_hash"],
      schema_version: job["schema_version"],
      entity: "products",
      mode: "EXECUTE",
      status: "RUNNING",
      target_layer: "CANONICAL",
      total_rows: plan.summary.total,
      valid_rows: valid.length,
      new_rows: plan.summary.create,
      updated_rows: plan.summary.update,
      unchanged_rows: plan.summary.unchanged,
      blocked_rows: plan.summary.blocked,
      operator_id: auth.userId,
      dry_run_job_id: input.dryRunJobId,
      confirmed_at: new Date().toISOString(),
      summary: { signature: input.signature, summary: plan.summary },
    })
    .select("id")
    .single();
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });
  const jobId = (created as { id: string }).id;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const rowLogs: Record<string, any>[] = [];

  for (const item of plan.items) {
    if (item.operation === "UNCHANGED") continue;
    if (item.operation === "BLOCK") {
      // Nunca descartado: vira tarefa de normalização (§25).
      await auth.admin.from("normalization_tasks").insert({
        reason: "REVISAO_DE_NOME",
        title: `Linha bloqueada na importação: ${item.sku}`,
        description: item.blockReason,
        origin: `import:${jobId}`,
        priority: "ALTA",
        status: "OPEN",
        evidence: { line: item.line, data: item.data },
      });
      rowLogs.push({
        import_job_id: jobId,
        row_number: item.line,
        source_reference: item.sku,
        entity: "products",
        outcome: "BLOCK",
        messages: { block: item.blockReason },
      });
      continue;
    }

    const familyId = familyBySlug.get(item.data.familia_slug) ?? null;
    const values = {
      family_id: familyId,
      public_sku: item.sku,
      public_name: item.data.nome_publico,
      variation_label: item.data.variacao,
      measure: item.data.medida,
      capacity: item.data.capacidade,
      unit: item.data.unidade,
      public_description: item.data.descricao_publica,
      is_on_request: Boolean(item.data.sob_consulta),
      internal_brand: item.data.marca_interna,
      internal_notes: item.data.observacao_interna,
      source: `import:${jobId}`,
      updated_by: auth.userId,
      updated_at: new Date().toISOString(),
    };

    let previous: Record<string, unknown> | null = null;
    let entityId = item.productId;

    if (item.operation === "CREATE") {
      const inserted = await auth.admin
        .from("products")
        .insert({ ...values, created_by: auth.userId, review_status: "UNDER_REVIEW" })
        .select("id")
        .single();
      entityId = (inserted.data as { id: string } | null)?.id ?? null;
    } else {
      previous = (
        await auth.admin.from("products").select("*").eq("id", item.productId).maybeSingle()
      ).data as Record<string, unknown> | null;
      await auth.admin.from("products").update(values).eq("id", item.productId);
    }

    if (entityId && item.data.codigo_original) {
      await auth.admin
        .from("product_codes")
        .insert({
          product_id: entityId,
          code: item.data.codigo_original,
          code_type: "ORIGINAL",
          source: `import:${jobId}`,
          is_public: false,
        })
        .select("id");
    }

    rowLogs.push({
      import_job_id: jobId,
      row_number: item.line,
      source_reference: item.sku,
      entity: "products",
      outcome: item.operation,
      entity_id: entityId,
      previous_values: previous,
      new_values: values,
      messages: { warnings: item.warnings },
    });
  }

  if (rowLogs.length > 0) await auth.admin.from("import_job_rows").insert(rowLogs);

  await auth.admin
    .from("import_jobs")
    .update({ status: "COMPLETED", updated_at: new Date().toISOString() })
    .eq("id", jobId);

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "import.execute",
    entity: "import_jobs",
    entityId: jobId,
    context: { dryRunJobId: input.dryRunJobId, summary: plan.summary },
  });

  return { jobId, summary: plan.summary };
}

/** Rollback do lote (§30): reverte pelo registro linha a linha do próprio job. */
export async function runRollback(auth: Authorized, jobId: string) {
  const job = (await auth.admin.from("import_jobs").select("*").eq("id", jobId).maybeSingle()).data as
    | Record<string, unknown>
    | null;
  if (!job) throw new AppError("NOT_FOUND", { entity: "import_jobs" });
  if (job["mode"] !== "EXECUTE" || job["status"] !== "COMPLETED") {
    throw new AppError("CONFLICT", undefined, "Somente uma execução concluída pode ser revertida.");
  }
  if (job["rolled_back_at"]) {
    throw new AppError("CONFLICT", undefined, "Este lote já foi revertido.");
  }

  const rows = ((
    await auth.admin.from("import_job_rows").select("*").eq("import_job_id", jobId)
  ).data ?? []) as Record<string, unknown>[];

  let reverted = 0;
  for (const row of rows) {
    const entityId = row["entity_id"] as string | null;
    if (!entityId) continue;
    if (row["outcome"] === "CREATE") {
      // Soft delete: registro importado nunca é apagado fisicamente.
      await auth.admin
        .from("products")
        .update({ deleted_at: new Date().toISOString(), updated_by: auth.userId })
        .eq("id", entityId);
      reverted += 1;
    } else if (row["outcome"] === "UPDATE" && row["previous_values"]) {
      const previous = row["previous_values"] as Record<string, unknown>;
      delete previous["id"];
      await auth.admin.from("products").update(previous).eq("id", entityId);
      reverted += 1;
    }
  }

  await auth.admin
    .from("import_jobs")
    .update({ status: "ROLLED_BACK", rolled_back_at: new Date().toISOString() })
    .eq("id", jobId);

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "import.rollback",
    entity: "import_jobs",
    entityId: jobId,
    context: { reverted },
  });

  return { reverted };
}

export async function listImportJobs(auth: Authorized) {
  const { data } = await auth.admin
    .from("import_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as Record<string, any>[];
}

export async function getImportJob(auth: Authorized, jobId: string) {
  const job = (await auth.admin.from("import_jobs").select("*").eq("id", jobId).maybeSingle()).data;
  if (!job) throw new AppError("NOT_FOUND", { entity: "import_jobs" });
  const [rows, errors] = await Promise.all([
    auth.admin.from("import_job_rows").select("*").eq("import_job_id", jobId).order("row_number"),
    auth.admin.from("import_errors").select("*").eq("import_job_id", jobId).order("row_number"),
  ]);
  return {
    job: job as Record<string, any>,
    rows: (rows.data ?? []) as Record<string, any>[],
    errors: (errors.data ?? []) as Record<string, any>[],
  };
}
