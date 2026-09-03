import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/auth/session.functions";
import type { SessionUser } from "@/auth/contract";

export const Route = createFileRoute("/admin/_protected")({
  // A sessão vive no cliente; a autorização real é sempre reverificada no servidor.
  ssr: false,
  headers: () => ({ "X-Robots-Tag": "noindex, nofollow" }),
  beforeLoad: async (): Promise<{ user: SessionUser }> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });

    let user: SessionUser;
    try {
      user = await getAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
    if (!user.permissions.includes("admin.access")) {
      throw redirect({ to: "/admin/acesso-negado" });
    }
    return { user };
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { user } = Route.useRouteContext();
  return (
    <AdminShell user={user}>
      <Outlet />
    </AdminShell>
  );
}
