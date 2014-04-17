var player = {
  startX: 300,
  sizeX: 15,
  sizeY: 15,
  startY: 300,
  x: 300,
  y: 300,
  radius: 5,
};

Bullet = function(){
  this.x = -10;
  this.y = -10;
  this.color = "yellow";
  this.radius = 10;
  this.xv = 1;
  this.yv = 1;
  this.angle = 0;
  this.angularVelocity = 0.1;
}

//VARS
var bullet_array = [];
var sinceLastBullet = 0;
var lb0, lb1;
var bomb = false;
var numBombs = 3;

function createPlayer(context){
  bullet_array.length = 0;
  numBombs = 3;
  player.x = player.startX;
  player.y = player.startY;
}

function drawPlayer(context){
  context.beginPath();
  context.arc(player.x, player.y, player.radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'yellow';
  context.fill();
}

function drawBullets(context){
  for (var i = bullet_array.length - 1; i >= 0; i--) {
    var b = bullet_array[i]
    context.beginPath();
    context.arc(b.x, b.y, b.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'yellow';
    context.fill();
  };
}

function spawnBullet(){
  var spin = 0;
  var numBullets = 14;
  for(var i = 0; i <= numBullets; i++){
    t = new Bullet();
    t.x = player.x;
    t.y = player.y;


    spin += 0.5;
    if(spin > 2*Math.PI)
      spin -= Math.sin(spin);

    t.xv = 3*Math.cos(spin);
    t.yv = 3*Math.sin(spin);


    bullet_array.push(t);
  };
}

function updateBullets(){
  for (var i = bullet_array.length - 1; i >= 0; i--) {
    var t = bullet_array[i];

    t.x += t.xv;
    t.y += t.yv;

    //remove from enemy_arry if they go off screen
    if((t.y - t.radius) <= 0){
      var index = bullet_array.indexOf(t);
      if(index > -1){
        bullet_array.splice(index, 1);
      }
      //console.log("removed");
    }
  };

}

function updatePlayer(map){
  var dx = 0, dy = 0;

  //spacebar

  if(map[32] && !bomb){
    bomb = true
    if(numBombs > 0){
      spawnBullet();
      numBombs--;
    }
  }
  else if(!map[32])
    bomb = false;
  //right + up
  if(map[39] && map[38]){dx = 3;dy = -3;}
  //left + down
  else if(map[37] && map[40]){dx = -3;dy = 3;}
  //right + down
  else if(map[39] && map[40]){dx = 3;dy = 3;}
  //left + up
  else if(map[37] && map[38]){dx = -3;dy = -3;}
  //left
  else if(map[37]){dx = -4;}
  //up
  else if(map[38]){dy = -4;}
  //right
  else if(map[39]){dx = 4;}
  //down
  else if(map[40]){dy = 4;}
  else{dx = dx * -1;dy = dy * -1;}

  player.x = player.x + dx;
  player.y = player.y + dy;
  checkCollisionWithPlayerBullet();
  if(checkCollisionWithPlayer())
    return true;
  else
    return false;

}

function checkCollisionWithPlayer(){
  //collision between two circles:
  //(R0-R1)^2 <= (x0-x1)^2+(y0-y1)^2 <= (R0+R1)^2
  var enemy_array = getEnemy();
  var collided = false;

  for (var i = enemy_array.length - 1; i >= 0; i--){
    var enemy = enemy_array[i];
    if( Math.pow((player.radius-enemy.radius),2) <= (Math.pow((player.x-enemy.x),2)+Math.pow((player.y-enemy.y),2))
      && (Math.pow((player.x-enemy.x),2) + Math.pow((player.y-enemy.y),2)) <= Math.pow((player.radius+enemy.radius),2)){
        collided = true;
    }
  }
  return collided;
}

function getNumBombs(){
  return numBombs;
}
function setNumBombs(b){
  numBombs += b;
}

function checkCollisionWithPlayerBullet(){
  var enemy_array = getEnemy();
  var playerBulletCollided = false;
  //now check to see if the enemy bullets collide with any active bombs
  for (var i = enemy_array.length - 1; i >= 0; i--){
    var enemy = enemy_array[i];
    if(bullet_array.length > 0){
      for (var j = bullet_array.length - 1; j >= 0; j--) {
        var t = bullet_array[j];
        var r = t.radius + enemy.radius;
        var r2 = t.radius - enemy.radius;
        r2 *= r2;
        r *= r;
        if(Math.pow((t.radius-enemy.radius),2) <= (Math.pow((t.x-enemy.x),2)+Math.pow((t.y-enemy.y),2))
      && (Math.pow((t.x-enemy.x),2) + Math.pow((t.y-enemy.y),2)) <= Math.pow((t.radius+enemy.radius),2)){
            playerBulletCollided = true;

            var index = enemy_array.indexOf(enemy);
            removeEnemyBullet(index);
        }
      };
    }//endif
  };
}

