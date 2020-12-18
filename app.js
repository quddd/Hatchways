const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const memory_cache = require('memory-cache');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//middlewares
const pingRoute = require('./routes/ping');
const postsRoute = require('./routes/posts');

//Cache implementation
var cache = (duration) => {
  return (req,res,next) =>{
    let key = '__express__' + req.originalUrl || req.url;
    let cached_body = memory_cache.get(key)
    if(cached_body){
      res.send(cached_body)
      return
    }
    else{
      res.sendResponse = res.send
      res.send = (body) => {
        memory_cache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

//Routes
app.use('/api', pingRoute);
app.use('/api', cache(120), postsRoute);

app.get('/', (req,res) => {
  res.send("HatchWays Backend Challenge");
});


let server = app.listen(PORT, () =>{
  console.log(`Server listening on port ${PORT}`)
});

module.exports = server;
