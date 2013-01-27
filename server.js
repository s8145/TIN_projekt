/*jshint node: true */
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    io = require('socket.io');

var server = http.createServer(function (req, res) {
    'use strict';
    var filePath = '.' + req.url,
        contentType = 'text/html',
        extName;

    console.log('request starting...' + filePath);
    if (filePath === './') {
        filePath = './index.html';
    }
    extName = path.extname(filePath);
    switch (extName) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    }

    path.exists(filePath, function (exists) {
        if (exists) {
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200, {
                        'Content-Type': contentType
                    });
                    res.end(content, 'utf-8');
                }
            });
        } else {
            res.writeHead(404);
            res.end();
        }
    });
});

var socket = io.listen(server);

socket.on('connection', function (client) {
    'use strict';
    var username;

    client.send('Wtaj!');
    client.send('Podaj nazwę użytkownika: ');

    client.on('message', function (msg) {
        if (!username) {
            username = msg;
            client.send('Witaj ' + username + '!');
            client.broadcast.emit('message', 'Nowy użytkownik: ' + username);
            return;
        }
        client.broadcast.emit('message', username + ': ' + msg);
    });
});

server.listen(3030);
