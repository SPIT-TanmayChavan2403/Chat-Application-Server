const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    console.log(req.body);
    res.send('Logged in').end();
})

app.get('/', (req, res) => {
    res.send('Server is up and running...');
})

app.listen("4000", () => {
    console.log('Listening on port 4000');
})




















let users = [];

const io = require('socket.io')(3000, {
    cors:{
        origin: ["http://localhost:4200"]
    }
});

io.on('connection', socket => {

    socket.emit("firstEmit", socket.id);

    socket.on('saveUsers', (data) => {
        console.log('Saving ', data.username, 'with id = ', data.id);
        users.push({
            username: data.username,
            id: data.id
        })
        socket.emit('acknowledgement', "Saved user successfully");
    })

    socket.on("sendMessage",  (req) => {
        console.log(req);
        let flag = false;
        users.forEach((user) => {
            if (user.username == req.receiver){
                flag = true;
                console.log(user.id);
                socket.to(user.id).emit("messageReceived" , req.message);
            }
        })
        console.log(flag);
        if (flag == false){
            console.log('Reverting...');
            socket.emit("acknowledgement" ,'User not found, please try another user or create new user.');
        }
    });
})


// Whatever data is being send save it in the database.
