$(document).ready(function(){
  $("#container").append("<canvas id='canvas'></canvas>");

  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
  }());

  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d");
    screenWidth = 600,
    screenHeight = 400,
    paused = false,
    d = "";

  var map = [];
  var score = 0;
  canvas.width = screenWidth;
  canvas.height = screenHeight;

  function fillCanvas(){
    context.fillStyle = "#444349";
    context.fillRect(0,0,screenWidth, screenHeight);
    context.strokeStyle = "white";
    context.strokeRect(0,0,screenWidth,screenHeight);
  }

  fillCanvas();
  createPlayer(context);

  var fps = 60;
  var t0, t1;
  var tScore = 0;
  function update() {

    var gameLoop = requestAnimationFrame(update);
    var gameOver = updatePlayer(map);

    updateParticles(screenWidth, screenHeight);
    updateBullets();
    score++;
    tScore++;
    if(tScore > 500){
      setNumBombs(1);
      tScore = 0;
    }

    draw();


    if(gameOver)
      cancelAnimationFrame(gameLoop);


  }
  update();

  function getScore(){
    return score;
  }

  function draw(){
    fillCanvas();
    drawBullets(context);
    drawPlayer(context);
    drawEnemy(context);
    drawScore();

  }
  function drawScore(){
    var bombs = getNumBombs();
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText("Score: " + score, 10,380);
    context.fillText("Bombs: " + bombs, 10, 350);
  }

  var totalTime = 0;
  function generateParticles() {
      requestAnimationFrame(generateParticles);
      t0 = performance.now();
      t1 = performance.now();
      totalTime += (t1-t0);

      if(totalTime >= 0.005){
        //console.log("executing...");
        particleGeneration();
        totalTime = 0;
      }
  }
  generateParticles();

  //Handle multiple keypresses
  /*
  spacebar = 32
  left = 37
  up = 38
  right = 39
  down = 40
  */
  $(document).keydown(function(e){
    var key = e.which;
    map[key] = e.type == 'keydown';
  }).keyup(function(e){
    var key = e.which;
    map[key] = e.type == 'keydown';
  });

});

