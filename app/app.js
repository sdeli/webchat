'use strict';
const http = require('http');
const path = require('path');
let socketio = require('socket.io');
const moduleLinker = require('./widgets/module-linker/module-linker.js');

const dotenv = require('dotenv');
let err = dotenv.config({ path: './.env.default' });

let pathToConfig = `${__dirname}/config`;
let pathToWidgets = `${__dirname}/widgets`;
let pathToNodeModules = path.join(`${__dirname}/../node_modules`);

moduleLinker(pathToConfig, pathToNodeModules);
moduleLinker(pathToWidgets, pathToNodeModules);

const config = require('config');
const router = require('./router/router.js'); 

const server = http.createServer((req, res) => {
    router(req, res)
});

socketio = socketio(server);

socketio.on('connection', client => {
    console.log('connected');

    client.on('message', ({message, user}) => {
        client.broadcast.emit('message', {message, user});

        setTimeout(() => {
            client.emit('message', { 
                message : 'Your message is appreaciated', 
                user : 'sandorBot'
            });
        }, 1000);
    });


    client.on('disconnect', () => { /* … */ });
});

server.listen(config.serverListenPort);