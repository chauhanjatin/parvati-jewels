const { PrismaClient } = require('@prisma/client');

// Format and optimize DATABASE_URL for Neon Serverless PostgreSQL
function getNormalizedDatabaseUrl() {
  let url = process.env.DATABASE_URL || '';
  if (!url) {
    console.warn('[Prisma] WARNING: DATABASE_URL environment variable is not defined.');
    return url;
  }

  // Ensure Neon requires SSL
  if (url.includes('neon.tech') && !url.includes('sslmode=')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}sslmode=require`;
  }

  // Ensure connection timeout allows Neon cold-starts (15 seconds)
  if (url.includes('neon.tech') && !url.includes('connect_timeout=')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}connect_timeout=15`;
  }

  return url;
}

// Global singleton to prevent multiple PrismaClient instances during hot reloads
const globalForPrisma = global;

const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getNormalizedDatabaseUrl(),
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

/**
 * Dynamic retry helper for Neon cold-starts & transient network hiccups.
 * Automatically retries up to maxRetries times with exponential backoff.
 */
async function withDbRetry(fn, maxRetries = 3, initialDelayMs = 500) {
  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const isTransient =
        error.message?.includes("Can't reach database server") ||
        error.message?.includes('Connection terminated') ||
        error.message?.includes('connection closed') ||
        error.message?.includes('ETIMEDOUT') ||
        error.message?.includes('ECONNRESET') ||
        error.code === 'P1001' || // Can't reach database server
        error.code === 'P1002' || // Database server timed out
        error.code === 'P1008';   // Operations timed out

      if (isTransient && attempt < maxRetries) {
        console.warn(
          `[Neon DB] Transient error detected (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`
        );
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}

/**
 * Startup warmup ping to wake up Neon serverless instance before user traffic arrives.
 */
async function warmupDatabase() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    const dbUrl = process.env.DATABASE_URL || '';
    const hostMatch = dbUrl.match(/@([^:/]+)/);
    const host = hostMatch ? hostMatch[1] : 'database';
    console.log(`[Neon DB] Connected successfully to ${host} in ${latency}ms`);
    return { ok: true, latency };
  } catch (error) {
    console.error('[Neon DB] Initial connection error:', error.message);
    return { ok: false, error: error.message };
  }
}

/**
 * Dynamic Health Check helper
 */
async function checkDbHealth() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'connected',
      provider: 'Neon PostgreSQL',
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      status: 'disconnected',
      provider: 'Neon PostgreSQL',
      error: error.message,
    };
  }
}

// Graceful disconnection on shutdown
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log('[Neon DB] Prisma client disconnected cleanly');
  } catch (err) {
    console.error('[Neon DB] Error during disconnect:', err.message);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = {
  prisma,
  withDbRetry,
  warmupDatabase,
  checkDbHealth,
};
