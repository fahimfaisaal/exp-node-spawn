import { Hono } from 'hono';
import { countPrimeNumbersInChildProcess, isPrime } from './utils.mjs';
import { serve } from '@hono/node-server';

const app = new Hono();

/**
 * Health Check Endpoint
 */
app.get('/health', (c) => {
  return c.json({ status: true, message: 'Achi re vai Achi' });
});

/**
 * Count Primes in Range using JavaScript
 */
app.get('/primes', async (c) => {
  const from = parseInt(c.req.query('from'), 10) || 1;
  const to = parseInt(c.req.query('to'), 10);

  if (isNaN(from) || isNaN(to) || from > to || from < 0) {
    return c.json({ error: 'Invalid query parameters' }, 400);
  }

  try {
    // used an average algo because node js array can't take more than 2^32 - 1 elements
    const t1 = performance.now();
    let primes = 0
    for (let i = from; i <= to; i++) {
      if (isPrime(i)) {
        primes++
      }
    }
    const t2 = performance.now();

    return c.json({ took: (t2 - t1) / 1e3, from, to, total: primes });
  } catch (err) {
    return c.json({
      status: false,
      message: err.message
    }, 500)
  }
});

/**
 * Count Primes in Range using Go Script
 */
app.get('/go/primes', async (c) => {
  const from = parseInt(c.req.query('from'), 10) || 1;
  const to = parseInt(c.req.query('to'), 10);

  if (isNaN(from) || isNaN(to) || from > to || from < 0) {
    return c.json({ error: 'Invalid query parameters' }, 400);
  }
  try {
    const t1 = performance.now();
    const total = Number(await countPrimeNumbersInChildProcess({ from, to }, './count-primes'));
    const t2 = performance.now();

    return c.json({ took: (t2 - t1) / 1e3, from, to, total });
  } catch (err) {
    return c.json({
      status: false,
      message: err.message
    }, 500)
  }
});


const port = 3005;

console.log(`Server is running on http://localhost:${port}; pid: ${process.pid}`);

serve({
  fetch: app.fetch,
  port,
})
