import { createFileRoute } from "@tanstack/react-router";

import { getSessionUser } from "@/auth/session.server";

export const Route = createFileRoute("/api/auth/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await getSessionUser(request);
        if (!user) return Response.json({ authenticated: false }, { status: 200 });
        return Response.json({
          authenticated: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            permissions: user.permissions,
          },
        });
      },
    },
  },
});
