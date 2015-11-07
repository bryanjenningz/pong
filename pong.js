(function() {
  var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d');
    var gameSize = { x: canvas.width, y: canvas.height };

    var player1 = new Player(this, gameSize, { UP: 87, DOWN: 83 }, 10);
    var player2 = new Player(this, gameSize, { UP: 38, DOWN: 40 }, gameSize.x - 10);


    this.bodies = [player1, player2, new Ball(this, gameSize)];

    var self = this;
    var loop = function() {
      self.update();
      self.draw(screen, gameSize);
      requestAnimationFrame(loop);
    };

    loop();
  };

  var drawBody = function(screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2,
                    body.center.y - body.size.y / 2,
                    body.size.x, body.size.y);
  };

  var collisions = function(bodies) {
    var right = (body) => body.center.x + body.size.x / 2;
    var left = (body) => body.center.x - body.size.x / 2;
    var top = (body) => body.center.y - body.size.y / 2;
    var bottom = (body) => body.center.y + body.size.y / 2;

    return bodies.filter(function(body) {
      return bodies.some(function(other) {
        return body !== other && 
          ((left(body) < right(other) && right(body) > left(other) &&
            top(body) < bottom(other) && bottom(body) > top(other)) ||
          (left(other) < right(body) && right(other) > left(body) &&
            top(other) < bottom(body) && bottom(other) > top(body)));
      });
    });
  };

  var isBall = function(body) {
    return body instanceof Ball;
  };

  Game.prototype = {
    update: function() {
      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update();
      }
      collisions(this.bodies).filter(isBall).forEach(function(ball) {
        ball.velocity.x *= -1;
        ball.velocity.y = Math.floor(Math.random() * 11) - 5;
      });
    },
    draw: function(screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y);
      for (var i = 0; i < this.bodies.length; i++) {
        drawBody(screen, this.bodies[i]);
      }
    }
  };

  var Player = function(game, gameSize, keys, x) {
    this.game = game;
    this.gameSize = gameSize;
    this.size = { x: 10, y: 40 };
    this.center = { x: x || 20, y: gameSize.y / 2 };
    this.keyboard = new Keyboard(keys);
  };

  Player.prototype = {
    update: function() {
      if (this.keyboard.isDown(this.keyboard.KEYS.UP)) {
        this.center.y -= 5;
      } else if (this.keyboard.isDown(this.keyboard.KEYS.DOWN)) {
        this.center.y += 5;
      }
      if (this.center.y < 0) this.center.y = 0;
      if (this.center.y > this.gameSize.y) this.center.y = this.gameSize.y;
    }
  };

  var Keyboard = (function() {
    // nonglobal keyState hashtable that's shared by all Keyboard instances
    var keyState = {};

    return function(keys) {
      this.KEYS = keys || { UP: 38, DOWN: 40 };
      this.isDown = function(keyCode) {
        return keyState[keyCode] === true;
      };

      window.onkeydown = function(e) {
        console.log(JSON.stringify(self.KEYS));
        keyState[e.keyCode] = true;
      };

      window.onkeyup = function(e) {
        keyState[e.keyCode] = false;
      };
    };
  })();
  

  var Ball = function(game, gameSize, startHeight) {
    this.game = game;
    this.gameSize = gameSize;
    this.size = { x: 10, y: 10 };
    this.velocity = { x: (Math.floor(Math.random() * 2) ? 1 : -1) * 3, y: 0 };
    this.center = {
      x: gameSize.x / 2,
      y: startHeight || Math.floor(Math.random() 
        * (gameSize.y - this.size.y)) + this.size.y / 2
    };
  };

  Ball.prototype = {
    update: function() {
      this.center.x += this.velocity.x;
      if (this.center.x <= 0 || this.center.x >= this.gameSize.x) {
        this.velocity.x *= -1;
      }
      this.center.y += this.velocity.y;
      if (this.center.y <= 0 || this.center.y >= this.gameSize.y) {
        this.velocity.y *= -1;
      }
    }
  };

  window.onload = function() {
    new Game('screen');
  };
})();
