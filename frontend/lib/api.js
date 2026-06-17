const DEFAULT_API_BASE_URL = '/api';
const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
const normalizedBaseUrl =
  rawBaseUrl.endsWith('/') && rawBaseUrl.length > 1
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBaseUrl}${normalizedPath}`;
};
