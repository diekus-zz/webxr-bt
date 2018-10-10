document.addEventListener('DOMContentLoaded', function() {
  let canvas = document.getElementById('renderCanvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let engine = new BABYLON.Engine(canvas, true);

  let createScene = function(){
    let scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.WebVRFreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    scene.onPointerDown = function () {
      scene.onPointerDown = undefined
      camera.attachControl(canvas, true);
    }

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
    // sphere.position = new BABYLON.Vector3(0, 0, 2);
    
    //loads a glb file into the scene
    let assetsManager = new BABYLON.AssetsManager(scene);
    let parrotTask = assetsManager.addMeshTask('parrot task', '', '../models/', 'lapa_hi.glb');
    let branchTask = assetsManager.addMeshTask('branch task', '', '../models/', 'branch.glb');
    
    // BABYLON.SceneLoader.Append('../models/', 'lapa_hi.glb', scene, function (scene) {
    // });

    // BABYLON.SceneLoader.Append('../models/', 'branch.glb', scene, function (scene) {
    // });

    return scene;


  };

  let scene = createScene();
  //registers a render loop
  engine.runRenderLoop(function(){
    scene.render();
  });

  //handles resize event
  window.addEventListener("resize", function(){
    engine.resize();
  })

});



