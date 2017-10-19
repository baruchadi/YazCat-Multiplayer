var socket;


var names = ['alice', 'black', 'bear', 'daniel', 'YAZCAT'];

var players = {};

var id = 0;

function clientInit() {
    socket = io.connect('http://localhost:8080');

    socket.on('startpos', function(data) {

        yaz.pos.x = data.pos.x * UNIT;
        yaz.pos.y = data.pos.y * UNIT;
        yaz.setPos(data.pos.x * UNIT, data.pos.y * UNIT);
        id = data.id;
        players = data.ps;
        printJson1(players);
        for (var player in players) {
            console.log(players[player].name + " IS HERE!");
            printJson1(player);
            console.log("**********************");
        }
        console.log("startPos " + data.pos.x + ", " + data.pos.y);
    });

    socket.on('turned', function(data) {

        players[data.id].body.push(data.p);
    });

    socket.on('moved', function(data) {
        //printJson1(data);
        players[data.id].body[data.head.id].l = data.head.l;
        if (data.rem) {
          players[data.id].body.shift();
        } else if(data.same) {
            players[data.id].body[data.tail.id].x += data.tail.x;
            players[data.id].body[data.tail.id].y += data.tail.y;
            players[data.id].body[data.tail.id].l = data.tail.l;
        }else{
          switch(players[data.id].body[data.tail.id].o){
            case NORTH:
            players[data.id].body[data.tail.id].y -= 1;
            break;
            case SOUTH:
            players[data.id].body[data.tail.id].y += 1;
            break;
            case EAST:
              players[data.id].body[data.tail.id].x += 1;
            break;
            case WEST:
            players[data.id].body[data.tail.id].x -= 1;
            break;
          }
          players[data.id].body[data.tail.id].l = data.tail.l;
        }
        printJson1(players[data.id].body);
    });
    socket.on('joined', function(data) {
        players[data.id] = data;
        players[data.id].pos.x = data.x * UNIT;
        players[data.id].pos.y = data.y * UNIT;
        console.log("joined data: ");
        printJson1(data);
        console.log("players: ");
        printJson1(players);
        console.log(data.name + " joined!");
    });

    socket.on('left', function(data) {
        delete players[data.id];
    });


    var data = {
        'name': names[Math.floor((Math.random() * names.length))]
    };
    console.log(data.name);
    socket.emit('join', data);
}

function sendTurn(d) {
    var data = {
        'l': 0,
        'x': yaz.pos.x/UNIT,
        'y': yaz.pos.y/UNIT,
        'o': d
      };
          socket.emit('turn', data);
}

function sendMove(pos) {

    socket.emit('move', null);
    console.log('sending moving!');
}


function printJson1(obj) {
    var b = JSON.stringify(obj, null, 4);

    console.log(b);
    //alert(obj);
}
