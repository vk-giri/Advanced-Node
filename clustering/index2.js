process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const cpuLen = os.cpus().length;

  // only create childre
  for (let cpu = 0; cpu < cpuLen; cpu++) {
    // all the children created will have their own threadpool
    cluster.fork();
  }
} else {
  const express = require('express');
  const crypto = require('crypto');
  const app = express();

  app.get('/', (req, res) => {
    crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
      res.send('Hi there!');
    });
  });

  app.get('/fast', (req, res) => {
    res.send('Hi that was fast!');
  });

  app.listen(8080);
}

/*

Suppose you have 100 children, and you get 100 concurrent request
all requests came at the same time, but the average time to process
will increase for each one of them becuase now the CPU will have
to do 100 works at the same time, driving the average up

so best would be to match the number of children to the number
of cpu cores you have so that all hashs are executed on one core
and they get the full processing power of that core

so in this I have 10 cores, so optimal child count would be 10

*/

// To benchmark the server, we use apache-benchmark
// to make 500 requests at a concurrency of 50 to the route
// use the following command -> ab -c 50 -n 500 localhost:8080/
