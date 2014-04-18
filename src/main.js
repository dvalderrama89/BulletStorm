/*
Known issues:
  -Reinits the game over menu after a retry
    which is a possible cause behind the game over menu blinking on "no" selection
*/

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

  //VARS
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
  var fps = 60;
  var t0, t1;
  var tScore = 0;
  var totalTime = 0;

  //MAIN CALL TO GAME LOOP
  startScreen();

  //FUNCTION DEFS
  function init(){
    fillCanvas();
    createPlayer(context);
    createEnemy();
    clearMap();
    resetScore();
    update();
    generateParticles();
  }

  function startScreen(){
    var startScreenID = requestAnimationFrame(startScreen);
    fillCanvas();
    var selectedOption = mainMenu(context, map);

    //start game
    if(selectedOption){
      cancelAnimationFrame(startScreenID);
      init();
    }
  }

  function clearMap(){
    map.length = 0;
  }
  function resetScore(){
    score = 0;
    tScore = 0;
  }

  function fillCanvas(){
    context.fillStyle = "#444349";
    context.fillRect(0,0,screenWidth, screenHeight);
    context.strokeStyle = "white";
    context.strokeRect(0,0,screenWidth,screenHeight);
  }

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
    if(gameOver){
      cancelAnimationFrame(gameLoop);

      //call setEndScore here to avoid pushing it multiple
      //times in menu.js
      //Send score to game over menu
      setEndScore(score);
      gameOverScreen();
    }
  }

  //kd = keydown
  var kd = false;
  var retry;
  function gameOverScreen(){
    var endGameLoop = requestAnimationFrame(gameOverScreen);

    //fill canvas with grey to mask the particles in the background
    fillCanvas();

    //send score to leaderboard
    setScore(score);

    //display game over menu
    retry = gameOverMenu(context, map);


    if(map[13] && !kd && retry == 1){
      kd = true;
      cancelAnimationFrame(endGameLoop);
      init();
    }
    else if(!map[13])
      kd = false;
  }

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

  /*
  Handle multiple keypresses
  ---------------------------
  spacebar = 32
  left = 37
  up = 38
  right = 39
  down = 40
  enter = 13
  */
  $(document).keydown(function(e){
    var key = e.which;
    map[key] = e.type == 'keydown';
  }).keyup(function(e){
    var key = e.which;
    map[key] = e.type == 'keydown';
  });

});

