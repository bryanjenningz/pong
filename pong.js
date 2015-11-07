(function() {
  var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d');
    var gameSize = { x: canvas.width, y: canvas.height };

    this.bodies = [new Player(this, gameSize), new Ball(this, gameSize)];

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
    return bodies.filter(function(body) {
      return bodies.some(function(other) {
        var right = (body) => body.center.x + body.size.x / 2;
        var left = (body) => body.center.x - body.size.x / 2;
        var top = (body) => body.center.y - body.size.y / 2;
        var bottom = (body) => body.center.y + body.size.y / 2;
        return body !== other && 
          !(left(body) < right(other) && right(body) > left(other)) &&
          !(top(body) < bottom(other) && bottom(body) > top(other));
      });
    });
  };

  Game.prototype = {
    update: function() {
      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update();
      }
    },
    draw: function(screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y);
      for (var i = 0; i < this.bodies.length; i++) {
        drawBody(screen, this.bodies[i]);
      }
    }
  };

  var Player = function(game, gameSize) {
    this.game = game;
    this.gameSize = gameSize;
    this.size = { x: 10, y: 40 };
    this.center = { x: 20, y: gameSize.y / 2 };
    this.keyboard = new Keyboard();
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

  var Keyboard = function(keys) {
    var keyState = {};
    this.KEYS = keys || { UP: 38, DOWN: 40 };

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

    window.onkeydown = function(e) {
      keyState[e.keyCode] = true;
    };

    window.onkeyup = function(e) {
      keyState[e.keyCode] = false;
    };
  };

  var Ball = function(game, gameSize, startHeight) {
    this.game = game;
    this.gameSize = gameSize;
    this.size = { x: 10, y: 10 };
    this.velocity = { x: 3, y: 0 };
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