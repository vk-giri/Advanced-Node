// changing the default value of threadpool
process.env.UV_THREADPOOL_SIZE = 2;

const crypto = require('crypto');

const startTime = Date.now();

crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('1: ', Date.now() - startTime);
});

crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('2: ', Date.now() - startTime);
});

crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('3: ', Date.now() - startTime);
});

crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('4: ', Date.now() - startTime);
});

crypto.pbkdf2('someRandomText123', 'salt8!', 100000, 512, 'sha512', () => {
  console.log('5: ', Date.now() - startTime);
});

// Tasks running in threadpool are executed in "pendingOperations array" in event loop