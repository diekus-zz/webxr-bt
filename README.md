# WebXR + Web Bluetooth demo

A demo by Diego González-Zúñiga and Peter O'Shaughnessy, presented at GDG DevFest Ukraine and Heapcon. A web-based VR experience which uses real-time sensor data from a Nordic Thingy, a small multi-sensor device accessible via Bluetooth Low Energy. The virtual world adapts to the data from the physical world.

## Instructions

* Requires a browser and device which [supports Web Bluetooth](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md).
* Switch on the Nordic Thingy and press the 'Connect' button.
* After a few seconds, live data from the Thingy should become visible on the right hand side of the page.
* The amount of rain is linked to the real-world humidity percentage that we obtain from the Thingy 🌧️
* To see the adaptive lighting, try holding the bottom of the Thingy up to a window, or shine a torch under it. 🔦
* Tilt the Thingy backwards and forwards to make the parrot nod up and down. 🐦
* Press the button to make the parrot sqwawk! 🗯️

For more information, see [our blog post here](https://medium.com/samsung-internet-dev/creating-a-physical-and-immersive-web-mashup-b5418f14b982).
