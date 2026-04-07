import path from 'node:path';
import { readFile } from 'node:fs/promises';

const LOCAL_API = process.env.LOCAL_API_URL || 'http://localhost:5035/api';
const PROD_API = process.env.PROD_API_URL || 'https://samantha-official-website-api.onrender.com/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@samantha.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const REQUEST_TIMEOUT_MS = 30000;
const DEFAULT_UPLOAD_FOLDER = 'samantha-official-website';
const LOCAL_WEB_ROOT = path.join(process.cwd(), 'backend', 'Samantha.API', 'wwwroot');

const PAGE_CONTENT_KEYS = [
  'about-page',
  'contact-page',
  'home-page',
  'philanthropy-page'
];

const COLLECTIONS = [
  {
    name: 'movies',
    path: 'movies',
    matchKey: (item) => item.title?.trim().toLowerCase() ?? ''
  },
  {
    name: 'awards',
    path: 'awards',
    matchKey: (item) => [item.title, item.year, item.type].map(value => `${value ?? ''}`.trim().toLowerCase()).join('::')
  },
  {
    name: 'philanthropy',
    path: 'philanthropy',
    matchKey: (item) => [item.title, item.type].map(value => `${value ?? ''}`.trim().toLowerCase()).join('::')
  },
  {
    name: 'news',
    path: 'news',
    matchKey: (item) => item.title?.trim().toLowerCase() ?? ''
  },
  {
    name: 'gallery collections',
    path: 'gallerycollections',
    matchKey: (item) => item.key?.trim().toLowerCase() ?? ''
  },
  {
    name: 'media gallery',
    path: 'mediagallery',
    matchKey: (item) => [item.type, item.caption, item.imageUrl].map(value => `${value ?? ''}`.trim().toLowerCase()).join('::')
  },
  {
    name: 'fashion',
    path: 'fashion',
    matchKey: (item) => [item.title, item.date].map(value => `${value ?? ''}`.trim().toLowerCase()).join('::')
  },
  {
    name: 'fan creations',
    path: 'fancreations',
    matchKey: (item) => [item.type, item.title].map(value => `${value ?? ''}`.trim().toLowerCase()).join('::')
  },
  {
    name: 'settings',
    path: 'settings',
    matchKey: (item) => item.key?.trim().toLowerCase() ?? '',
    updateStrategy: 'upsert-post',
    deleteStrategy: 'skip'
  },
  {
    name: 'blogs',
    path: 'blogs',
    matchKey: (item) => item.title?.trim().toLowerCase() ?? ''
  },
  {
    name: 'projects',
    path: 'projects',
    matchKey: (item) => item.title?.trim().toLowerCase() ?? ''
  },
  {
    name: 'testimonials',
    path: 'testimonials',
    matchKey: (item) => [item.clientName, item.company, item.feedback].map(value => `${value ?? ''}`.trim().toLowerCase()).join('::')
  }
];

function createTimeoutSignal(timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout)
  };
}

async function requestJson(url, options = {}) {
  const { timeoutMs = REQUEST_TIMEOUT_MS, ...fetchOptions } = options;
  const { signal, clear } = createTimeoutSignal(timeoutMs);
  const isFormDataBody = typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal,
      headers: {
        Accept: 'application/json',
        ...(!isFormDataBody && fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
        ...(fetchOptions.headers ?? {})
      }
    });

    const text = await response.text();
    let parsed = null;

    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}: ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`);
    }

    return parsed;
  } finally {
    clear();
  }
}

async function login(baseApiUrl) {
  const response = await requestJson(`${baseApiUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response?.token) {
    throw new Error(`Login to ${baseApiUrl} did not return a token.`);
  }

  return response.token;
}

function stripId(item) {
  if (Array.isArray(item)) {
    return item.map(stripId);
  }

  if (item && typeof item === 'object') {
    const clone = { ...item };
    delete clone.id;
    return clone;
  }

  return item;
}

function withId(item, id) {
  return { ...stripId(item), id };
}

function normalizeItems(data) {
  return Array.isArray(data) ? data : [];
}

function detectMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

function normalizeProductionUrl(url) {
  if (typeof url !== 'string' || !url) {
    return url;
  }

  try {
    const prodHost = new URL(PROD_API).host;
    const parsedUrl = new URL(url);

    if (parsedUrl.host === prodHost && parsedUrl.protocol === 'http:') {
      parsedUrl.protocol = 'https:';
      return parsedUrl.toString();
    }
  } catch {
    return url;
  }

  return url;
}

function getUploadFolderFromLocalUrl(localUrl) {
  const parsedUrl = new URL(localUrl);
  const segments = parsedUrl.pathname.split('/').filter(Boolean);

  if (segments[0] !== 'uploads') {
    return '';
  }

  if (segments[1] === DEFAULT_UPLOAD_FOLDER) {
    return segments.slice(2, -1).join('/');
  }

  return segments.slice(1, -1).join('/');
}

function resolveLocalUploadPath(localUrl) {
  const parsedUrl = new URL(localUrl);
  const relativePath = parsedUrl.pathname.replace(/^\/+/, '');
  return path.join(LOCAL_WEB_ROOT, ...relativePath.split('/'));
}

function isLocalUploadUrl(value) {
  if (typeof value !== 'string' || !value.startsWith('http://')) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return (
      (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') &&
      parsedUrl.pathname.startsWith('/uploads/')
    );
  } catch {
    return false;
  }
}

