import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const target = url.searchParams.get('url');
  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing ?url=' }), { status: 400 });
  }

  try {
    const res = await fetch(target, {
      headers: { 'User-Agent': 'AstroLinkPreview/1.0' },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `HTTP ${res.status}`, url: target }));
    }

    const html = await res.text();
    const title = extractMeta(html, 'og:title', 'twitter:title') ?? extractTag(html, 'title');
    const description = extractMeta(html, 'og:description', 'twitter:description', 'description');
    const image = extractMeta(html, 'og:image', 'twitter:image');
    const siteName = extractMeta(html, 'og:site_name');

    return new Response(JSON.stringify({
      title: title?.trim() || new URL(target).hostname,
      description: description?.trim() || '',
      image,
      siteName: siteName?.trim() || '',
      url: target,
    }));
  } catch {
    return new Response(JSON.stringify({ error: 'fetch failed', url: target }));
  }
};

function extractMeta(html: string, ...names: string[]): string | null {
  for (const name of names) {
    // Try property= (og)
    const propRe = new RegExp(`<meta[^>]+property=["']${escapeRe(name)}["'][^>]+content=["']([^"']+)["']`, 'i');
    let m = html.match(propRe);
    if (m) return m[1];

    // Try name=
    const nameRe = new RegExp(`<meta[^>]+name=["']${escapeRe(name)}["'][^>]+content=["']([^"']+)["']`, 'i');
    m = html.match(nameRe);
    if (m) return m[1];

    // Try reversed order (content before name)
    const revRe = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapeRe(name)}["']`, 'i');
    m = html.match(revRe);
    if (m) return m[1];
  }
  return null;
}

function extractTag(html: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
