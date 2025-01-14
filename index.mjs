import { Hono } from 'hono';
import range from 'lodash.range';
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
app.get('/count-prime', async (c) => {
  const from = parseInt(c.req.query('from'), 10);
  const to = parseInt(c.req.query('to'), 10);

  if (isNaN(from) || isNaN(to) || from > to || from < 0) {
    return c.json({ error: 'Invalid query parameters' }, 400);
  }

  const t1 = performance.now();
  const numbers = range(from, to)

  let primeCount = 0
  for (const num of numbers) {
    if (isPrime(num)) primeCount++
  }
  const t2 = performance.now();
  
  return c.json({ from, to, primeCount, took: (t2 - t1) / 1e3 });
});

/**
 * Count Primes in Range using Go Script
 */
app.get('/count-prime/go', async (c) => {
  const from = parseInt(c.req.query('from'), 10);
  const to = parseInt(c.req.query('to'), 10);

  if (isNaN(from) || isNaN(to) || from > to || from < 0) {
    return c.json({ error: 'Invalid query parameters' }, 400);
  }
  const t1 = performance.now();
  const output = await countPrimeNumbersInChildProcess({ from, to }, './count-primes');
  const t2 = performance.now();

  return c.json({ from, to, primeCount: +output.count, took: (t2 - t1) / 1e3, goTook: output.took });
});


const port = 3005;

console.log(`Server is running on http://localhost:${port}; pid: ${process.pid}`);

serve({
  fetch: app.fetch,
  port,
})
