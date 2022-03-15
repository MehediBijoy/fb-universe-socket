const cors = require('cors')
const http = require('http');
const express = require('express');
const {Server} = require("socket.io");
const bodyParser = require('body-parser')

require('dotenv').config()


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json())

const PORT = process.env.PORT || 5005;


io.on('connection', (socket) => {

  socket.on('create', (channel_id) => {
      socket.join(channel_id);
  });

  socket.on('leave', (channel_id) => {
    io.to(channel_id).socketsLeave(channel_id);
  });
});

app.get('/', (req, res)=> {
  res.send('working..........');
})

app.post('/', (req, res) => {
    const body = req.body;
    io.to(body.channel_id).emit('state', body.status);
    res.send('success');
});


server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
