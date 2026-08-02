/**
 * Sessão administrativa real (§37) — substitui o provedor sintético DV-05-01.
 * Papéis e permissões vêm sempre do banco, nunca do cliente.
 */
import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { loadSessionUser } from "./authorize.server";
import type { SessionUser } from "./contract";

export const getAdminSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SessionUser> => {
    const { supabase, userId, claims } = context as unknown as {
      supabase: Parameters<typeof loadSessionUser>[0];
      userId: string;
      claims: { email?: string; user_metadata?: { full_name?: string } };
    };
    return loadSessionUser(supabase, userId, claims ?? {});
  });
