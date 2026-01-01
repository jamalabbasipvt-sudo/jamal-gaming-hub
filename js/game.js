// ===== J RUN – FULL BASE GAME (ONE TIME SETUP) =====

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// game state
let coins = 0;
let lane = 0;          // -1 left | 0 center | 1 right
let speed = 0.18;
let isJumping = false;
let jumpSpeed = 0;
let gameOver = false;

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.6, 0.8, 1);

  // light
  new BABYLON.HemisphericLight("light",
    new BABYLON.Vector3(0, 1, 0), scene);

  // camera (Temple Run style)
  const camera = new BABYLON.FollowCamera(
    "cam",
    new BABYLON.Vector3(0, 6, -12),
    scene
  );
  camera.radius = 12;
  camera.heightOffset = 5;
  camera.rotationOffset = 0;

  // ground (forest road)
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 400 },
    scene
  );
  ground.position.z = 200;

  const gMat = new BABYLON.StandardMaterial("gmat", scene);
  gMat.diffuseColor = new BABYLON.Color3(0.1, 0.4, 0.1);
  ground.material = gMat;

  // runner (placeholder body – model baad mein)
  const runner = BABYLON.MeshBuilder.CreateBox(
    "runner",
    { height: 2, width: 1, depth: 1 },
    scene
  );
  runner.position.y = 1;
  camera.lockedTarget = runner;

  // coin
  const coin = BABYLON.MeshBuilder.CreateTorus(
    "coin",
    { diameter: 1, thickness: 0.3 },
    scene
  );
  coin.position.set(0, 1.5, 15);

  const cMat = new BABYLON.StandardMaterial("cmat", scene);
  cMat.diffuseColor = new BABYLON.Color3(1, 0.85, 0);
  coin.material = cMat;

  // obstacle
  const obstacle = BABYLON.MeshBuilder.CreateBox(
    "obstacle",
    { height: 2, width: 1.5, depth: 1.5 },
    scene
  );
  obstacle.position.set(0, 1, 30);

  const oMat = new BABYLON.StandardMaterial("omat", scene);
  oMat.diffuseColor = new BABYLON.Color3(0.3, 0.15, 0);
  obstacle.material = oMat;

  // input
  window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" && lane > -1) lane--;
    if (e.code === "ArrowRight" && lane < 1) lane++;

    if (e.code === "Space" && !isJumping) {
      isJumping = true;
      jumpSpeed = 0.28;
    }
  });

  // game loop
  scene.onBeforeRenderObservable.add(() => {
    if (gameOver) return;

    // auto run
    runner.position.z += speed;

    // lane move
    runner.position.x = lane * 3;

    // jump physics
    if (isJumping) {
      runner.position.y += jumpSpeed;
      jumpSpeed -= 0.015;
      if (runner.position.y <= 1) {
        runner.position.y = 1;
        isJumping = false;
      }
    }

    // coin rotate & collect
    coin.rotation.y += 0.1;
    if (BABYLON.Vector3.Distance(runner.position, coin.position) < 1.3) {
      coins++;
      document.getElementById("coins").innerText = "🪙 J Coins: " + coins;
      coin.position.z += 20;
      coin.position.x = (Math.floor(Math.random() * 3) - 1) * 3;
    }

    // obstacle loop
    if (runner.position.z > obstacle.position.z) {
      obstacle.position.z += 40;
      obstacle.position.x = (Math.floor(Math.random() * 3) - 1) * 3;
    }

    // collision
    if (BABYLON.Vector3.Distance(runner.position, obstacle.position) < 1.4) {
      gameOver = true;
      speed = 0;
      alert("Game Over!\nJ Coins: " + coins);
    }
  });

  return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
