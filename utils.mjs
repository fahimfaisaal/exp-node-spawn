import { spawn } from 'child_process';

export const countPrimeNumbersInChildProcess = async (range, ...spawnCommand) =>  
  new Promise((resolve, reject) => {
    const spawnedProcess = spawn(...spawnCommand);
    console.log('Spawned process');

    spawnedProcess.stdin.write(JSON.stringify(range));
    spawnedProcess.stdin.end();
    console.log("Sent message")

    spawnedProcess.stdout.on('data', (data) => {
      resolve(JSON.parse(data.toString()));
    });

    spawnedProcess.on('error', (error) => {
      reject(error);
    });

    spawnedProcess.on('close', (code) => {
      console.log(`Go process exited with code ${code}`);
    });
  });

export function isPrime(n) {
    if (n <= 1) {
        return false;
    }
    if (n <= 3) {
        return true;
    }
    if (n % 2 === 0 || n % 3 === 0) {
        return false;
    }
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) {
            return false;
        }
    }
    return true;
}

