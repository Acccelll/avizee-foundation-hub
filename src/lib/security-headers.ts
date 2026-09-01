const BASE_PERMISSIONS_POLICY = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "interest-cohort=()",
].join(", ");

export function contentSecurityPolicy(production: boolean, nonce?: string): string {
  const connectSources = production ? "'self' https: wss:" : "'self' http: https: ws: wss:";
  const scriptSources = production
    ? nonce
      ? `'self' 'nonce-${nonce}'`
      : "'self'"
    : "'self' 'unsafe-inline'";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src ${scriptSources}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSources}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join("; ");
}

export function securityHeaders(production: boolean, nonce?: string): Headers {
  const headers = new Headers({
    "Content-Security-Policy": contentSecurityPolicy(production, nonce),
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

/**
 * Aplica headers sem descartar status, body ou headers já produzidos pela rota.
 * A CSP nonce-aware do documento SSR tem precedência sobre o fallback global.
 */
export function withSecurityHeaders(response: Response, production: boolean): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of securityHeaders(production)) {
    if (name.toLowerCase() === "content-security-policy" && headers.has(name)) continue;
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
