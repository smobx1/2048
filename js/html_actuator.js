function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");

  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");


/// smobx1
    if (tile.value > 1 && tile.value < 3) inner.classList.add("tile-nr-2");
    if (tile.value > 3 && tile.value < 5) inner.classList.add("tile-nr-4");
    if (tile.value > 7 && tile.value < 9) inner.classList.add("tile-nr-8");
    if (tile.value > 15 && tile.value < 17) inner.classList.add("tile-nr-16");
    if (tile.value > 31 && tile.value < 33) inner.classList.add("tile-nr-32");
    if (tile.value > 63 && tile.value < 65) inner.classList.add("tile-nr-64");
    if (tile.value > 127 && tile.value < 129) inner.classList.add("tile-nr-128");
    if (tile.value > 255 && tile.value < 257) inner.classList.add("tile-nr-256");
    if (tile.value > 511 && tile.value < 513) inner.classList.add("tile-nr-512");
    if (tile.value > 1023 && tile.value < 1025) inner.classList.add("tile-nr-1024");
    if (tile.value > 2047 && tile.value < 2049) inner.classList.add("tile-nr-2048");

    ////////////////// test sunete
    var volume = 10;
    // var sound2 = new buzz.sound("sounds/cristi.mp3");         // jump()
    // var sound4 = new buzz.sound("sounds/4.mp3");       // trece prin pipes()
    // var sound8 = new buzz.sound("sounds/sfx_hit.mp3");           // hit()
    // var sound16 = new buzz.sound("sounds/cristi.mp3");           // 1s dupa hit()
    // var sound32 = new buzz.sound("sounds/cristi.mp3");  // la      start() (hu)
    // var sound64 = new buzz.sound("sounds/cristi.mp3");  // la      start() (hu)
    var sound128 = new buzz.sound("sounds/biju.mp3");  // la      start() (hu)
    var sound256 = new buzz.sound("sounds/minune.mp3");  // la      start() (hu)
    var sound512 = new buzz.sound("sounds/guta.mp3");  // la      start() (hu)
    var sound1024 = new buzz.sound("sounds/mocanu.mp3");  // la      start() (hu)
    sound128.preload='auto';
    sound256.preload='auto';
    sound512.preload='auto';
    sound1024.preload='auto';
    // var sound2048 = new buzz.sound("sounds/salam.mp3");  // la      start() (hu)
    buzz.all().setVolume(volume);


     if(tile.value === 128){
       sound128.play();
       tile.value = tile.value + 0.001;
     }
     if(tile.value === 256){
       sound256.play();
       tile.value = tile.value + 0.001;
     }
     if(tile.value === 512){
       sound512.play();
       tile.value = tile.value + 0.001;
     }
     if(tile.value === 1024){
       sound1024.play();
       tile.value = tile.value + 0.001;
     }






    ///////////////////// test sunete



    if(tile.value > 31){ // conditie sa apara ceva dupa ce apare tile cu nr 32
      // alert();
    }
/// smobx1 end

  // $(".tile-inner").wrapInner( "<div class='text-inauntru'></div>");

  this.applyClasses(wrapper, classes);
  inner.classList.add("tile-inner");
  inner.textContent = parseInt(tile.value);

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = parseInt(score) - this.score;
  this.score = parseInt(score);

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = parseInt(bestScore);
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "Ai castigat!" : "Ai pierdut!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
