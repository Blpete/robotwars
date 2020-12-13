
var express = require('express');


var io = require('socket.io')(http);

var app = express();


var http = require('http').createServer(app);



app.get('/', (req, res) => {
  res.sendFile(__dirname+'/dist/index.html');
})

io.on('connection', (socket) =>{
  console.log('a user connected');
});

http.listen(3000, () => {console.log('listening on *:3000');
});


module.exports = app;
