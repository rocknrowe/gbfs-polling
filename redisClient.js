var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

function writeToRedis(key, value){
  //logEventListener();
  client.set(key, value, redis.print);
};
exports.writeToRedis = writeToRedis;
