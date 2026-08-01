import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";

async function fetchSession() {
  const res = await fetch("/api/auth/session", { credentials: "same-origin" });
  if (!res.ok) return { authenticated: false as const };
  return (await res.json()) as
    | { authenticated: false }
    | {
        authenticated: true;
        user: { id: string; name: string; email: string; roles: string[]; permissions: string[] };
      };
}

export const Route = createFileRoute("/admin/_protected")({
  // Sessão fica em cookie HttpOnly; a verificação real é sempre no servidor.
  ssr: false,
  beforeLoad: async () => {
    const session = await fetchSession();
    if (!session.authenticated) throw redirect({ to: "/admin/login" });
    if (!session.user.permissions.includes("admin.access")) {
      throw redirect({ to: "/admin/acesso-negado" });
    }
    return { user: session.user };
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
