const BASE_PERMISSIONS_POLICY = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "interest-cohort=()",
].join(", ");

export function contentSecurityPolicy(production: boolean): string {
  const connectSources = production
    ? "'self' https: wss:"
    : "'self' http: https: ws: wss:";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSources}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join("; ");
}

export function securityHeaders(production: boolean): Headers {
  const headers = new Headers({
    "Content-Security-Policy": contentSecurityPolicy(production),
    "Cross-Origin-Opener-Policy": "same-origin",
    "Permissions-Policy": BASE_PERMISSIONS_POLICY,
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Permitted-Cross-Domain-Policies": "none",
  });

  if (production) {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return headers;
}

/** Aplica headers sem descartar status, body ou headers já produzidos pela rota. */
export function withSecurityHeaders(response: Response, production: boolean): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of securityHeaders(production)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
