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

/*

Status legenda:

    0 - niewykonane
    1 - wykonane

 */

var task = [
    {nazwa: "Zdaj mature", data: "2013-12-12", user: 'filip', status: 0},
    {nazwa: "Podlej kwiaty", data: "2013-12-12", user: 'filip', status: 1},
    {nazwa: "Podlej kwiaty", data: "2013-01-26", user: 'monika', status: 0},
    {nazwa: "Podlej kwiaty", data: "2013-12-12", user: 'monika', status: 1},
    {nazwa: "Podlej kwiaty", data: "2013-12-12", user: 'grupa', status: 0},
    {nazwa: "Podlej kwiaty", data: "2013-12-12", user: 'grupa', status: 1}
];

var users = [
    {nazwa: 'filip'},
    {nazwa: 'monika'}
];

var isset = 0;

socket.on('connection', function (client) {
    'use strict';
    isset = 0;

    client.on('setUser', function(data){
        for(var i=0; i<users.length; i++){
            if(users[i].nazwa===data){
                isset = 1;
            }
        }
        if(isset==1){
            client.emit('yourTask', task);
        }else{
            client.emit('intruz', "Intruzom wstep zbroniony!");
        }
    }); 

    client.on('addTask', function (data){
        task.push(data);
        client.broadcast.emit('newTask', task);
        client.emit('newTask', task);
    });

    client.on('change', function (data){
        if(task[data].status===0){
            task[data].status=1;
            client.emit('newTask', task);
            client.broadcast.emit('newTask', task);
        }else{
            task[data].status=0;
            client.emit('newTask', task);
            client.broadcast.emit('newTask', task);
        }
    });

    client.on('delete', function(data){
        task.splice(data, 1);//Dokumntacja co robi splice => w3c school javascript array object
        client.emit('newTask', task);
        client.broadcast.emit('newTask', task);
    });

});

server.listen(3030);
