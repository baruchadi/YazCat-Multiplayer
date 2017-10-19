var express = require('express'); //load express framework
var app = express(); // initialize express instance in app pointer
var server = app.listen(8080); //launch server on listed port
const util = require('util');
app.use(express.static('public')); // host static files from the directory provided

var socket = require('socket.io'); // load socket.io framework
var io = socket(server); // initialize socket on server

var start = 0;

io.sockets.on('connection', newConnection); //handle new connection

var NORTH = 0,
    SOUTH = 2,
    EAST = 1,
    WEST = 3;

var players = {};

function printPlayers() {
    //var b =JSON.stringify(players, null, 4);
    console.log(util.inspect(players, {
        showHidden: true,
        depth: null
    }));
    //console.log(b);
}

function printJson(obj) {
    //var b =JSON.stringify(players, null, 4);
    console.log(util.inspect(obj, {
        showHidden: true,
        depth: null
    }));
    //console.log(b);
}

function newConnection(socket) {
    console.log(socket.id + " CONNECTED!");

    socket.on('join', function(data) {
        console.log(data.name);
        //    printJson(data);
        //  console.log("=====1=====");
        data.id = socket.id;
        var p = {
            x: 3,
            y: 1 + start
        };
        data.pos = p;
        data.body = [{
            'x': data.pos.x - 3,
            'y': data.pos.y,
            'l': 3,
            'o': EAST
        }];
        //printPlayers();
        //console.log("=====2=====");
        //printJson(data);
        //console.log("=====3=====");
        socket.broadcast.emit('joined', data);


        var data2 = {
            'pos': p,
            'id': socket.id,
            'ps': players


        }

        socket.emit('startpos', data2);



        players[socket.id] = data;
        //        printPlayers();
        //        console.log("=====4=====");
        start++;
        start++;
    });

    socket.on('lvlup', function(data) {


    });

    socket.on('turn',function(data){
      players[socket.id].body.push(data);

      data2 = {id:socket.id,p:data};
      socket.broadcast.emit('turned', data2);

    });

    socket.on('update', function(data) {


    });

    socket.on('move',
        function() {
          console.log(socket.id);
            data = {
                id: socket.id,
                head: {
                    id: players[socket.id].body.length - 1,
                    l: (players[socket.id].body[players[socket.id].body.length - 1].l + 1)
                },
                tail: {
                    id: 0,
                    x: 0,
                    y: 0,
                    l: 0
                },
                rem: false,
                same: false
            };

            players[data.id].body[players[data.id].body.length - 1].l++;
            players[data.id].body[0].l--;

            data.same = ((players[socket.id].body.length - 1) == 0) ? true : false;

              data.head.l=players[socket.id].body[players[socket.id].body.length - 1].l;
              data.tail.l=players[socket.id].body[0].l;
            if (players[data.id].body[0].l <= 0) {
                players[data.id].body.shift();
                data.rem = true;
            }
            switch (players[data.id].body[players[data.id].body.length - 1].o) {
                case NORTH:
                    players[data.id].body[players[data.id].body.length - 1].y--;
                    data.tail.y = -1;
                    break;
                case SOUTH:
                    players[data.id].body[players[data.id].body.length - 1].y++;
                    data.tail.y = 1;
                    break;
                case EAST:
                    players[data.id].body[players[data.id].body.length - 1].x++;
                    data.tail.x = 1;
                    break;
                case WEST:
                    players[data.id].body[players[data.id].body.length - 1].x--;
                    data.tail.x = -1;
                    break;
            }
            socket.broadcast.emit('moved', data);

        }
    );
    socket.on('disconnect', function() {
        console.log("Client has disconnected");

        var data1 = {
            id: socket.id
        };
        delete players[socket.id];
        socket.broadcast.emit('left', data1);
    });
}
