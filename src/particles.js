Enemy = function() {
  this.radius = 15;
  this.x = 200;
  this.y = 200;
  this.startX = 0;
  this.startY = 0;
  this.xv = 0;
  this.yv = 0;
}

var enemy_array = [];

function createEnemy(){
  enemy_array.length = 0;
}

function drawEnemy(context){
  for (var i = enemy_array.length - 1; i >= 0; i--) {
    var t = enemy_array[i]
    context.beginPath();
    context.arc(t.x, t.y, t.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
  };
}

function particleGeneration(){
  var t = new Enemy();
  var t2 = new Enemy();

  t.x = t.startX+20;
  t.y = t.startY+20;

  t2.x = t2.startX+580;
  t2.y = t2.startY;

  t.xv = Math.random()*5;
  t.yv = Math.random()*5;

  t2.xv = Math.random()* -5;
  t2.yv = Math.random()*5;

  enemy_array.push(t);
  enemy_array.push(t2);
}

function updateParticles(screenWidth, screenHeight){
  for (var i = enemy_array.length - 1; i >= 0; i--) {
    var t = enemy_array[i];
    t.x += t.xv;
    t.y += t.yv;

    //remove from enemy_arry if they go off screen
    if((t.x + t.radius) >= screenWidth || (t.y + t.radius) >= screenHeight){
      var index = enemy_array.indexOf(t);
      if(index > -1){
        enemy_array.splice(index, 1);
      }
      //console.log("removed");
    }
    //TO DO: REMOVE FROM LEFT SIDE OF SCREEN TO ACCOUNT FOR T2
    if((t.x-t.radius) <= 0 || (t.y+t.radius) >= screenHeight){
      var index = enemy_array.indexOf(t)
      if(index > -1){
        enemy_array.splice(index,1);
        //console.log("removed");
      }

    }
  };
}

function removeEnemyBullet(index){
  if(index > -1)
    enemy_array.splice(index,1);
}

function getEnemy(){
  return enemy_array;
}
