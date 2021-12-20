const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: "*",
      
    }
  });
const cors = require('cors')
app.use(cors({
    origin: '*'
}))
app.use(express.static('dist'))

var locations = []

app.get('/getLocations', (req, res) => {
  res.send(locations)
});

io.on('connection', (socket) => {
    
  socket.on('send_location', data => {
      data.id = socket.id
      locations.push(data)
      console.log(locations);
      socket.broadcast.emit('send_location', data)
  })

  socket.on('update_location', data => {
      const location = locations.filter(location => location.id = socket.id)
      location.long = data.long, location.lat = data.lat
      socket.broadcast.emit('update_location', location)
  })
  socket.on('disconnect', () => {
    delete locations[socket.id]
    console.log(locations);
    socket.broadcast.emit('delete_location', socket.id)
})
  
});


server.listen(3000, () => {
  console.log('listening on 3000');
});