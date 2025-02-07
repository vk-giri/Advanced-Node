const cluster = require('cluster');

// index.js file executed multiple times by node
// the first time it produces cluster manager [isPrimary -> true]
// for other times after that it produces worker instance
console.log('Is this cluster master: ', cluster.isPrimary);

// Is the file being executed in master mode?
if (cluster.isPrimary) {
  // execute index.js *again* but in child mode
  // n forks = n instances of node.js running
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // I am a child, I am going to act like a server
  // and do nothing else

  const express = require('express');
  const app = express();

  function doWork(duration) {
    const start = Date.now();

    while (Date.now() - start < duration) {}
  }

  app.get('/', (req, res) => {
    doWork(5000);
    res.send('Hi there!');
  });

  app.get('/fast', (req, res) => {
    res.send('Hi that was fast!');
  });

  app.listen(8080);
}

/*

  you have one request which will take 5 secs to process
  if in between that another request is made, this has to
  wait for the first request to complete before this can be
  executed. 

  but once additional node instances are running, these two requests
  become independent of each other. On one instance the / will take
  5 sec to complete and on another node instance the /fast will execute

  so if you have multiple routes, and one of them takes too long to process
  use clusters so that other routes are available instantly


 */
