var F_TOP;
var F_BOT;
var F_RIGHT;
var F_LEFT;

var T_HEAD = 0;
var T_BODY = 1;
var T_TAIL = 2;
var T_CONNECT = 3;

var order;

var diffInc = 0;

function Cat() {


    this.dead = false;
    this.pos = createVector(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    this.vel = createVector(1, 0);

    this.parts = [new Part(this.pos.x, this.pos.y, F_RIGHT), new Part(this.pos.x - UNIT, this.pos.y, F_RIGHT), new Part(this.pos.x - UNIT - UNIT, this.pos.y, F_RIGHT)];

    this.setPos = function(x,y){
      this.pos = createVector(x, y);

      this.parts = [new Part(this.pos.x, this.pos.y, F_RIGHT), new Part(this.pos.x - UNIT, this.pos.y, F_RIGHT), new Part(this.pos.x - UNIT - UNIT, this.pos.y, F_RIGHT)];

    };

    this.draw = function() {

        for (var i = 0; i < this.parts.length; i++) {

            if (i > 0 && i < this.parts.length - 1) {

                if (this.parts[i].facing != this.parts[i - 1].facing) {
                    var n = order.indexOf(this.parts[i].facing);
                    if (n == 0) {
                        n = order.length;
                    }
                    this.parts[i].draw(T_CONNECT, order[n - 1] == this.parts[i - 1].facing);
                    //console.

                } else {
                    this.parts[i].draw((i == 0) ? 0 : (i == this.parts.length - 1) ? 2 : 1);
                }


            } else {
                this.parts[i].draw((i == 0) ? 0 : (i == this.parts.length - 1) ? 2 : 1);
            }


        }

    };

    this.ate = false;

    this.onPizza = function() {
        for (var i = 0; i < pizzas.length; i++) {
            if (this.pos.equals(p5.Vector.mult(pizzas[i].pos, (UNIT)))) {
                pizzas[i].eat();
                this.ate = true;
                score += 10;
                if (score % 50 == 0) {
                    incDiff();
                }
            }
        }
    }

    this.die = function() {
        this.dead = true;
        running = false;
    }
    this.checkBounds = function() {
        if (this.pos.x >= SCREEN_WIDTH) {
            this.pos.x = 0;
        } else if (this.pos.x < 0) {
            this.pos.x = SCREEN_WIDTH - UNIT;
        }
        if (this.pos.y >= SCREEN_HEIGHT) {
            this.pos.y = 0;
        } else if (this.pos.y < 0) {
            this.pos.y = SCREEN_HEIGHT - UNIT;
        }
    }

    this.update = function() {

        this.pos.add(p5.Vector.mult(this.vel, (UNIT)));
        this.checkBounds();

        //console.log(this.pos);
        this.onPizza();
        var f;
        if (this.vel.x != 0) {
            f = (this.vel.x == 1) ? F_RIGHT : F_LEFT;
        } else if (this.vel.y != 0) {
            f = (this.vel.y == 1) ? F_BOT : F_TOP;
        }


        if (this.ate) {
            this.parts.push(new Part(this.pos.x, this.pos.y, F_RIGHT));
            this.ate = false;
        }
        for (var i = this.parts.length - 1; i >= 0; i--) {
            if (i == 0) {
                this.parts[i].pos.set(this.pos.x, this.pos.y);
                this.parts[i].facing = f;
            } else if (i == this.parts.length - 1) {
                this.parts[i].pos.set(this.parts[i - 1].pos.x,this.parts[i - 1].pos.y);
                this.parts[i].facing=this.parts[i-2].facing;

            } else {
                this.parts[i].set(this.parts[i - 1]);
            }

            //  this.parts[i].draw((i == 0) ? 0 : (i == this.parts.length - 1) ? 2 : 1);

        }

        for (var i = 2; i < this.parts.length; i++) {
            if (this.pos.equals(this.parts[i].pos)) {
                this.die();
            }
        }

    };



}

function Part(x, y, facing) {
    this.facing = facing;
    this.pos = createVector(x, y);

    this.set = function(p) {
        this.pos.set(p.pos.x, p.pos.y);
        this.facing = p.facing;
    }


    this.draw = function(type, tst) {

        push();
        translate(this.pos.x + UNIT / 2, this.pos.y + UNIT / 2);
        var xtra = 0;
        if (type == T_CONNECT) {
            xtra = tst ? PI : PI + PI / 2;

        }
        rotate(this.facing + xtra);
        translate(-UNIT / 2, -UNIT / 2);
        switch (type) {
            case T_HEAD:
                image(head, 0, 0, UNIT, UNIT);
                break;
            case T_BODY:
            default:
                image(body, 0, 0, UNIT, UNIT);
                break;
            case T_TAIL:
                image(tail, 0, 0, UNIT, UNIT);
                break;
            case T_CONNECT:
                image(tst ? corner2 : corner, 0, 0, UNIT, UNIT);
                break;

        }

        pop();
        //  translate(0, 0);
    }

}


function Pizza() {

    this.pos = createVector(floor(random(0, cols)), floor(random(0, rows)));

    this.eat = function() {
        this.pos = createVector(floor(random(0, cols)), floor(random(0, rows)));
    }

    this.draw = function() {

        image(pizza, this.pos.x * UNIT, this.pos.y * UNIT, UNIT, UNIT);

    };

}
var NORTH = 0,
    SOUTH = 2,
    EAST = 1,
    WEST = 3;
function drawPlayer(data){

    switch(data.o){
      case NORTH:
        rect(data.x*UNIT,data.y*UNIT,UNIT,data.l*(-UNIT));
      break;
      case SOUTH:
        rect(data.x*UNIT,data.y*UNIT,UNIT,data.l*(UNIT));
      break;
      case EAST:
        rect(data.x*UNIT+UNIT,data.y*UNIT,data.l*(UNIT),UNIT);
      break;
      case WEST:
        rect(data.x*UNIT-UNIT,data.y*UNIT,data.l*(-UNIT),UNIT);
      break;
    }
}
