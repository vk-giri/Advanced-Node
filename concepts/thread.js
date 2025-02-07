const crypto = require('crypto');

const startTime = Date.now();

crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  // function called after pbkdf2 is completed
  console.log('1: ', Date.now() - startTime);
});

// the second function won't wait for the first one to complete
// both will be invoked more or less at the same time
crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('2: ', Date.now() - startTime);
});


crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('3: ', Date.now() - startTime);
});

crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('4: ', Date.now() - startTime);
});

// since the size of thread pool by default is 4, 
// this 5th function has to wait for one of the threads to get empty
// hence roughlly double the amount of time taken
crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('5: ', Date.now() - startTime);
});




/*

When just one function was invoked - Time taken ~400ms

Then both functions are involved - Time takn by both ~400 ms

This indicates that Node is not single threaded
because if it was you would have seen the second
function taking double the time ~800ms, since
it had to wait for the first one to finsish 
(that would have added extra 400ms)

Why this happens?
Some functions in node, delegate the computation
to the underlying libuv library and libuv creates a 
thread pool (collection of 4 threads). Functions run
here outside the event loop

*/