async function uploadLocalAssetToProd(localUrl, prodToken, uploadedAssetCache) {
  if (uploadedAssetCache.has(localUrl)) {
    return uploadedAssetCache.get(localUrl);
  }

  const localFilePath = resolveLocalUploadPath(localUrl);
  const fileBuffer = await readFile(localFilePath);
  const fileName = path.basename(localFilePath);
  const folder = getUploadFolderFromLocalUrl(localUrl);
  const mimeType = detectMimeType(localFilePath);
  const formData = new FormData();

  formData.append('files', new Blob([fileBuffer], { type: mimeType }), fileName);
  if (folder) {
    formData.append('folder', folder);
  }

  const uploadedAssets = await requestJson(`${PROD_API}/uploads/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${prodToken}`
    },
    body: formData,
    timeoutMs: REQUEST_TIMEOUT_MS * 2
  });

  const uploadedUrl = Array.isArray(uploadedAssets) ? uploadedAssets[0]?.url : uploadedAssets?.url;
  if (!uploadedUrl) {
    throw new Error(`Production upload did not return a URL for ${localUrl}`);
  }

  const normalizedUrl = normalizeProductionUrl(uploadedUrl);
  uploadedAssetCache.set(localUrl, normalizedUrl);
  return normalizedUrl;
}

async function normalizePayloadForProduction(value, prodToken, uploadedAssetCache) {
  if (Array.isArray(value)) {
    const items = [];
    for (const item of value) {
      items.push(await normalizePayloadForProduction(item, prodToken, uploadedAssetCache));
    }
    return items;
  }

  if (value && typeof value === 'object') {
    const normalizedEntries = await Promise.all(
      Object.entries(value).map(async ([key, itemValue]) => [
        key,
        await normalizePayloadForProduction(itemValue, prodToken, uploadedAssetCache)
      ])
    );

    return Object.fromEntries(normalizedEntries);
  }

  if (isLocalUploadUrl(value)) {
    return uploadLocalAssetToProd(value, prodToken, uploadedAssetCache);
  }

  return value;
}

async function syncCollection(definition, prodToken, uploadedAssetCache) {
  const localItems = normalizeItems(await requestJson(`${LOCAL_API}/${definition.path}`));
  const prodItems = normalizeItems(await requestJson(`${PROD_API}/${definition.path}`));

  const localMap = new Map();
  const prodMap = new Map();

  for (const item of localItems) {
    const key = definition.matchKey(item);
    if (!key) {
      continue;
    }

    localMap.set(key, item);
  }

  for (const item of prodItems) {
    const key = definition.matchKey(item);
    if (!key) {
      continue;
    }

    prodMap.set(key, item);
  }

  const summary = {
    name: definition.name,
    local: localItems.length,
    productionBefore: prodItems.length,
    created: 0,
    updated: 0,
    deleted: 0
  };

  for (const [key, localItem] of localMap.entries()) {
    const existing = prodMap.get(key);
    const normalizedPayload = await normalizePayloadForProduction(stripId(localItem), prodToken, uploadedAssetCache);

    if (existing) {
      if (definition.updateStrategy === 'upsert-post') {
        await requestJson(`${PROD_API}/${definition.path}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${prodToken}`
          },
          body: JSON.stringify({ ...normalizedPayload, id: existing.id })
        });
      } else {
        await requestJson(`${PROD_API}/${definition.path}/${existing.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${prodToken}`
          },
          body: JSON.stringify({ ...normalizedPayload, id: existing.id })
        });
      }
      summary.updated += 1;
      continue;
    }

    await requestJson(`${PROD_API}/${definition.path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${prodToken}`
      },
      body: JSON.stringify(normalizedPayload)
    });
    summary.created += 1;
  }

  for (const [key, prodItem] of prodMap.entries()) {
    if (localMap.has(key)) {
      continue;
    }

    if (definition.deleteStrategy === 'skip') {
      continue;
    }

    await requestJson(`${PROD_API}/${definition.path}/${prodItem.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${prodToken}`
      }
    });
    summary.deleted += 1;
  }

  return summary;
}

async function syncPageContent(prodToken, uploadedAssetCache) {
  const summary = {
    name: 'page content',
    updated: 0,
    keys: []
  };

  for (const key of PAGE_CONTENT_KEYS) {
    const localContent = await requestJson(`${LOCAL_API}/pagecontent/${encodeURIComponent(key)}`);
    const normalizedPayload = await normalizePayloadForProduction(localContent, prodToken, uploadedAssetCache);

    await requestJson(`${PROD_API}/pagecontent/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${prodToken}`
      },
      body: JSON.stringify(normalizedPayload)
    });

    summary.updated += 1;
    summary.keys.push(key);
  }

  return summary;
}

async function main() {
  console.log(`Syncing managed content from ${LOCAL_API} to ${PROD_API}`);
  console.log('Excluded data: contact messages, quiz entries, visitor entries, users.');

  const prodToken = await login(PROD_API);
  const uploadedAssetCache = new Map();
  console.log('Authenticated with production admin API.');

  const results = [];

  for (const definition of COLLECTIONS) {
    const summary = await syncCollection(definition, prodToken, uploadedAssetCache);
    results.push(summary);
    console.log(
      `[${summary.name}] local=${summary.local} created=${summary.created} updated=${summary.updated} deleted=${summary.deleted}`
    );
  }

  const pageContentSummary = await syncPageContent(prodToken, uploadedAssetCache);
  results.push(pageContentSummary);
  console.log(`[page content] updated=${pageContentSummary.updated} keys=${pageContentSummary.keys.join(', ')}`);

  console.log('Managed content sync completed successfully.');
}

main().catch((error) => {
  console.error('Managed content sync failed.');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
