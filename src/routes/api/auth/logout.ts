import { createFileRoute } from "@tanstack/react-router";

import { clearSessionCookieHeader, getSessionUser } from "@/auth/session.server";
import { audit, originFrom } from "@/lib/audit.server";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getSessionUser(request);
        audit({
          actorId: user?.id ?? null,
          action: "auth.logout",
          entity: "session",
          entityId: null,
          result: "success",
          origin: originFrom(request),
        });
        return Response.json(
          { ok: true },
          { headers: { "set-cookie": clearSessionCookieHeader() } },
        );
      },
    },
  },
});
