const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

let users = {}

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>')
    res.sendFile(__dirname + '/index.html')
})

app.get('/jquery.min.js', (req, res) => {
    //res.send('<h1>Hello world</h1>')
    res.sendFile(__dirname + '/jquery.min.js')
})

io.on('connection', socket => {
    console.log('a user connected:' + socket.id)//socket.handshake.auth.name
    users[socket.id] = socket
    io.emit('users', Object.keys(users))
    socket.on('chat message', msg => {
        console.log('message: ' + msg.msg)
        //广播给除自己外的人
        //socket.broadcast.emit('chat message', msg)
        //广播给所有人
        if(msg.to == 'all'){
            io.emit('chat message', {msg: msg.msg, from: socket.id, to: msg.to})
        } else {
            //发送给指定人
            if(users[msg.to]) {
                users[msg.to].emit('chat message', {msg: msg.msg, from: socket.id, to: msg.to})
            }
        }
    })
    socket.on('disconnect', () => {
        delete users[socket.id]
        console.log('user disconnected')
    })
})

server.listen(30001, () => {
    console.log('listening on *:30001')
})