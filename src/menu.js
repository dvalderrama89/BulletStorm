var screenHeight = 400;

MenuElement = function(t){
  this.font = "30px Arial";
  this.fillStyle = "yellow";
  this.strokeStyle = "black";
  this.lineWidth = 5;
  this.miterLimit = 2;
  this.selected = false;
  this.x = 200;
  this.y = 0;
  this.text = t;
}

//menu items
var start = new MenuElement("START");
start.fillStyle = "red";
var controls = new MenuElement("CONTROLS");
var scores = new MenuElement("SCORES");
var options = new MenuElement("OPTIONS");


//game over items
var endScore;
var stext;
var playerScoreText;
function setEndScore(score){
  endScore = score;
  stext = "Your score: " + endScore;
  playerScoreText = new MenuElement(stext);

  //wait to push here so that the variable for the ending score
  //are set properly
  gameOver_array.push(gameOverText);
  gameOver_array.push(playerScoreText);
  gameOver_array.push(continueText);
  gameOver_array.push(yesText);
  gameOver_array.push(noText);

  go_counter = gameOver_array.length-2;
}
var gameOverText = new MenuElement("Game Over");
var continueText = new MenuElement("Retry?");
var yesText = new MenuElement("Yes");
yesText.fillStyle = "red";
var noText = new MenuElement("No");

//menu arrays
var menu_array = [];
var gameOver_array = [];

//menu options
var pressed = false;
var selection = false;
var counter = 0;

//gameOver options
var go_counter;
var p_right = false;
var p_left = false;
var go_selection = false;

//push to menu
menu_array.push(start);
menu_array.push(controls);
menu_array.push(scores);
menu_array.push(options);

function gameOverMenu(context, map){
  //left
  if(map[37] && !p_left){
    if(go_counter < gameOver_array.length && go_counter > gameOver_array.length-2){
      gameOver_array[go_counter].fillStyle = "yellow";
      gameOver_array[go_counter-1].fillStyle = "red";
      p_left = true;
      go_counter--;
    }
    else if(go_counter > gameOver_array.length-3 && go_counter < gameOver_array.length-1){
      gameOver_array[go_counter].fillStyle = "yellow";
      gameOver_array[go_counter+1].fillStyle = "red";
      p_left = true;
      go_counter = gameOver_array.length-1;
    }
  }
  //right
  if(map[39] && !p_right){
    if(go_counter < gameOver_array.length-1){
      gameOver_array[go_counter].fillStyle = "yellow";
      gameOver_array[go_counter+1].fillStyle = "red";
      p_right = true;
      go_counter++;
    }
    else if(go_counter >= gameOver_array.length-1){
      gameOver_array[go_counter].fillStyle = "yellow";
      gameOver_array[go_counter-1].fillStyle = "red";
      p_right = true;
      go_counter = gameOver_array.length-2;
    }

  }

  if(map[13] && !go_selection){
    if(go_counter == gameOver_array.length -2){
      //clear the game over array because it is initialized
      //every time the game ends
      gameOver_array.length = 0;
      return 1;
    }
    else if(go_counter == gameOver_array.length-1)
      return 0;
    else
      console.log("error in game menu go_selection");

    go_selection = true;
  }


  if(!map[13])
    go_selection = false;


  if(!map[39])
    p_right = false;
  if(!map[37])
    p_left = false;

  for (var i = gameOver_array.length - 1; i >= 0; i--) {
    var item = gameOver_array[i];
    context.font = item.font;
    context.lineWidth = item.lineWidth;
    context.miterLimit = item.miterLimit;
    context.fillStyle = item.fillStyle;
    context.strokeStyle = item.strokeStyle;
    if(i != gameOver_array.length-1){
      context.strokeText(item.text, item.x, item.y+(i+1)*70);
      context.fillText(item.text, item.x, item.y+(i+1)*70);
    }
    else{
      context.strokeText(item.text, item.x+100, item.y+(i)*70);
      context.fillText(item.text, item.x+100, item.y+(i)*70);
    }
  };
}


function mainMenu(context, map){
  if (map[32] && !pressed){
    if(counter >= menu_array.length-1){
      menu_array[counter].fillStyle = "yellow";
      counter = 0;
      menu_array[counter].fillStyle = "red";
      pressed = true;
    }
    else{
      menu_array[counter].fillStyle = "yellow";
      menu_array[counter+1].fillStyle = "red";
      pressed = true;
      counter++;
    }
  }
  else if(map[13] && !selection){
    switch(counter){
      case 0: console.log("start"); return 1; break;
      case 1: console.log("controls"); break;
      case 2: console.log("scores"); break;
      case 3: console.log("options"); break;
      default: console.log("error"); break;
    }
    selection = true;
  }
  if(!map[13])
    selection = false;
  if(!map[32]){
    pressed = false;
  }
  for (var i = menu_array.length - 1; i >= 0; i--) {
    var item = menu_array[i];
    context.font = item.font;
    context.lineWidth = item.lineWidth;
    context.miterLimit = item.miterLimit;
    context.fillStyle = item.fillStyle;
    context.strokeStyle = item.strokeStyle;
    context.strokeText(item.text, item.x, item.y+(i+1)*80);
    context.fillText(item.text, item.x, item.y+(i+1)*80);
  };
}

