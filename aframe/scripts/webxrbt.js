// Nordic Thingy stuff...
let guiManager,
    guiPanel,
    connectButton = document.getElementById('connect'),
    sceneEl = document.getElementById('scene'),
    dataListEl = document.getElementById('data'),
    temperatureEl = document.getElementById('temperature'),
    humidityEl = document.getElementById('humidity'),
    gasEl = document.getElementById('gas'),
    colorEl = document.getElementById('color'),
    batteryEl = document.getElementById('battery'),
    rainEl = document.getElementById('rain'),
    thingy = new Thingy({logEnabled: true}),
    madeItRain = false;

const degreesToRadians = function(degrees) {
  return degrees * Math.PI / 180;
}

const setupThingyGui = function() {
  connectButton.addEventListener('click', async function() {
    console.log('Connect thingy...');
    const success = await connectThingy();
    connectButton.innerText = success ? 'Connected' : 'Try again';
    dataListEl.style.display = success ? 'block' : 'none';
  });
}

const onThingyButtonPress = function(event) {
  console.log('thingy button press!');
  if (event.detail.value === 1) {
    parrotCry();
  }
}

const onThingyOrientation = function(data) {
  //console.log('thingy orientation!', data.detail);

  const {roll, pitch, yaw} = data.detail;

  // TODO apply orientation to something
  // https://doc.babylonjs.com/resources/rotation_conventions
  // roll = z, yaw = y, pitch = x
  // cube.rotation = new BABYLON.Vector3(degreesToRadians(pitch), 
  //     degreesToRadians(yaw), degreesToRadians(roll));

  flipTheBird(pitch);

}

const onThingyTemperature = function(data) {
  console.log('thingy temperature!', data.detail.value);
  temperatureEl.innerText = data.detail.value + '°';
}

const onThingyHumidity = function(data) {
  console.log('thingy humidity! ' + (data.detail.value + data.detail.unit + ''));
  humidityEl.innerText = data.detail.value + data.detail.unit;
  makeItRain(data.detail.value);
}

const onThingyGas = function(data) {
  console.log('thingy gas!', data.detail.TVOC.value +  data.detail.TVOC.unit, 
    data.detail.eCO2.value + data.detail.eCO2.unit);
  gasEl.innerHTML = `TVOC ${data.detail.TVOC.value} ${data.detail.TVOC.unit}<br>CO2 ${data.detail.eCO2.value} ${data.detail.eCO2.unit}`;
}

const onThingyColor = function(data) {
  console.log('thingy color!', data.detail.red, data.detail.green, data.detail.blue);
  colorEl.innerText = `RGB ${data.detail.red}, ${data.detail.green}, ${data.detail.blue}`;
  // Update background colour
  let s = document.querySelector('#sph-env');
  s.components['material'].material.color.r = data.detail.red;
  s.components['material'].material.color.g = data.detail.green;
  s.components['material'].material.color.b = data.detail.blue;
}

const onThingyBattery = function(data) {
  console.log('thingy battery! ', data.detail);
  batteryEl.innerText = data.detail.status + '%';
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

      thingy.addEventListener('eulerorientation', onThingyOrientation);
      thingy.addEventListener('button', onThingyButtonPress);
      thingy.addEventListener('temperature', onThingyTemperature);
      thingy.addEventListener('color', onThingyColor);
      thingy.addEventListener('humidity', onThingyHumidity);
      thingy.addEventListener('gas', onThingyGas);
      thingy.addEventListener('battery', onThingyBattery);

      await thingy.eulerorientation.start();
      await thingy.button.start();
      await thingy.temperature.start();
      await thingy.color.start();
      await thingy.humidity.start();
      await thingy.gas.start();
      await thingy.battery.start();

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

//A-Frame scene stuff...
const changeEnvironmentColor = function(temp){
  const s = document.querySelector('#sph-env');
  
  s.components['material'].material.color.r = temp*9;
  s.components['material'].material.color.g = 0;
  s.components['material'].material.color.b = temp*9;
  
};

const parrotCry = function(){
  const pc = document.querySelector('#parrotcry');
  pc.components.sound.playSound();
}

const flipTheBird = function(ry){
  const parrot = document.querySelector('#parrot');
  parrot.setAttribute('rotation', Math.round(ry / 18) + ' -102.2 0');
}

const makeItRain = function(humidityPct) {
  if (madeItRain) {
    return;
  }
  const rain = document.createElement('a-entity');
  rain.id = 'rain';
  rain.setAttribute('position', '0 2.25 -15');
  // Humidity of 100 = 0.1. Humidity of 50 = 2.5. Humidity of 0 = 5.
  const maxAge = Math.max(0.1, 5 - (humidityPct / 20));
  rain.setAttribute('particle-system', `preset:rain;opacity:.7; maxAge:${maxAge}`);
  sceneEl.appendChild(rain);

  const rainSound = document.createElement('a-entity');
  rainSound.id = 'rain-sound';
  rainSound.setAttribute('sound', 'src:#rain_src; autoplay:true; loop:true; volume:0.2');
  sceneEl.appendChild(rainSound);

  console.log('Made it rain');
  madeItRain = true;
}