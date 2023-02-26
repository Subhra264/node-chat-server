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
    if (code !== 5) {
      cluster.fork();
    } else if (!cluster.workers || !Object.keys(cluster.workers).length) {
      console.error(
        "Couldn't connect to Redis storage, check your redis credentials...",
      );
      process.exit();
    }
  });
} else {
  console.log(`Inside worker process ${process.pid}`);
  import('./app');
}
