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

// run pm2, since we are passing 0 that means pm2 will figure out number of clusters to load up
// based on logical core -> pm2 start pm2.js -i 0

// remove the clusters -> delete pm2