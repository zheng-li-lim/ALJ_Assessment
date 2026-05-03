// agent-factcheck.js — Authenticity checks only. Content quality is handled by agent-cso.js.

const TRUSTED_DOMAINS = [
  'autocar.co.uk', 'insideevs.com',
  'theguardian.com', 'reuters.com', 'smmt.co.uk',
  'arabnews.com', 'thenationalnews.com', 'gulfnews.com',
  'theicct.org', 'best-selling-cars.com', 'autonews.com',
  'ft.com', 'bloomberg.com', 'bbc.co.uk', 'just-auto.com',
];

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function factCheckItem(item) {
  const issues = [];

  // 1. Source URL — present, valid HTTP/HTTPS format, from a trusted domain
  if (!item.sourceUrl?.trim()) {
    issues.push('No source URL provided');
  } else if (!/^https?:\/\//i.test(item.sourceUrl)) {
    issues.push('Source URL is not a valid HTTP/HTTPS address');
  } else {
    const domain  = extractDomain(item.sourceUrl);
    const trusted = TRUSTED_DOMAINS.some(d => domain === d || domain?.endsWith('.' + d));
    if (!trusted) {
      issues.push(`Source domain not in trusted publication list (${domain ?? 'unparseable'})`);
    }
  }

  // 2. Publish date — present, parseable, not in the future
  if (!item.publishedAt) {
    issues.push('No publish date');
  } else {
    const d = new Date(item.publishedAt);
    if (isNaN(d.getTime())) {
      issues.push('Publish date is not a valid date');
    } else if (d > new Date()) {
      issues.push('Publish date is in the future');
    }
  }

  // 3. Headline — must be present
  if (!item.headline?.trim()) {
    issues.push('No headline');
  }

  // 4. Summary — must be present (minimum length to rule out placeholder text)
  if (!item.summary || item.summary.trim().length < 40) {
    issues.push('Summary missing or too short to represent a real article');
  }

  const flag       = issues.length > 0;
  const confidence = issues.length === 0 ? 'High' : issues.length === 1 ? 'Medium' : 'Low';
  const note       = flag ? issues[0] : 'Passes all automated checks.';

  return { confidence, flag, note };
}

export function runFactCheck(items) {
  return items.map(item => ({ id: item.id, factCheck: factCheckItem(item) }));
}
