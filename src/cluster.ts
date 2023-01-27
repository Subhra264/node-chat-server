import cluster, { Worker } from 'cluster';
const numOfCPUs: number = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('Inside Master process:', process.pid);
  require('./config/env_setup');
  // require('./utils/init/initialize_db');

  for (let i = 0; i < numOfCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker: Worker, code: number, signal: string): void => {
    console.log(
      `process ${worker.process.pid} died, code = ${code}, signal=${signal}`,
    );
    if (code !== 5) {
      cluster.fork();
    } else if (!Object.keys(cluster.workers).length) {
      console.error(
        "Couldn't connect to Redis storage, check your redis credentials...",
      );
      process.exit();
    }
  });
} else {
  console.log(`Inside worker process ${process.pid}`);
  require('./app');
}
