var express = require('express');
var app = express();

app.get('/hello', function(req, res){
  res.send('hello world');
});

var server = app.listen(3000,  function() {
  console.dir(JSON.stringify(server.address()));
});