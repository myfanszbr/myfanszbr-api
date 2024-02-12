"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const os = require("os");
const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_RR;
class Cluster {
    static register(workers, callback) {
        let workerNumbers = workers;
        if (cluster.isPrimary) {
            console.log(`Master server started on ${process.pid}`);
            process.on('SIGINT', () => {
                console.log('Cluster shutting down...');
                for (const id in cluster.workers) {
                    cluster.workers[id].kill();
                }
                process.exit(0);
            });
            const cpus = os.cpus().length;
            if (workerNumbers > cpus) {
                workerNumbers = cpus;
            }
            for (let i = 0; i < workerNumbers; i += 1) {
                cluster.fork();
            }
            cluster.on('online', (worker) => {
                console.log('Worker %s is online', worker.process.pid);
            });
            cluster.on('exit', (worker) => {
                console.log(`Worker ${worker.process.pid} died. Restarting`);
                cluster.fork();
            });
        }
        else {
            callback();
        }
    }
}
exports.Cluster = Cluster;
//# sourceMappingURL=cluster.js.map