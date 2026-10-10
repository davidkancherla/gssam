import { NextResponse } from "next/server";

/** Browser form posts navigate as documents. fetch() / verify scripts do not. */
export function isBrowserFormPost(request: Request) {
  const dest = request.headers.get("sec-fetch-dest");
  const mode = request.headers.get("sec-fetch-mode");
  const accept = request.headers.get("accept") || "";
  return dest === "document" || mode === "navigate" || accept.includes("text/html");
}

/**
 * Same-origin redirect with a relative Location. Route handlers behind
 * `next start` (or a proxy) can see request.url as http://localhost:PORT,
 * so an absolute URL built from it can send the browser to a different
 * origin where the session cookie does not exist.
 */
export function relativeRedirect(path: string, status = 303) {
  const url = new URL(path, "http://gssam.local");
  return new NextResponse(null, {
    status,
    headers: { Location: `${url.pathname}${url.search}` },
  });
}

export function formRedirect(_request: Request, path: string) {
  return relativeRedirect(path);
}

export function adminResult(
  request: Request,
  path: string,
  json: Record<string, unknown>,
  status = 200,
) {
  if (isBrowserFormPost(request)) {
    return formRedirect(request, path);
  }
  return NextResponse.json(json, { status });
}

export function adminError(
  request: Request,
  path: string,
  error: string,
  status = 400,
) {
  if (isBrowserFormPost(request)) {
    const url = new URL(path, "http://gssam.local");
    url.searchParams.set("error", error);
    return relativeRedirect(`${url.pathname}${url.search}`);
  }
  return NextResponse.json({ error }, { status });
}
