// ===============================
// J RUN 3D – CORE GAME (Babylon.js)
// ===============================

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

let coins = 0;
let isJumping = false;
let velocityY = 0;
const gravity = -0.015;

// ---------- SCENE ----------
const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.1, 0.4, 0.15);

  // light
  new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // camera (Temple Run style)
  const camera = new BABYLON.FollowCamera(
    "cam",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
  camera.radius = 10;
  camera.heightOffset = 4;
  camera.rotationOffset = 0;
  camera.lockedTarget = null;

  // ground (forest road)
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 500 },
    scene
  );
  ground.position.z = 200;

  // runner (temporary box – later 3D model)
  const runner = BABYLON.MeshBuilder.CreateBox(
    "runner",
    { height: 1.8, width: 0.8, depth: 0.6 },
    scene
  );
  runner.position.y = 1;

  camera.lockedTarget = runner;

  // ---------- COINS ----------
  const coinMeshes = [];
  for (let i = 1; i <= 30; i++) {
    const coin = BABYLON.MeshBuilder.CreateCylinder(
      "coin",
      { diameter: 0.6, height: 0.15 },
      scene
    );
    coin.position.y = 1.2;
    coin.position.z = i * 8;
    coin.position.x = (Math.floor(Math.random() * 3) - 1) * 1.5;
    coinMeshes.push(coin);
  }

  // ---------- INPUT ----------
  const input = {};
  window.addEventListener("keydown", e => input[e.key] = true);
  window.addEventListener("keyup", e => input[e.key] = false);

  // ---------- GAME LOOP ----------
  scene.onBeforeRenderObservable.add(() => {

    // auto forward run
    runner.position.z += 0.18;

    // left / right
    if (input["ArrowLeft"] || input["a"]) {
      runner.position.x = Math.max(-2, runner.position.x - 0.15);
    }
    if (input["ArrowRight"] || input["d"]) {
      runner.position.x = Math.min(2, runner.position.x + 0.15);
    }

    // jump
    if ((input[" "] || input["ArrowUp"]) && !isJumping) {
      isJumping = true;
      velocityY = 0.35;
    }

    if (isJumping) {
      velocityY += gravity;
      runner.position.y += velocityY;

      if (runner.position.y <= 1) {
        runner.position.y = 1;
        isJumping = false;
      }
    }

    // coin rotation + collection
    coinMeshes.forEach(coin => {
      coin.rotation.y += 0.1;

      if (coin.isVisible &&
          BABYLON.Vector3.Distance(runner.position, coin.position) < 1) {
        coin.isVisible = false;
        coins++;
        updateUI();
      }
    });

  });

  return scene;
};

// ---------- UI ----------
function updateUI() {
  document.getElementById("coinsUI").innerText = "🪙 J Coins: " + coins;
}

// ---------- START ----------
const scene = createScene();

setTimeout(() => {
  document.getElementById("loader").style.display = "none";
}, 4000);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => engine.resize());

