const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.static(__dirname + '/public'));

let users = {};

io.on('connection', (socket) => {
    console.log('Користувач підключився');

    socket.on('join', (username) => {
        users[socket.id] = username;
        console.log(`${username} приєднався до чату`);
        io.emit('newUser', `${username} приєднався до чату`);
    });

    socket.on('message', (message) => {
        const senderUsername = users[socket.id];
        
        if (senderUsername) {
            io.emit('newMessage', { message, senderUsername });
            console.log(`Від ${senderUsername}: ${message}`);
        }
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        
        if (username) {
            delete users[socket.id];
            
            io.emit('userLeft', `${username} покинув чат`);
            console.log(`${username} покинув чат`);
            
            delete users[socket.id];
            console.log(`Користувач від'єднався`);
        }
        
    });
});

http.listen(3000, () => {
    console.log("Сервер запущено на порту 3000");
});
