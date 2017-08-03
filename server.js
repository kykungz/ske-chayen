const ip = require('ip');
const bodyParser = require('body-parser')
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080



app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on ${ip.address()}:${PORT}`);
})
