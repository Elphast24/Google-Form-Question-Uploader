const TAG_MAP: Record<string, string> = {
  br: '\n',
  div: '\n',
  p: '\n\n',
  ul: '\n',
  ol: '\n',
  li: '• ',
  h1: '\n\n',
  h2: '\n\n',
  h3: '\n\n',
  h4: '\n\n',
  blockquote: '> ',
  pre: '\n\n',
};

const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

export const escapeHtml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[&<>"'/]/g, (char) => ENTITY_MAP[char]);
};

export const sanitizeText = (input: unknown): string => {
  if (typeof input === 'string') {
    return escapeHtml(input);
  }
  if (typeof input === 'number' || typeof input === 'boolean') {
    return escapeHtml(String(input));
  }
  return '';
};

export const sanitizeHtml = (html: string): string => {
  if (typeof html !== 'string') return '';
  const stripped = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  const tagStripped = stripped.replace(/<[^>]*>/g, '');
  return escapeHtml(tagStripped);
};

export const sanitizeParsedText = (text: string): string => {
  if (!text) return '';
  return escapeHtml(String(text).trim());
};

export const isSafeUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};
