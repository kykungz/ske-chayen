const ip = require('ip')
const JFile = require('jfile');
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 8080
let score = 0
let questions
let question

// read text file
const QUESTIONS = new JFile('./words.txt').lines
if (!QUESTIONS[QUESTIONS.length - 1]) {
  QUESTIONS.splice(QUESTIONS.length - 1)
}

const game = {
  nextQuestion () {
    let index = Math.floor(Math.random() * questions.length)
    question = questions.splice(index, 1)[0]
  },
  update () {
    this.nextQuestion()
    let context = {
      action: 'update',
      question,
      score
    }
    console.log('sending to index.html')
    io.emit('game', context)
  },
  restart () {
    questions = QUESTIONS.slice()
  }
}

app.use(express.static('./src'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html')
})

app.get('/remote', (req, res) => {
  res.sendFile(__dirname + '/src/remote.html')
})

io.on('connection', (socket) => {
  socket.on('remote', (data) => {
    console.log(data)
    switch (data.action) {
      case 'start':
        io.emit('game', {action: 'start'})
        break
      case 'correct':
        score++
        game.update()
        break
      case 'skip':
        game.update()
        break
      default:
    }
  })

  socket.on('game', (data) => {
    console.log(data)
    switch (data.action) {
      case 'stop': // game ended
        game.restart()
        break
      default:
    }
  })

})

server.listen(PORT, () => {
  console.log(`Server started on ${ip.address()}:${PORT}`)
})
