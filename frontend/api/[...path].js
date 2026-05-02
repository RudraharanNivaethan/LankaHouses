/**
 * Vercel serverless proxy — forwards all /api/* requests to the Railway backend.
 *
 * Set BACKEND_URL in the Vercel project's Environment Variables panel
 * (e.g. https://lankahouses-production.up.railway.app). It is never committed
 * to the repository.
 *
 * bodyParser is disabled so raw bodies (JSON, multipart/form-data for image
 * uploads, etc.) are streamed through unchanged.
 */

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    res.status(503).json({ success: false, error: 'Backend URL not configured.' });
    return;
  }

  try {
    const target = `${backendUrl}${req.url}`;

    // Forward all request headers except host (must match the upstream server).
    const forwardHeaders = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (key !== 'host') forwardHeaders[key] = value;
    }

    const hasBody = !['GET', 'HEAD'].includes(req.method);
    const body = hasBody ? await readRawBody(req) : undefined;

    const upstream = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body,
    });

    res.status(upstream.status);

    // Forward response headers; skip transfer-encoding (handled by Node HTTP).
    // Skip set-cookie here — handle separately to preserve all cookie values.
    for (const [key, value] of upstream.headers.entries()) {
      const lower = key.toLowerCase();
      if (lower === 'transfer-encoding') continue;
      if (lower === 'set-cookie') continue;
      res.setHeader(key, value);
    }

    // Preserve all Set-Cookie headers (getSetCookie returns an array, avoiding
    // the collapsed-value limitation of Headers.get('set-cookie')).
    const cookies = upstream.headers.getSetCookie?.() ?? [];
    if (cookies.length > 0) {
      res.setHeader('set-cookie', cookies);
    }

    const responseBody = Buffer.from(await upstream.arrayBuffer());
    res.end(responseBody);
  } catch (err) {
    console.error('[proxy] upstream error:', err);
    res.status(502).json({ success: false, error: 'Bad gateway.' });
  }
}
