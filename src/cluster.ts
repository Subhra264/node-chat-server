import cluster, { Worker } from 'cluster';
const numOfCPUs: number = require('os').cpus().length;

if (cluster.isMaster) {
    console.log('Inside Master process:', process.pid);
    require('./config/env_setup');
    require('./utils/init/initialize_db');

    for(let i = 0; i < numOfCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker: Worker, code: number, signal: string): void => {
        console.log(`process ${worker.process.pid} died \ncode = ${code} \nsignal=${signal}`);
        cluster.fork();
    });

} else {
    console.log(`Inside worker process ${process.pid}`);
    require('./app');
}