var express = require('express'),
bodyParser = require('body-parser')
http = require('http'),
question = require('./routes/question'),
mongoose = require('mongoose');

var PORT = 8080;
var MONGODB_URL = "mongodb://localhost";

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect(MONGODB_URL + '/question-api')
.then(() =>  console.log('Connection succesful to mongodb.'))
.catch((err) => console.error(err));

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
* ROUTES
*/
app.use('/question', question);


app.set('port', PORT);

// Create HTTP server.
var server = http.createServer(app);


// Listen on provided port, on all network interfaces.
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

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
