document.addEventListener('DOMContentLoaded', function() {
  let canvas = document.getElementById('renderCanvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let engine = new BABYLON.Engine(canvas, true);

  let createScene = function(){
    let scene = new BABYLON.Scene(engine);
    //var camera = new BABYLON.WebVRFreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -2), scene);
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

  // Nordic Thingy stuff...
  let guiManager,
      guiPanel;

  let addGuiButton = function(id, text) {
    let button = new BABYLON.GUI.HolographicButton(id);
    guiPanel.addControl(button);

    let textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = "white";
    textBlock.fontSize = 24;
    button.content = textBlock;
    return button;
  }

  let setupThingyGui = function() {

    // Create the 3D UI manager
    guiManager = new BABYLON.GUI.GUI3DManager(scene);

    guiPanel = new BABYLON.GUI.StackPanel3D();
    guiPanel.margin = 0.02;
    guiPanel.isVertical = true;
    
    guiManager.addControl(guiPanel);

    // Optimisation for adding multiple controls (https://doc.babylonjs.com/how_to/gui3d)
    guiPanel.blockLayout = true;

    let temperatureOutput = addGuiButton('temperature', '23.2 degrees');
    temperatureOutput.pointerEnterAnimation = null;


    let connectButton = addGuiButton('connect', 'Connect Thingy');
    connectButton.onPointerUpObservable.add(function() {
      // TODO connect to Thingy
      connectButton.content.text = 'Connected';
    });

    // Reset optimisation
    guiPanel.blockLayout = false;

    guiPanel.position.x = 2;

  }

  let setupThingy = function() {
    // TODO
    setupThingyGui();

    return null;
  }

  let thingy = setupThingy();

});



