var express = require('express'),
bodyParser = require('body-parser')
http = require('http'),
mongoose = require('mongoose');

var question = require('./routes/question'),
game = require('./routes/game'),
user = require('./routes/user'),
message = require('./routes/message');
chatroom = require('./routes/chatroom');

var PORT = 8080;
var MONGODB_URL = "mongodb://localhost";

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect(MONGODB_URL + '/geogame-api')
.then(() =>  console.log('Connection successful to mongodb.'))
.catch((err) => console.error(err));

var app = express();

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
* ROUTES
*/
app.use('/question', question);
app.use('/game', game);
app.use('/user', user);
app.use('/message', message);
app.use('/chatroom', chatroom);

app.set('port', PORT);

// Create HTTP server.
var server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

// Chargement de socket.io
var io = require('socket.io').listen(server);
var Messages = require('./models/Message.js');
var ChatRoom = require('./models/ChatRoom.js');

// Connected sockets
var allClients = [];

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {

  var messagesService = Messages;
  var chatroomService = ChatRoom;

  socket.on('newclient', function(req) {

      console.log(req)

      allClients[socket] = req;

      ChatRoom.findById(req.chatId, function (err, chatroom) {

        if (err) return next(err);

        // transofrm and delete id from object
        chatObj = chatroom.toObject();
        delete chatObj._id
        delete chatObj.__v

        // add user chat
        chatObj.users.push(req.userId);

        // update
        ChatRoom.findByIdAndUpdate(req.chatId, chatObj, {new: true})
                .populate('messages')
                .populate('users', ['name', 'email', 'image', 'role'])
                .exec(function (err, post) {
                    if (err) return next(err);

                    socket.emit('messages', post.messages);
                    socket.emit('users', post.users);
                });
      });
  });

  // socket.on('message', function (message) {
  //     messagesService.create(message, function (err, post) {
  //         if (err) return next(err);
  //         socket.emit('message', message);
  //         socket.broadcast.emit('message', message);
  //     });
  // });

  socket.on('disconnect', function() {

    console.log("disconnect")
    console.log(allClients[socket].userId);
    console.log(allClients[socket].chatId);
    ChatRoom.findById(allClients[socket].chatId, function (err, chatroom) {

      if (err) return next(err);

      // remove user chat
      var index;
      console.log("sauvegardé avec socket "+ allClients[socket]);
      console.log("ID "+ allClients[socket].userId);
      console.log("users " + chatObj.users);
      console.log("ICI " +chatroom.users.indexOf(allClients[socket].userId));
      // while ((index = chatroom.users.indexOf(allClients[socket].userId)) >= 0) {
      //   console.log(index);
      //   chatroom.users.splice(index, 1);
      // }
      if ((index = chatroom.users.indexOf(allClients[socket].userId)) >= 0) {
        chatroom.users.splice(index, 1);
      }
      console.log(chatroom.users.length)

      // transofrm and delete id from object
      chatObj = chatroom.toObject();
      delete chatObj._id
      delete chatObj.__v

      // update
      ChatRoom.findByIdAndUpdate(allClients[socket].chatId, chatObj, {new: true})
              .populate('users', ['name', 'email', 'image', 'role'])
              .exec(function (err, post) {
                  if (err) return next(err);

                  socket.broadcast.emit('users', post.users);
              });
      });

      var i = allClients.indexOf(socket);
      allClients.splice(i, 1);
   });
});

//Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
        case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
        default:
        throw error;
    }
}

// Event listener for HTTP server "listening" event.
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
