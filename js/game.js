// ===== J RUN : 3D CORE ENGINE =====

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

let coins = 0;
let isJumping = false;
let jumpSpeed = 0;

// CREATE SCENE
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.6, 0.8, 1);

  // CAMERA (Temple Run style follow)
  const camera = new BABYLON.FollowCamera("cam", new BABYLON.Vector3(0, 5, -10), scene);
  camera.radius = 12;
  camera.heightOffset = 5;
  camera.rotationOffset = 0;
  camera.attachControl(canvas, true);

  // LIGHT
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // GROUND (forest path)
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 10,
    height: 200
  }, scene);

  const groundMat = new BABYLON.StandardMaterial("gmat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.1, 0.4, 0.1);
  ground.material = groundMat;
  ground.position.z = 90;

  // RUNNER (temporary body — baad me real model)
  const runner = BABYLON.MeshBuilder.CreateBox("runner", {
    height: 2,
    width: 1,
    depth: 1
  }, scene);

  runner.position.y = 1;
  runner.position.z = 0;
  camera.lockedTarget = runner;

  // COIN
  const coin = BABYLON.MeshBuilder.CreateTorus("coin", {
    diameter: 1,
    thickness: 0.3
  }, scene);

  coin.position.y = 1.5;
  coin.position.z = 10;

  const coinMat = new BABYLON.StandardMaterial("cmat", scene);
  coinMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
  coin.material = coinMat;

  // INPUT (Jump)
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isJumping) {
      isJumping = true;
      jumpSpeed = 0.25;
    }
  });

  // GAME LOOP
  scene.onBeforeRenderObservable.add(() => {

    // Runner auto run
    runner.position.z += 0.15;

    // Jump physics
    if (isJumping) {
      runner.position.y += jumpSpeed;
      jumpSpeed -= 0.015;

      if (runner.position.y <= 1) {
        runner.position.y = 1;
        isJumping = false;
      }
    }

    // Coin rotation
    coin.rotation.y += 0.1;

    // Coin collect
    if (BABYLON.Vector3.Distance(runner.position, coin.position) < 1.2) {
      coins++;
      document.getElementById("coins").innerText = "🪙 J Coins: " + coins;
      coin.position.z += 15;
    }
  });

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
