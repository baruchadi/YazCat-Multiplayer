var SCREEN_WIDTH;
var SCREEN_HEIGHT;

var UNIT = 32;
var cols = 28,
    rows = 28;

var yaz;

var keyReady = true;
var running = false;

var menu = true;

var score = 0;

var pizzas;
var bfps = 5;

var nd;

function setup() {

    yaz = new Cat();

    F_TOP = (PI / 2) + PI;
    F_BOT = PI / 2;
    F_RIGHT = 0;
    F_LEFT = PI;
    clientInit();
    console.log("top: " + F_TOP + ", right: " + F_RIGHT + ", bot: " + F_BOT + ", left: " + F_LEFT);
    order = [F_TOP, F_RIGHT, F_BOT, F_LEFT];
    frameRate(bfps);
    SCREEN_WIDTH = cols * UNIT;
    SCREEN_HEIGHT = rows * UNIT;
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    loadImages();
    restart();

    //yas.dead=true;
    strokeWeight(4);
    stroke(255);
    textAlign(CENTER);
}

function intro() {
  push();
  stroke(0);
  strokeWeight(3);
  var c=color(255);
  fill(c);
    textSize(48);
    text("YAZ-CAT", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 48);
    textSize(18);
    text("HELP YAZ THE CAT COLLECT PIZZAS!", SCREEN_WIDTH / 2 - SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 5);
    textSize(24);
    text("PRESS ENTER TO RESTART.", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + SCREEN_HEIGHT / 5);

pop();
    //      image(corner, 100,100, UNIT, UNIT);
    //    image(corner2, 200,100, UNIT, UNIT);
}

function gameOver() {
  push();
  stroke(255, 0, 0);
  strokeWeight(3);
  var c=color(200);
  fill(c);
    textSize(48);
    text("GAME OVER", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 48);
    text("SCORE: " + score, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    textSize(24);
    text("PRESS ENTER TO RESTART.", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 48);
    pop();
}

function incDiff() {
    diffInc++;
    frameRate(min(bfps + diffInc, 20));
}

function GUI() {
  push();
  stroke(150, 0, 0);
  strokeWeight(2);
  var c=color(255);
  fill(c);

    textSize(24);
    textAlign(LEFT);
    text("SCORE: " + score, 4, 24);
    textAlign(RIGHT);
    text("LEVEL: " + (diffInc + 1), SCREEN_WIDTH - 2, 24);
    pop();
}

function restart() {
    //  yaz = new Cat();
    pizzas = [];
    addPizza();
    running = true;
    score = 0;
    frameRate(bfps);
    diffInc = 0;
}

function addPizza() {
    pizzas.push(new Pizza);
}

function keyPressed() {
    mirr = p5.Vector.mult(yaz.vel, (-1));

    if (keyReady) {
        keyReady = false;
        if (keyCode == UP_ARROW) {
            if (!mirr.equals(createVector(0, -1))) {
                yaz.vel.set(0, -1);
                sendTurn(NORTH);

            }
        } else if (keyCode == DOWN_ARROW) {

            if (!mirr.equals(createVector(0, 1))) {
                yaz.vel.set(0, 1);
                sendTurn(SOUTH);
            }
        } else if (keyCode == RIGHT_ARROW) {

            if (!mirr.equals(createVector(1, 0))) {
                yaz.vel.set(1, 0);
                sendTurn(EAST);
            }
        } else if (keyCode == LEFT_ARROW) {

            if (!mirr.equals(createVector(-1, 0))) {
                yaz.vel.set(-1, 0);
                sendTurn(WEST);
            }
        } else {

            keyReady = true;
        }
    }
    if (yaz.dead || menu) {
        if (keyCode == 13) {
            menu = false;
            restart();
        }
    } else {
        if (keyCode == 80) {
            running = !running;
        }
    }

}

function draw() {
    background(100, 149, 237);
    drawGrid();
    for (var p = 0; p < pizzas.length; p++) {
        pizzas[p].draw();
    }
    if (running && !menu) {
        yaz.update();
        sendMove();
    }
    yaz.draw();

    for(var player in players){
      //console.log(players[player].name +" IS HERE!");
      var c = color(255, 204, 0);
      fill(c);
      for(var b in players[player].body){

        drawPlayer(players[player].body[b]);
      //  players[player].body[b];
      }
    //  rect(players[player].pos.x, players[player].pos.y, UNIT, UNIT);
      noFill();
    }

    keyReady = true;
    //  rect(SCREEN_WIDTH/2-SCREEN_WIDTH/4, SCREEN_HEIGHT/2,SCREEN_WIDTH/2, SCREEN_HEIGHT/5);
    if (yaz.dead && !running) {
        gameOver();
    }

    if (menu) {
        intro();
    }
    GUI();
}

function drawGrid() {
    for (var x = 0; x < SCREEN_WIDTH; x += UNIT) {
        line(x, 0, x, SCREEN_HEIGHT);
        //console.log('x:'+x);


    }
    for (var y = 0; y < SCREEN_WIDTH; y += UNIT) {
        line(0, y, SCREEN_WIDTH, y);
        //console.log('y:'+y);
    }
}

var tail, pizza, head, body, corner, corner2;

function loadImages() {
    tail = loadImage("assets/tail.png");
    pizza = loadImage("assets/pizza.png");
    head = loadImage("assets/head.png");
    body = loadImage("assets/body.png");
    corner = loadImage("assets/corner.png");
    corner2 = loadImage("assets/corner2.png");

}
