const ip = require('ip');
const bodyParser = require('body-parser')
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080

app.use(express.static('./src'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/src/index.html');
});

app.get('/remote', function (req, res) {
  res.sendFile(__dirname + '/src/remote.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });

  socket.on('correct', function (data) {
    console.log(data);
  });

  socket.on('wrong', function (data) {
    console.log(data);
  });

  socket.on('next', function (data) {
    console.log(data);
  });

  socket.on('back', function (data) {
    console.log(data);
  });

});

server.listen(PORT, () => {
  console.log(`Server started on ${ip.address()}:${PORT}`);
})
