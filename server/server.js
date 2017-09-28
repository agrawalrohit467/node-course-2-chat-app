const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage, generateUserColor} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
  
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New user connected');

    socket.on('join', (params, callback) =>{
        if(!isRealString(params.name) || !isRealString(params.room)){
          return callback('Name and Room Name are required');  
        }

        if(users.checkDuplicateUserInRoom(params.name, params.room)){
            return callback('Display Name already used. Choose another display name');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room, generateUserColor());

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('adminMessage', 'Welcome to the chat app');
        socket.broadcast.to(params.room).emit('adminMessage', `${params.name} has joined`);
        callback();
    });

    socket.on('createMessage', (message, callback)=>{
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            //io.to(user.room).emit('newMessage', generateMessage(user.name, message.text, user.displayColor));
            socket.broadcast.to(user.room).emit('newMessage', generateMessage(user.name, message.text, user.displayColor));
            socket.emit('newMessage', generateMessage('You', message.text, user.displayColor));
        }

        callback();
    });

    socket.on('createLocationMessage', (coords) =>{
        var user = users.getUser(socket.id);

        if(user){
            //io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude, user.displayColor));
            socket.broadcast.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude, user.displayColor));
            socket.emit('newLocationMessage', generateLocationMessage('You', coords.latitude, coords.longitude, user.displayColor));
        } 
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('adminMessage', `${user.name} has left.`);
        }
    })
})

server.listen(port, ()=>{
    console.log(`server is up on port ${port}`);
})