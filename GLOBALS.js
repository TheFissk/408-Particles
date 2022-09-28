//performance monitoring (for dick measuring)
let Logger = {
  logPerformance: false,
  totalFrameTime: 0,
  frameTimes: [],
  lastFrame: Date.now(),
};

//Rendering context variables
let canvas;
let gl;
let instanceVBO;
let program;
let frame = 0;

const emitter = {
  location: [0.0, 0.0],
  emmissionRate: 1,
};
//The Default particle and its attributes
const defaultParticleProperties = {
  color: [1.0, 1.0, 0.25, 1], //RGBA
  size: 100.0,
  speed: 5,
  directionBias: [1.0, 0.0], //no bias, going right (+X)
  Lifetime: 60,
  Shape: 1.75,
  RotationSpeed: 0.1,
};

//A list of all the particles
let particles = [];

//the first 3 data points are vertex locations. the last point is whether that vertex is moved
//prettier-ignore
let points = new Float32Array([
    0.0, 0.0, 0, //Center Center;
    0.0, 1.0, 1, //Top Center;
    -1.0, 1.0, 0, //Top Left;
    -1.0, 0.0, 1, //Center Left;
    -1.0, -1.0, 0, //Bottom Left;
    0.0, -1.0, 1, //Bottom Center;
    1.0, -1.0, 0, //Bottom Right;
    1.0, 0.0, 1, //Center Right;
    1.0, 1.0, 0, //Top Right;
    0.0, 1.0, 1, //Top Center;
  ]);

const keys = {};
const keyHandler = { registeredKeys: [] };

const ColorScalar = 0.001;
const sizeScalar = 1;
const moveScalar = 1;
const speedScalar = 0.1;
const angleScalar = 0.02; //in radians
const shapeScalar = 0.01;
const emissionScalar = 10;
const rotationScalar = 0.02;

let rainbow = false;