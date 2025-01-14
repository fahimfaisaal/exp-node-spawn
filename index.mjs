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
  const from = parseInt(c.req.query('from'), 10);
  const to = parseInt(c.req.query('to'), 10);

  if (isNaN(from) || isNaN(to) || from > to || from < 0) {
    return c.json({ error: 'Invalid query parameters' }, 400);
  }

  const t1 = performance.now();
  const primes = []
  for (let num = from; num <= to; num++ ) {
    if (isPrime(num)) primes.push(num)
  }
  const t2 = performance.now();
  
  return c.json({ took: (t2 - t1) / 1e3, from, to, total: primes.length, primes: null });
});

/**
 * Count Primes in Range using Go Script
 */
app.get('/go/primes', async (c) => {
  const from = parseInt(c.req.query('from'), 10);
  const to = parseInt(c.req.query('to'), 10);

  if (isNaN(from) || isNaN(to) || from > to || from < 0) {
    return c.json({ error: 'Invalid query parameters' }, 400);
  }
  const t1 = performance.now();
  const { primes, total } = await countPrimeNumbersInChildProcess({ from, to }, './count-primes');
  const t2 = performance.now();

  return c.json({ took: (t2 - t1) / 1e3, from, to, total, primes });
});


const port = 3005;

console.log(`Server is running on http://localhost:${port}; pid: ${process.pid}`);

serve({
  fetch: app.fetch,
  port,
})
