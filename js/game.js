// ===== J RUN 3D GAME =====

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// create scene
const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.1, 0.4, 0.1);

  // camera (Temple Run style follow)
  const camera = new BABYLON.FollowCamera(
    "followCam",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
  camera.radius = 10;
  camera.heightOffset = 4;
  camera.rotationOffset = 0;
  camera.attachControl(canvas, true);

  // light
  new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // ground (forest road)
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 200 },
    scene
  );

  // player (runner box for now)
  const runner = BABYLON.MeshBuilder.CreateBox(
    "runner",
    { height: 1.8, width: 0.8, depth: 0.5 },
    scene
  );
  runner.position.y = 1;

  camera.lockedTarget = runner;

  // forward movement (auto run)
  scene.onBeforeRenderObservable.add(() => {
    runner.position.z += 0.15;
  });

  return scene;
};

const scene = createScene();

// remove loader after 4 sec
setTimeout(() => {
  document.getElementById("loader").style.display = "none";
}, 4000);

// render loop
engine.runRenderLoop(() => {
  scene.render();
});

// resize
window.addEventListener("resize", () => {
  engine.resize();
});

