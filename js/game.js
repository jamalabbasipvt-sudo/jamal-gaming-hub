const canvas = document.getElementById("gameCanvas");
const engine = new BABYLON.Engine(canvas, true);
let coinCount = 0;

const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  // Camera
  const camera = new BABYLON.FollowCamera("cam",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
  camera.radius = 10;
  camera.heightOffset = 4;
  camera.rotationOffset = 0;
  camera.attachControl(canvas, true);

  // Light
  new BABYLON.HemisphericLight("light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Ground (road)
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 6,
    height: 200
  }, scene);

  // Runner (temporary box, model baad mein)
  const runner = BABYLON.MeshBuilder.CreateBox("runner", {
    height: 1.8,
    width: 1,
    depth: 1
  }, scene);
  runner.position.y = 1;

  camera.lockedTarget = runner;

  // Coins
  const coins = [];
  for (let i = 10; i < 200; i += 8) {
    const coin = BABYLON.MeshBuilder.CreateSphere("coin", { diameter: 0.6 }, scene);
    coin.position.set(
      Math.random() * 4 - 2,
      1,
      i
    );
    coins.push(coin);
  }

  // Movement
  scene.onBeforeRenderObservable.add(() => {
    runner.position.z += 0.15;

    coins.forEach((coin, index) => {
      if (coin && runner.intersectsMesh(coin, false)) {
        coin.dispose();
        coins[index] = null;
        coinCount++;
        document.getElementById("coins").innerText = coinCount;
      }
    });
  });

  return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());

window.addEventListener("resize", () => engine.resize());
