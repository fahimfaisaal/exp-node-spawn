import { isPrime } from "../utils.mjs";
import range from "lodash.range";

const from = 1;
const to = 100000000

console.time('Took')
const numbers = range(from, to)

let primeCount = 0

for (const num of numbers) {
  if (isPrime(num)) primeCount++
}
console.timeEnd('Took')
