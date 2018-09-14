const express = require('express');
const app = express();

require('dotenv').config()
var APIAI_TOKEN = '29a58874a47e44bc9fb61d950797b686';
// var APIAI_SESSION_ID = request.body.sessionId;
const apiai = require('apiai')(APIAI_TOKEN);
// const APIAI_TOKEN = process.env.APIAI_TOKEN;

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(5000, () => {
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
        sessionId: "9793beea-1bc4-4f6f-a2b3-7d0530cf7ed9"
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
  