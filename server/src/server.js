import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TelemetryService } from './telemetryService.js';
import { AnalyticsService } from './analyticsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const HOST = process.env.HOST || '127.0.0.1';
// Owner credential comes from the environment only. There is deliberately no
// default: an unset variable must deny owner access, never grant it. See
// .env.example. Never reintroduce a literal fallback here — it would ship a
// working password in the repository.
export const OWNER_SECRET_KEY = process.env.OWNER_SECRET_KEY || null;

if (!OWNER_SECRET_KEY) {
  console.warn('[auth] OWNER_SECRET_KEY is not set — owner-only endpoints are disabled.');
}

/**
 * The single comparison point for the owner credential. Fails closed on an
 * unset key and on any non-string candidate, so `undefined === undefined`
 * can never authenticate a caller who simply omitted the field.
 */
export function verifyOwnerKey(candidate) {
  if (!OWNER_SECRET_KEY) return false;
  if (typeof candidate !== 'string' || candidate.length === 0) return false;
  return candidate === OWNER_SECRET_KEY;
}

// Header only. `?key=` and `?token=` were also accepted and nothing used them -
// the dashboard sends x-admin-key - while a credential in a URL is written to
// access logs, browser history and the Referer of anything the page loads.
function isAuthorizedOwner(req) {
  if (!OWNER_SECRET_KEY) return false;

  if (verifyOwnerKey(req.headers['x-admin-key'])) return true;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    if (verifyOwnerKey(authHeader.slice(7).trim())) return true;
  }

  return false;
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Admin-Key');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard against oversized payloads (> 5MB)
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Health endpoint
    if (method === 'GET' && pathname === '/api/v1/health') {
      return sendJson(res, 200, {
        status: 'healthy',
        service: 'decideone-telemetry-engine',
        uptime_seconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
      });
    }

    // Telemetry Event Ingestion
    if (method === 'POST' && pathname === '/api/v1/telemetry/events') {
      const body = await parseJsonBody(req);
      const events = Array.isArray(body) ? body : (body.events || []);
      const result = TelemetryService.ingestBatch(events);
      return sendJson(res, 200, { success: true, ...result });
    }

    // Session Heartbeat
    if (method === 'POST' && pathname === '/api/v1/telemetry/heartbeat') {
      const body = await parseJsonBody(req);
      const result = TelemetryService.recordHeartbeat(body);
      return sendJson(res, 200, result);
    }

    // Verify Owner Secret Key
    if (method === 'POST' && pathname === '/api/v1/auth/verify') {
      const body = await parseJsonBody(req);
      if (verifyOwnerKey(body.key)) {
        return sendJson(res, 200, { success: true, message: 'Owner authenticated' });
      } else {
        return sendJson(res, 401, { success: false, error: 'Invalid owner secret key' });
      }
    }

    // Owner Access Control: Strictly protect all analytics & experiments endpoints
    if (pathname.startsWith('/api/v1/analytics/') || pathname === '/api/v1/experiments') {
      if (!isAuthorizedOwner(req)) {
        return sendJson(res, 401, {
          error: 'Unauthorized',
          message: 'Owner authentication required. This backend panel is private to the application owner.'
        });
      }
    }

    // Analytics APIs (Owner Authenticated)
    if (method === 'GET' && pathname === '/api/v1/analytics/overview') {
      return sendJson(res, 200, AnalyticsService.getOverview());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/features') {
      return sendJson(res, 200, AnalyticsService.getFeatures());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/funnels') {
      return sendJson(res, 200, AnalyticsService.getFunnels());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/dropoffs') {
      return sendJson(res, 200, AnalyticsService.getDropoffsAndGaps());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/retention') {
      return sendJson(res, 200, AnalyticsService.getRetention());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/live') {
      const limit = parseInt(parsedUrl.searchParams.get('limit') || '50', 10);
      return sendJson(res, 200, AnalyticsService.getLiveEvents(limit));
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/pathfinder') {
      return sendJson(res, 200, AnalyticsService.getPathfinderJourneys());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/circadian') {
      return sendJson(res, 200, AnalyticsService.getCircadianMetrics());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/task-debt') {
      return sendJson(res, 200, AnalyticsService.getTaskDebtMetrics());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/hesitation') {
      return sendJson(res, 200, AnalyticsService.getCognitiveHesitationMetrics());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/web-vitals') {
      return sendJson(res, 200, AnalyticsService.getWebVitals());
    }

    if (method === 'GET' && pathname === '/api/v1/analytics/anomalies') {
      return sendJson(res, 200, AnalyticsService.getAnomalies());
    }

    if (method === 'GET' && pathname === '/api/v1/experiments') {
      return sendJson(res, 200, AnalyticsService.getExperimentResults());
    }

    // Serve Executive Dashboard UI
    if (method === 'GET' && (pathname === '/analytics' || pathname === '/dashboard' || pathname === '/')) {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        setCorsHeaders(res);
        res.writeHead(200);
        return fs.createReadStream(indexPath).pipe(res);
      }
    }

    // Fallback 404
    sendJson(res, 404, { error: 'Not Found', path: pathname });
  } catch (err) {
    console.error('[Server] Internal Error:', err);
    sendJson(res, 500, { error: 'Internal Server Error', message: err.message });
  }
});

if (process.argv[1] === __filename) {
  // Loopback, not 0.0.0.0. This serves an owner-private dashboard and an
  // unauthenticated ingestion endpoint; on 0.0.0.0 anyone sharing a network
  // could POST telemetry into it and guess at /api/v1/auth/verify unthrottled.
  // Set HOST explicitly to expose it on purpose.
  server.listen(PORT, HOST, () => {
    console.log(`\n=============================================================`);
    console.log(`🚀 Decide One Telemetry & Analytics Microservice`);
    console.log(`📡 Ingestion Endpoint: http://${HOST}:${PORT}/api/v1/telemetry/events`);
    console.log(`📊 Executive Dashboard: http://${HOST}:${PORT}/analytics`);
    console.log(`💚 Health Check:        http://${HOST}:${PORT}/api/v1/health`);
    console.log(`=============================================================\n`);
  });
}

export { server };
