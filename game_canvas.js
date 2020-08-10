/*
HI THERE!
Thank you for your interest in the inner workings of the game.
The game is a tribute to the famous T-Rex Run from the Google Chrom web browser team.
I did this as a preview of my general abilities, if you like what you see here, feel free to contact me.
Also, if for any reason you need any of this code, feel free to use it.
´´´´¶¶¶¶¶¶´´´´´´¶¶¶¶¶¶
´´¶¶¶¶¶¶¶¶¶¶´´¶¶¶¶¶¶¶¶¶¶
´¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶´´´´¶¶¶¶
¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶´´´´¶¶¶¶
¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶´´¶¶¶¶¶
¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶ ´¶¶¶¶¶´
´´¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶
´´´´´¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶
´´´´´´´¶¶¶¶¶¶¶¶¶¶¶¶¶
´´´´´´´´´¶¶¶¶¶¶¶¶
´´´´´´´´´´´¶¶¶¶
*/
const canv = document.getElementById("game_canvas");
var canv_width = 700; var canv_height = 200;
const ctx = canv.getContext("2d");

const char_intro = document.getElementById("character_intro");
const char_stnd = document.getElementById("character_standing");
const char_run1 = document.getElementById("character_running_1");
const char_run2 = document.getElementById("character_running_2");
const char_crush = document.getElementById("character_crush");
var char_x = 10; var char_y = 135; var char_frame = 0; var jumping = false; var tMovingUp; var tMovingDown;
var char_width = 60; var char_height = 50;

const bck_grnd = document.getElementById("ground");
const bck_sky = document.getElementById("cloud");
var bck_width = 1100; var bck_height = 200;
var bck_grnd_x = -1 * (bck_width - char_width - 20); var bck_grnd_y = 170;
var bck_sky_x = canv.width + 10; var bck_sky_y = 10;
var started = false;

const obst_gnd = document.getElementById("obstacle_ground");
var obst_gnd_x = 800; var obst_gnd_y = 140;
var start_obst_x = 800;
var obst_x_arr = [start_obst_x];
var min_obst_dist = canv_width/2; var max_obst_dist = canv_width;
var obst_gnd_width = 30; var obst_gnd_height = 45;

const game_over_msg = document.getElementById("game_over_msg");
//var game_over_x = canv.width/2 - game_over_msg.width/2;
//var game_over_y = canv.height/2 - game_over_msg.height/2 - 15;
const replay_img = document.getElementById("replay_img");
//var replay_img_x = canv.width/2 - replay_img.width/2;
//var replay_img_y = canv.height/2 - replay_img.height/2 + 30;
var game_over_x = 240; var game_over_y = 73; var replay_img_x = 330; var replay_img_y = 113;
var game_over_width =220; var game_over_height =25; var replay_img_width =35; var replay_img_height =35;

const hi_message = document.getElementById("hi_message");
var score = 0; var hi_score = 0;
var hi_message_width = 35; var hi_message_height = 35;
var t_count_score;

var intro = true;
const intro_speed = 8;

const start_speed = 6;
var speed = start_speed;
const start_inc = 5;
var obst_speed_inc = start_inc;

var disabled = false;

window.onload = function(){
  ctx.drawImage(bck_grnd, bck_grnd_x,bck_grnd_y, bck_width, bck_height );
  ctx.drawImage(char_intro, char_x,char_y, char_width, char_height );
  ctx.font = "12px monospace"; ctx.fillStyle = "#5F6367";
  ctx.fillText("Click me!", 10, 130);
}

//Handles user pressing space, either sets the game in motion or makes the character jump.
function start() {
  if (intro && !disabled) {
    disabled = true;
    intro_move();
  } else if (!started && !disabled){
    started = true;
    t_count_score = setInterval(countScore,50);
    move();
  } else jump();
}

//Animates intro before the game begins.
function intro_move() {
  ctx.clearRect(0, 0, canv_width, canv_height);
  bck_grnd_x = bck_grnd_x + intro_speed;
  ctx.drawImage(bck_grnd, bck_grnd_x, bck_grnd_y, bck_width, bck_height);
  ctx.drawImage(char_intro, char_x,char_y, char_width, char_height );

  if (bck_grnd_x < -1 * (bck_width - canv_width))
    window.requestAnimationFrame(intro_move);
  else {
    intro = false;
    disabled = false;
    start();
  }
}

//Animates everything generally.
function move() {
  if (started){
    ctx.clearRect(0, 0, canv_width, canv_height);

    bck_sky_x = bck_sky_x-speed;
    bck_grnd_x = bck_grnd_x-speed;

    bck_sky_x = move_bck(bck_sky, bck_sky_x, bck_sky_y);
    bck_grnd_x = move_bck(bck_grnd, bck_grnd_x, bck_grnd_y);

    move_char();
    move_obst();

    ctx.drawImage(hi_message, 500, 20, hi_message_width, hi_message_height );
    ctx.font = "20px monospace"; ctx.fillStyle = "#5F6367";
    ctx.fillText(pad(hi_score, hi_score.toString().length), 550, 45);
    ctx.fillStyle = "#535353";
    ctx.fillText(pad(score, score.toString().length), 630, 45);

    window.requestAnimationFrame(move);
  } else {
    stop();
  }
}

