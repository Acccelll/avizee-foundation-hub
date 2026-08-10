import { createServerFn } from "@tanstack/react-start";

import { authorize } from "@/catalog/guard.server";
import { listAuthorsForManagement } from "@/content/authors.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const fetchAuthorsForManagement = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    listAuthorsForManagement(await authorize(context, "content.read")),
  );
