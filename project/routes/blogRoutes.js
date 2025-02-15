const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

const redis = require('redis');
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

(async () => {
  await redisClient.connect();
})();

redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = (app) => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    // check if we have any cached data in redis related to this query
    const cachedBlogs = await redisClient.get(req.user.id);

    // if yes, return the data from redis
    if (cachedBlogs) {
      console.log('serving from cache');
      return res.send(JSON.parse(cachedBlogs));
    }

    // if not, send this query to DB
    console.log('serving from DB');
    const blogs = await Blog.find({ _user: req.user.id });
    res.send(blogs);

    // store in redis after returning
    redisClient.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};

/*

const query =  Person.
  find({ occupation: /host/ }).
  where('name.last').equals('Ghost').
  where('age').gt(17).lt(66).
  where('likes').in(['vaporizing', 'talking']).
  limit(10).
  sort('-occupation').
  select('name occupation').

query.exec()

everything we write in mongoose like find/where/limit/select/sort just builds up a query which can be executed in the mongodb
but nothing is executed it just builds up the "query". It is not sent by mongoose to mongodb yet

only when .exec() is called then the request to mongodb is made

So why does it works in our code without explicitlly calling it? Because 
-> query.exec((err, result) => console.log(result))
is same as.....
-> query.then(result => console.log(result)) // internally when then() is called on a promise, .exec will be called
is same as.....
-> const result = await query // this is same as calling then, hence exec will be called automatically

*/
