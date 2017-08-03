const ip = require('ip');
const bodyParser = require('body-parser')
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080

app.use(express.static('./src'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

app.get('/remote', (req, res) => {
  res.sendFile(__dirname + '/src/remote.html');
});

io.on('connection', (socket) => {

  socket.on('remote', (data) => {
    console.log(data.correct);
    if (data.correct) {

    } else {

    }
  })

  socket.on('question', (data) => {
    switch (data) {
      case 'next':
        console.log('next');
        break;
      case 'back':
        console.log('back');
        break;
      default:
    }
  });

});

server.listen(PORT, () => {
  console.log(`Server started on ${ip.address()}:${PORT}`);
})
