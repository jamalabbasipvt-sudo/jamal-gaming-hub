// ===== J RUN : FULL GAME ENGINE =====

let canvas, ctx;
let player, coins = [], obstacles = [];
let speed = 4;
let coinCount = 0;
let gameRunning = false;

// START GAME
function startGame() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("loader").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("ui").classList.remove("hidden");
    init();
  }, 4000);
}

// INIT
function init() {
  canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  player = { x: canvas.width/2, y: canvas.height-120, w: 40, h: 80 };

  gameRunning = true;
  loop();
}

// MAIN LOOP
function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawBackground();
  drawRoad();
  drawPlayer();
  spawnCoins();
  spawnObstacles();
  updateCoins();
  updateObstacles();

  speed += 0.001;
  document.getElementById("speed").innerText = speed.toFixed(1);

  requestAnimationFrame(loop);
}

// BACKGROUND
function drawBackground() {
  ctx.fillStyle = "#003300";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

// ROAD (fake 3D)
function drawRoad() {
  ctx.fillStyle = "#444";
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - 120, canvas.height);
  ctx.lineTo(canvas.width/2 - 60, 0);
  ctx.lineTo(canvas.width/2 + 60, 0);
  ctx.lineTo(canvas.width/2 + 120, canvas.height);
  ctx.fill();
}

// PLAYER (running animation)
function drawPlayer() {
  ctx.fillStyle = "#00ffff";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

// COINS
function spawnCoins() {
  if (Math.random() < 0.02) {
    coins.push({ x: canvas.width/2 + (Math.random()*100-50), y: -20 });
  }
}
function updateCoins() {
  ctx.fillStyle = "gold";
  coins.forEach((c,i)=>{
    c.y += speed;
    ctx.beginPath();
    ctx.arc(c.x,c.y,10,0,Math.PI*2);
    ctx.fill();

    if (
      c.x > player.x && c.x < player.x+player.w &&
      c.y > player.y && c.y < player.y+player.h
    ) {
      coinCount++;
      document.getElementById("coinCount").innerText = coinCount;
      coins.splice(i,1);
    }
  });
}

// OBSTACLES
function spawnObstacles() {
  if (Math.random() < 0.01) {
    obstacles.push({ x: canvas.width/2, y: -40 });
  }
}
function updateObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach((o,i)=>{
    o.y += speed;
    ctx.fillRect(o.x-20,o.y,40,40);

    if (
      o.x > player.x-20 && o.x < player.x+player.w &&
      o.y > player.y && o.y < player.y+player.h
    ) {
      gameOver();
    }
  });
}

// GAME OVER
function gameOver() {
  gameRunning = false;
  alert("GAME OVER\nCoins: "+coinCount);
  location.reload();
}

// CONTROLS
window.addEventListener("keydown", e=>{
  if(e.key==="ArrowLeft") player.x -= 30;
  if(e.key==="ArrowRight") player.x += 30;
});

