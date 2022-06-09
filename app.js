const express = require('express');

const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const server = app.listen(process.env.PORT || 8080, (err) => {
    if (!err) {
        console.log(`Listenening on port ${process.env.PORT || 8080}`);
    }
    else {
        console.log(err);
    }
});


const io = require('socket.io')(server);

io.on('connection', async (socket) => {

    socket.on('chip-drop',(msg)=>{
        console.log(msg);
        socket.broadcast.emit('chip-drop',msg);
    });

    socket.on('join-room',(roomId)=>{
        console.log(roomId,socket.id);
        socket.join(roomId);
        const clients = io.sockets.adapter.rooms.get(roomId);
        const gameArray = [...clients].map((e,index)=>{
            return {
                index:index,
                sid:e
            };
        })
        io.to(roomId).emit('start-game',gameArray);
    });
});
