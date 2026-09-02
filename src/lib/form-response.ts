import { NextResponse } from "next/server";

/** Browser form posts navigate as documents. fetch() / verify scripts do not. */
export function isBrowserFormPost(request: Request) {
  const dest = request.headers.get("sec-fetch-dest");
  const mode = request.headers.get("sec-fetch-mode");
  const accept = request.headers.get("accept") || "";
  return dest === "document" || mode === "navigate" || accept.includes("text/html");
}

export function formRedirect(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
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
    const url = new URL(path, request.url);
    url.searchParams.set("error", error);
    return NextResponse.redirect(url, 303);
  }
  return NextResponse.json({ error }, { status });
}
