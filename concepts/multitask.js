process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// process.env.UV_THREADPOOL_SIZE = 1;
// if we have an extra thread(ex: 5) in the pool this will be
// solely responsible for the execution of FS, and then
// you will see that FS requiring way less size

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const startTime = Date.now();

function doRequest() {
  // TODO: change it to IP address and see the results
  // DNS Lookup do require threadpool
  const req = https.request('https://www.google.com', (res) => {
    res.on('data', () => {});

    res.on('end', () => {
      console.log('Network: ', Date.now() - startTime);
    });
  });

  req.end();
}

function doHash() {
  crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
    console.log('Hash: ', Date.now() - startTime);
  });
}

doRequest();

// fs will be managed in thread pool
fs.readFile('multitask.js', 'utf-8', () => {
  console.log('FS: ', Date.now() - startTime);
});

doHash();
doHash();
doHash();
doHash();

/*

Network call do not require threadpool

FS and hash does.

When FS is loaded on threadpool, while it is waiting for hard drive to return data
FS is temporarily offloaded from the threadpool and in it's place other operation
is loaded, like in here Hash. 

Run the file mulitple times to checkout this behaviour

Also SSD is insanely fast so FS in some cases takes very less time

*/
