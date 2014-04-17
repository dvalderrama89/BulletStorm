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

var start = new MenuElement("START");
start.fillStyle = "red";
var controls = new MenuElement("CONTROLS");
var scores = new MenuElement("SCORES");
var options = new MenuElement("OPTIONS");
var menu_array = [];
var pressed = false;
var selection = false;
var counter = 0;

menu_array.push(start);
menu_array.push(controls);
menu_array.push(scores);
menu_array.push(options);


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

