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
      guiPanel,
      temperatureButton,
      thingy = new Thingy({logEnabled: true});


  const degreesToRadians = function(degrees) {
    return degrees * Math.PI / 180;
  }

  const addGuiButton = function(id, text) {
    let button = new BABYLON.GUI.HolographicButton(id);
    guiPanel.addControl(button);

    let textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = "white";
    textBlock.fontSize = 24;
    button.content = textBlock;
    return button;
  }

  const setupThingyGui = function() {

    // Create the 3D UI manager
    guiManager = new BABYLON.GUI.GUI3DManager(scene);

    guiPanel = new BABYLON.GUI.StackPanel3D();
    guiPanel.margin = 0.02;
    guiPanel.isVertical = true;
    
    guiManager.addControl(guiPanel);

    // Optimisation for adding multiple controls (https://doc.babylonjs.com/how_to/gui3d)
    guiPanel.blockLayout = true;

    temperatureButton = addGuiButton('temperature', '...');
    temperatureButton.pointerEnterAnimation = null;

    let connectButton = addGuiButton('connect', 'Connect Thingy');
    connectButton.onPointerUpObservable.add(async function() {
      const success = await connectThingy();
      connectButton.content.text = success ? 'Connected' : 'Connection Error';
      connectButton.pointerEnterAnimation = null;
    });

    // Reset optimisation
    guiPanel.blockLayout = false;

    guiPanel.position.x = 2;

  }

  const onThingyButtonPress = function(event) {
    console.log('thingy button press!');
    if (event.detail.value === 1) {
      // TODO on Thingy button press
    }
  }

  const onThingyTemperature = function(data) {
    console.log('thingy temperature!', data.detail.value);
    temperatureButton.content.text = data.detail.value + '°';
  }

  const onThingyOrientation = function(data) {
    console.log('thingy orientation!', data.detail);

    const {roll, pitch, yaw} = data.detail;

    // TODO apply orientation to something
    // https://doc.babylonjs.com/resources/rotation_conventions
    // roll = z, yaw = y, pitch = x
    // cube.rotation = new BABYLON.Vector3(degreesToRadians(pitch), 
    //     degreesToRadians(yaw), degreesToRadians(roll));
  }

  const onThingyColor = function() {
    console.log('thingy color!', data.detail.red, data.detail.green, data.detail.blue);
  }

  const onThingyHumidity = function() {
    console.log('thingy humidity!', data.detail.value + data.detail.unit);
    //humidityButton.content.text = data.detail.value + data.detail.unit;
  }

  const onThingyGas = function() {
    console.log('thingy gas!', data.detail.TVOC.value +  data.detail.TVOC.unit, 
      data.detail.eCO2.value + data.detail.eCO2.unit);
  }

  const connectThingy = async function() {

    try {
      const success = await thingy.connect();

      if (success) {

        console.log('thingy', thingy);

        // TODO can control the light if we want to
        // const newLedConfiguration = {
        //     mode: 'breathe',
        //     color: 'red',
        //     intensity: 50,
        //     delay: 1000,
        // };
        // await thingy.led.write(newLedConfiguration);

        await thingy.eulerorientation.start();
        await thingy.button.start();

        thingy.addEventListener('eulerorientation', onThingyOrientation);
        thingy.addEventListener('button', onThingyButtonPress);
        thingy.addEventListener('temperature', onThingyTemperature);
        thingy.addEventListener('color', onThingyColor);
        thingy.addEventListener('humidity', onThingyHumidity);
        thingy.addEventListener('gas', onThingyGas);

        await thingy.temperature.start();
        await thingy.color.start();
        await thingy.humidity.start();
        await thingy.gas.start();

      } else {
          console.log('Unable to connect to Thingy, is Web Bluetooth supported?');
      }

      return success;

    } catch(error) {
        console.error('Error connecting to Nordic Thingy', error);
        return false;
    }
  }

  setupThingyGui();

});



