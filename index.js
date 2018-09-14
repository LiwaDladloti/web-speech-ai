const express = require('express');
const app = express();

require('dotenv').config()
var APIAI_TOKEN = process.env.APIAI_TOKEN;
// var APIAI_SESSION_ID = request.body.sessionId;
const apiai = require('apiai')(APIAI_TOKEN);
// const APIAI_TOKEN = process.env.APIAI_TOKEN;

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 5000, () => {
    console.log("app running on port 5000")
});

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const io = require('socket.io')(server);
io.on('connection', function(socket) {
    socket.on('chat message', (text) => {
  
      // Get a reply from API.AI
  
      let apiaiReq = apiai.textRequest(text, {
        sessionId: process.env.APIAI_SESSION_ID
      });
  
      apiaiReq.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
        socket.emit('bot reply', aiText); // Send the result back to the browser!
      });
  
      apiaiReq.on('error', (error) => {
        console.log(error);
      });
  
      apiaiReq.end();
  
    });
  });
  