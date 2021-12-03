const express = require('express');
const cors = require('cors');
const app = express();
// const port = 8080;  // 
const http = require('http');
const appConfig = require('./config/appConfig');
const logger = require('./app/libs/loggerLib');
const InitiateMongoServer = require("./config/db");
const fs = require('fs');
var bodyParser = require('body-parser')


// Initiate Mongo Server
InitiateMongoServer();

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const modelsPath = './app/models';
const routesPath = './app/routes';

//Bootstrap models
fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) require(modelsPath + '/' + file)
});
// end Bootstrap models

// Bootstrap route
fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
    }
});



// port 
const server = http.createServer(app);
// start listening to http server
console.log(appConfig);
// server.listen(appConfig.port);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server 🚀 Started On PORT ${PORT}`);
});
server.on('error', onError);

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
            throw error;
    }
}

app.get('/', (req, res) => {
    res.send(
        ` <h1>If your are here then get LOST.</h1>`
    )
});
