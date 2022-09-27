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
};

//A list of all the particles
let particles = [];

//Transformation Matrices
let aspect;

//the first 3 data points are vertex locations. the last point is whether that vertex is moved
let points = [
  [0.0, 0.0, 0.0, 0], //Center Center;
  [0.0, 1.0, 0.0, 1], //Top Center;
  [-1.0, 1.0, 0.0, 0], //Top Left;
  [-1.0, 0.0, 0.0, 1], //Center Left;
  [-1.0, -1.0, 0.0, 0], //Bottom Left;
  [0.0, -1.0, 0.0, 1], //Bottom Center;
  [1.0, -1.0, 0.0, 0], //Bottom Right;
  [1.0, 0.0, 0.0, 1], //Center Right;
  [1.0, 1.0, 0.0, 0], //Top Right;
  [0.0, 1.0, 0.0, 1], //Top Center;
];

//First time setup
window.addEventListener("load", () => {
  //setup WebGl
  canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2", { antialias: false });
  if (!gl) {
    canvas.parentNode.innerHTML("Cannot get WebGL2 Rendering Context");
  }
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0, 0, 0, 1);

  program = initShaders(gl, "shader.vert", "shader.frag");
  gl.useProgram(program);

  resizeScreen();

  //Load the shape into the buffer
  //const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  //program.vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 16, 0);
  gl.enableVertexAttribArray(0);
  //program.vMove = gl.getAttribLocation(program, "vMove");
  gl.vertexAttribPointer(1, 1, gl.FLOAT, gl.FALSE, 16, 12);
  gl.enableVertexAttribArray(1);

  instanceVBO = gl.createBuffer();

  //DRAW BABY DRAW
  requestAnimationFrame(animate);
});

const animate = () => {
  requestAnimationFrame(animate);
  if (Logger.logPerformance) printPerformance();
  handleKeys();
  resizeScreen();
  updateParticles();
  spawnNewParticle(emitter.emmissionRate);
  // updateParticles();
  // spawnNewParticle(emitter.emmissionRate);
  // updateParticles();
  // spawnNewParticle(emitter.emmissionRate);
  render();
};

const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Buffer Layout
  //Per instance 2*4 translate 1*4 size 4*4 color 1*4 shape = 8 + 4 + 16 + 4 = 32

  //rebuilding the buffer every frame sucks up performance
  const buffer = [];
  particles.forEach((p) => {
    buffer.push(...p.location);
    buffer.push(p.size);
    buffer.push(...p.color);
    buffer.push(p.Shape);
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceVBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer), gl.DYNAMIC_DRAW);
  //translate
  gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 32, 0);
  gl.enableVertexAttribArray(2);
  //size
  gl.vertexAttribPointer(3, 1, gl.FLOAT, gl.FALSE, 32, 8);
  gl.enableVertexAttribArray(3);
  //color
  gl.vertexAttribPointer(4, 4, gl.FLOAT, gl.FALSE, 32, 12);
  gl.enableVertexAttribArray(4);
  //moveBy
  gl.vertexAttribPointer(5, 1, gl.FLOAT, gl.FALSE, 32, 28);
  gl.enableVertexAttribArray(5);

  gl.vertexAttribDivisor(2, 1);
  gl.vertexAttribDivisor(3, 1);
  gl.vertexAttribDivisor(4, 1);
  gl.vertexAttribDivisor(5, 1);

  gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, points.length, particles.length);
};

const spawnNewParticle = (numberToSpawn) => {
  for (let i = 0; i < numberToSpawn; i++) {
    //because cloning an object should be simple zzzzz
    let NP = {};
    NP.color = [...defaultParticleProperties.color];
    NP.size = defaultParticleProperties.size;
    NP.Lifetime = defaultParticleProperties.Lifetime;
    NP.Shape = defaultParticleProperties.Shape;
    NP.location = [...emitter.location];

    //create the movement translation
    const directionWiggle = ((Math.random() - 0.5) * Math.PI) / 3;
    const Dsin = Math.sin(directionWiggle);
    const Dcos = Math.cos(directionWiggle);
    NP.velocity = [
      (defaultParticleProperties.directionBias[0] * Dcos -
        defaultParticleProperties.directionBias[1] * Dsin) *
        defaultParticleProperties.speed,
      (defaultParticleProperties.directionBias[0] * Dsin +
        defaultParticleProperties.directionBias[1] * Dcos) *
        defaultParticleProperties.speed,
    ];

    //add it to the particles list
    particles.push(NP);
  }
};

//Removes expired particles, then shifts them based on their speed
const updateParticles = () => {
  if (particles.length === 0) return;
  particles = particles.filter((p) => {
    //remove expired particles
    if (p.Lifetime <= 1) return false;

    p.Lifetime -= 1;
    p.location[0] += p.velocity[0];
    p.location[1] += p.velocity[1];
    return true;
  });
};

const resizeScreen = () => {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    //reset the viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //reset the perspective uniform
    const projLoc = gl.getUniformLocation(program, "p");
    aspect = canvas.clientWidth / canvas.clientHeight;
    p = orthographic(
      canvas.width / 2,
      canvas.width / -2,
      canvas.height / 2,
      canvas.height / -2,
      20,
      -1
    );
    gl.uniformMatrix4fv(projLoc, gl.FALSE, p);
    //move the emmitter to an acceptable location if the screen changes size
    moveEmitter([0, 0]);
  }
  return needResize;
};

const printPerformance = () => {
  Logger.frameTimes.push(Date.now() - Logger.lastFrame);
  let sh = 0;
  if (Logger.frameTimes.length > 60) sh = Logger.frameTimes.shift();
  Logger.totalFrameTime += Logger.frameTimes[Logger.frameTimes.length - 1] - sh;
  console.log(
    `fps: ${Math.round(60000 / Logger.totalFrameTime)} Particles: ${
      particles.length
    }`
  );
  Logger.lastFrame = Date.now();
};

const orthographic = (r, l, t, b, f, n) => {
  const w = r - l;
  const h = t - b;
  const d = f - n;
  //prettier-ignore
  return new Float32Array([
    2/w,      0,        0,        0,
    0,        2/h,      0,        0,
    0,        0,        -2/d,     0,
    -(r+l)/w, -(t+b)/h, -(f+n)/d, 1
  ])
};
