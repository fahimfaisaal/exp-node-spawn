import { isPrime } from "../utils.mjs";

const from = 1;
const to = 100000000

let primes = 0

for (let num = from; num <= to; num++) {
  if (isPrime(num)) primes++
}

console.log("Total primes:", primes)
