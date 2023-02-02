import cluster, { Worker } from 'cluster';
import { cpus } from 'os';
const numOfCPUs: number = cpus().length;

if (cluster.isPrimary) {
  console.log('Inside Primary process:', process.pid);

  for (let i = 0; i < numOfCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker: Worker, code: number, signal: string): void => {
    console.log(
      `process ${worker.process.pid} died, code = ${code}, signal=${signal}`,
    );
    cluster.fork();
  });
} else {
  console.log(`Inside worker process ${process.pid}`);
  import('./app');
}
