const mongoose = require('mongoose');
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

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  // before the exec function of mongoose run this will be executed

  // console.log('I am about to run a querry');
  // get the query that will be executed by mongoose
  // console.log(this.getQuery());
  // get the model name
  // console.log(this.model.collection.name);

  // key -> {collection: <model_name>, <mongodb_query>}
  const key = JSON.stringify({
    collection: this.model.collection.name,
    ...this.getQuery(),
  });

  const cacheResult = await redisClient.get(key);

  if (cacheResult) {
    const cacheValue = JSON.parse(cacheResult);

    // redis has string stored in it, while the exec function should
    // return a Model document, hence converting
    // this is same as writing -> new Blog({....})

    return Array.isArray(cacheValue) ? cacheValue.map((obj) => new this.model(obj)) : new this.model(cacheValue);
  }

  const result = await exec.apply(this, arguments);

  // result is of type Model document and not a JSON
  redisClient.set(key, JSON.stringify(result));

  return result;
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
