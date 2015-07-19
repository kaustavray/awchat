var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 1337;

app.use(express.static(__dirname + "/"));


var history = [ ];

var clients = [ ];
 

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
 

var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];

colors.sort(function(a,b) { return Math.random() > 0.5; } );


var server = http.createServer(app);
server.listen(port);

console.log(new Date()+" http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on("connection", function(ws) {
  
  console.log("websocket connection open");


   //var connection = request.accept(null, request.origin); 
    var index = clients.push(ws) - 1;
    var userName = false;
    var userColor = false;
 
    console.log((new Date()) + ' Connection accepted.');
 
    // send back chat history
    if (history.length > 0) {
        ws.send(JSON.stringify( { type: 'history', data: history} ));
    }
 
    // user sent some message
    ws.on('message', function(message) {
        //console.log(userName)
        //if (message.type === 'utf8') { // accept only text
            if(true){
           // console.log("hello");
            if (userName === false) { // first message sent by user is their name
                // remember user name
                userName = htmlEntities(message);
                console.log(userName);
                console.log(clients.length);
                // get random color and send it back to the user
                userColor = colors.shift();
                ws.send(JSON.stringify({ type:'color', data: userColor }));
                console.log((new Date()) + ' User is known as: ' + userName
                            + ' with ' + userColor + ' color.');
 
            } else { // log and broadcast the message
                console.log((new Date()) + ' Received Message from '
                            + userName + ': ' + message);
                
                // we want to keep history of all sent messages
                var obj = {
                    time: (new Date()).getTime(),
                    text: message,
                    author: userName,
                    color: userColor
                };
                history.push(obj);
                history = history.slice(-100);
 
                // broadcast message to all connected clients
                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < clients.length; i++) {
                    clients[i].send(json);
                }
            }
        }
    });







  ws.on("close", function() {
    console.log("websocket connection close");

  })
})





/*var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
     //we don't have to implement anything.
});
server.listen(1337, function() { });

 create the server
wsServer = new WebSocketServer({
      httpServer: server
});*/

// WebSocket server
/*wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});*/