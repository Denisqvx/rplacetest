const express = require('express');
const { emit } = require('process');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  }
});
const port = 3000;

var grid = Array.from({ length: 900 }, (_,i) => '#ffffff')

app.get('/', (req, res) => {
  res.send('<h1>You shouldn\'t be here..</h1>');
});

io.on('connection', function(socket){
  console.log('A user connected');

  //update their whole grid for the first time
  for(let i=0; i<100; i++)
    socket.emit('gridupdate',{id:i,color:grid[i]});

  socket.on('boxchange',(props)=>{
    console.log(props);
    grid[props.id]=props.color;

    //this can be also changed with socket.broadcast.emit
    //which emits to all sockets but not the sender
    //might be useful anti-recursion pattern
    io.emit('gridupdate',props);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log('listening on: ' + port);
});