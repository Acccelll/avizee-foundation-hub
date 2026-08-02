/**
 * Funções de servidor da importação controlada.
 * Wrapper fino: lógica em `import/runner.server.ts`.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { authorize } from "@/catalog/guard.server";
import {
  getImportJob,
  listImportJobs,
  runDryRun,
  runExecute,
  runRollback,
} from "@/catalog/import/runner.server";

const MAX_FILE_CHARS = 2_000_000;

export const fetchImportJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => listImportJobs(await authorize(context, "import.execute")));

export const fetchImportJob = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) =>
    getImportJob(await authorize(context, "import.execute"), data.id),
  );

export const simulateImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        filename: z.string().trim().min(1).max(255),
        content: z.string().min(1).max(MAX_FILE_CHARS),
        schemaVersion: z.string().trim().min(1).max(20),
        allowedSkus: z.array(z.string().max(64)).max(5000).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) =>
    runDryRun(await authorize(context, "import.execute"), data),
  );

export const executeImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        dryRunJobId: z.string().uuid(),
        signature: z.string().min(4).max(80),
        content: z.string().min(1).max(MAX_FILE_CHARS),
        allowedSkus: z.array(z.string().max(64)).max(5000).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) =>
    runExecute(await authorize(context, "import.execute"), data),
  );

export const rollbackImport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) =>
    runRollback(await authorize(context, "import.rollback"), data.id),
  );
