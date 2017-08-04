const ip = require('ip')
const JFile = require('jfile');
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 8080
const TIME = 5 * 60 * 1000
let score = 0
let questions
let question
let time = 0
// read text file
const QUESTIONS = new JFile('./words.txt').lines
if (!QUESTIONS[QUESTIONS.length - 1]) {
  QUESTIONS.splice(QUESTIONS.length - 1)
}

const game = {
  running: false,
  nextQuestion () {
    let index = Math.floor(Math.random() * questions.length)
    question = questions.splice(index, 1)[0]
  },
  update () {
    let context = {
      action: 'update',
      question,
      score,
      time: TIME/1000 - time/1000
    }
    io.emit('game', context)
  },
  reset () {
    questions = QUESTIONS.slice()
    time = 0
    score = 0
  },
  start() {
    this.running = true
    this.nextQuestion()
    let timer = setInterval(() => {
      time += 1000
      this.update()
      if (time >= TIME) {
        clearInterval(timer)
        this.stop()
        this.reset()
      }
    }, 1000)
  },
  stop () {
    this.running = false
    io.emit('game', {action: 'stop'})
  }
}

game.reset()

app.use(express.static('./src'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html')
})

app.get('/status', (req, res) => {
  res.sendFile(__dirname + '/src/status.html')
})

app.get('/remote', (req, res) => {
  res.sendFile(__dirname + '/src/remote.html')
})

io.on('connection', (socket) => {
  socket.on('remote', (data) => {
    console.log(data)
    switch (data.action) {
      case 'start':
        if (!game.running) {
          game.start()
          io.emit('game', {action: 'start'})
        }
        break
      case 'correct':
        score++
        game.nextQuestion()
        game.update()
        break
      case 'skip':
        game.nextQuestion()
        game.update()
        break
      default:
    }
  })

})

server.listen(PORT, () => {
  console.log(`Server started on ${ip.address()}:${PORT}`)
})
