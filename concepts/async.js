process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const https = require('https');

const startTime = Date.now();

function doRequest() {
  const req = https.request('https://www.google.com', (res) => {
    res.on('data', () => {});

    res.on('end', () => {
      console.log(Date.now() - startTime);
    });
  });

  req.end();
}

doRequest();
doRequest();
doRequest();
doRequest();
doRequest();

/*

All the six requests are completed at the same time.

This is not becuase of thread pool in Node [thread pool default size is 4]

Here OS comes into picture, network requests are handled by libuv. But neither
libuv or node actually does any task. Libuv delegates this task to the OS and 
it just waits for the response.

So the underlying OS decides whether to create a new thread or not

in event loop, these OS tasks are reflected in "pendingOSTasks" array

*/