//Stops the run if the user hit an obstacle.
function stop() {
  started = false;

  obst_x_arr = obst_clean(obst_x_arr, 1);
  obst_x_arr[0] = start_obst_x;

  move_char();
  char_y = obst_gnd_y - 5;
  jumping = false;

  bck_grnd_x = -1 * (bck_width - canv_width);
  bck_sky_x = canv_width + 10; var bck_sky_y = 0;

  speed = start_speed;
  obst_speed_inc = start_inc;

  ctx.drawImage(game_over_msg, game_over_x, game_over_y, game_over_width, game_over_height);
  ctx.drawImage(replay_img, replay_img_x, replay_img_y, replay_img_width, replay_img_height);

  clearInterval(t_count_score);
  if (score > hi_score)
    hi_score = score;
  ctx.fillStyle = "#5F6367";
  ctx.clearRect(550, 25, 65, 20);
  ctx.fillText(pad(hi_score, hi_score.toString().length), 550, 45);
  score = 0;
}

//Animates the character jumping generally.
function jump() {
  if (started && !jumping && !disabled){
    jumping = true;
    tMovingUp = setInterval(char_moving_up, 3);
  }
}

//Animates the character moving down while jumping.
function char_moving_down() {
  if (started){
    char_y = char_y + 3;
    if (char_y >= obst_gnd_y - 5){
      clearInterval(tMovingDown);
      jumping = false;
    }
  } else {
    clearInterval(tMovingDown);
  }
}

//Animates the character moving up while jumping.
function char_moving_up() {
  if (started){
    char_y = char_y - 3;
    if (char_y <= 50){
          clearInterval(tMovingUp);
          setTimeout(function(){ tMovingDown = setInterval(char_moving_down, 3)}, 300);
      }
    } else {
        clearInterval(tMovingUp);
    }
}

//Animates obstacles.
function move_obst(){
  if (started){
    for (i = 0; i < obst_x_arr.length; i++){
      let x = obst_x_arr[i];
      x = x-speed; obst_x_arr[i] = x;

      ctx.drawImage(obst_gnd, x, obst_gnd_y, obst_gnd_width, obst_gnd_height);

      obst_crash(x);
      if (i == obst_x_arr.length - 1 && x < min_obst_dist)
            obst_spawn(x);
    }

    if (obst_x_arr.length == obst_speed_inc){
      obst_x_arr = obst_clean(obst_x_arr, 3);
      speed++;
      obst_speed_inc = obst_speed_inc * 2;
    }
  }
}

//Detects collisions.
function obst_crash(x) {
  let x1 = Math.abs(x - char_x);
  if (x+obst_gnd_width > 10 && x1 < char_width){
    let y = Math.abs(obst_gnd_y - char_y);
    if (y < char_height){
      started = false;
    }
  }
}

//Spawns new obstacles in random locations.
function obst_spawn(x){

  min = Math.ceil(min_obst_dist);
  max = Math.floor(max_obst_dist);
  let distance = x +  Math.floor(Math.random() * (max - min)) + min;

  obst_x_arr.push(distance);
}

//Cleans up obstacles array to reset the game.
function obst_clean(arr, last){
  if (arr != null){
    let tmp = [];
    for (i = 0; i < arr.length; i++){
      if (arr.length - i <= last )
        tmp.push(arr[i]);
    }
    arr = []
    return tmp;
  }
}

//Animates the character runing.
function move_char() {
  ctx.clearRect(char_x, char_y, char_width, char_height);
  if (!jumping && started){
    char_frame++;
    if (char_frame < 3){
        ctx.drawImage(char_stnd, char_x, char_y, char_width, char_height);
    } else if (char_frame < 6) {
        ctx.drawImage(char_run1, char_x, char_y, char_width, char_height);
    } else if (char_frame < 9) {
      ctx.drawImage(char_run2, char_x, char_y, char_width, char_height);
    } else {
      ctx.drawImage(char_run2, char_x, char_y, char_width, char_height);
      char_frame = 0;
    }
  } else if (started) {
    ctx.drawImage(char_stnd, char_x, char_y, char_width, char_height);
  } else {
    ctx.drawImage(char_crush, char_x, char_y, char_width, char_height);
  }
}

//Animates background.
function move_bck(bck, x,y) {
  let w = false;
  do {
    if (x + bck_width <= 0){
      x = x + bck_width;
    } else if (canv_width - (x + bck_width) > 0){
      ctx.drawImage(bck, x, y, bck_width, bck_height);
      ctx.drawImage(bck, x + bck_width, y, bck_width, bck_height);
      w = true;
    } else {
      ctx.drawImage(bck, x, y, bck_width, bck_height);
      w = true;
    }
  } while (!w);
  return x;
}

//Pads score with zeros before displaying.
function pad(num, size) {
  switch(size) {
    case 1:
      return "0000" + num;
    case 2:
      return "000" + num;
    case 3:
      return "00" + num;
    case 4:
      return "0" + num;
    default:
      return num;
  }
}

//Keeps track of the user score.
function countScore(){
  if (started)
    score++;
}
