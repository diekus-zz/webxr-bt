// Nordic Thingy stuff...
let guiManager,
    guiPanel,
    temperatureButton,
    thingy = new Thingy({logEnabled: true});

const degreesToRadians = function(degrees) {
  return degrees * Math.PI / 180;
}


const setupThingyGui = function() {

}

const onThingyButtonPress = function(event) {
  console.log('thingy button press!');
  if (event.detail.value === 1) {
    // TODO on Thingy button press
  }
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


const onThingyTemperature = function(data) {
  console.log('thingy temperature!', data.detail.value);
  temperatureButton.content.text = 'Temperature\n' + data.detail.value + '°';
}

const onThingyHumidity = function() {
  console.log('thingy humidity!', data.detail.value + data.detail.unit);
  humidityButton.content.text = 'Humidity\n' + data.detail.value + data.detail.unit;
}

const onThingyGas = function() {
  console.log('thingy gas!', data.detail.TVOC.value +  data.detail.TVOC.unit, 
    data.detail.eCO2.value + data.detail.eCO2.unit);
}

const onThingyColor = function() {
  console.log('thingy color!', data.detail.red, data.detail.green, data.detail.blue);
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

//A-Frame scene stuff...
let changeEnvironmentColor = function(temp){
  let s = document.querySelector('#sph-env');
  
  s.components['material'].material.color.r = temp*9;
  s.components['material'].material.color.g = 0;
  s.components['material'].material.color.b = temp*9;
  
};

let parrotCry = function(){
  let pc = document.querySelector('#parrotcry');
  pc.components.sound.playSound();
}
