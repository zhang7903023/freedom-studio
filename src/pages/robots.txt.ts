import { SITE } from "../config";

export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
