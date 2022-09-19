//Rendering context variables
let gl;
let instanceVBO;

const emmitter = {
  location: vec2(0.0, 0.0),
  emmissionRate: 1,
};
//The Default particle and its attributes
const defaultParticleProperties = {
  color: vec4(1.0, 1.0, 0.25, 1), //RGBA
  size: 100.0,
  speed: 5,
  directionBias: vec2(1.0, 0.0), //no bias, going right (+X)
  Lifetime: 60,
  Shape: 0.5,
};

//A list of all the particles
let particles = [];

//Transformation Matrices
let aspect;
let defaultMV = new mat4();
let p = new mat4();
let mvLoc, projLoc, colorLoc, moveLoc;

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
window.onload = () => {
  //setup WebGl
  let canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    canvas.parentNode.innerHTML("Cannot get WebGL2 Rendering Context");
  }
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0, 0, 0, 1);

  let program = initShaders(gl, "shader.vert", "shader.frag");
  gl.useProgram(program);

  //Load the shape into the buffer
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  program.vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(program.vPosition, 3, gl.FLOAT, gl.FALSE, 16, 0);
  gl.enableVertexAttribArray(program.vPosition);
  program.vMove = gl.getAttribLocation(program, "vMove");
  gl.vertexAttribPointer(program.vMove, 1, gl.FLOAT, gl.FALSE, 16, 12);
  gl.enableVertexAttribArray(program.vMove);

  instanceVBO = gl.createBuffer();
  // Get addresses of shader uniforms
  projLoc = gl.getUniformLocation(program, "p");
  mvLoc = gl.getUniformLocation(program, "mv");
  colorLoc = gl.getUniformLocation(program, "vColor");
  moveLoc = gl.getUniformLocation(program, "moveBy");

  //Set initial view
  let eye = vec3(0.0, 0.0, 10.0);
  let at = vec3(0.0, 0.0, 0.0);
  let up = vec3(0.0, 1.0, 0.0);

  aspect = canvas.clientWidth / canvas.clientHeight;
  defaultMV = lookAt(eye, at, up);

  //Set up projection matrix
  p = perspective(90, aspect, 1.0, 200.0);
  gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(transpose(p)));
  //DRAW BABY DRAW
  requestAnimationFrame(animate);
};

const animate = () => {
  //requestAnimationFrame(animate);
  handleKeys();
  updateParticles();
  spawnNewParticle(emmitter.emmissionRate);
  render();
};

const handleKeys = () => {
  //you will do something someday, but for now you do not
};

const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Buffer Layout
  //Per instance 16*4 MV, 4*4 Color, 1*4 Shape
  let buffer = [];

  particles.map((p) => {
    let mv = structuredClone(defaultMV);
    //doing this translation in the GPU might be faster than in JS. Definitely if we remove the 3rd dimension
    mv = mult(mv, translate(p.location[0], p.location[1], 0));
    mv = mult(mv, scale(p.size, p.size, p.size));
    buffer = buffer.concat(transpose(mv).flat(1));
    buffer = buffer.concat(p.color);
    buffer = buffer.concat(p.Shape);
  });
  console.log(flatten(buffer));
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceVBO);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(buffer), gl.DYNAMIC_DRAW);

  gl.uniform4fv(colorLoc, defaultParticleProperties.color);
  gl.uniform1f(moveLoc, defaultParticleProperties.Shape);

  gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(transpose(defaultMV)));
  gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
};

const spawnNewParticle = (numberToSpawn) => {
  for (let i = 0; i < numberToSpawn; i++) {
    //because cloning an object should be simple zzzzz
    let newPart = structuredClone(defaultParticleProperties);
    newPart.mv = structuredClone(defaultMV);
    newPart.location = [...emmitter.location];

    //create the movement translation
    const directionWiggle = ((Math.random() - 0.5) * Math.PI) / 3;
    const Dsin = Math.sin(directionWiggle);
    const Dcos = Math.cos(directionWiggle);
    newPart.velocity = [
      (newPart.directionBias[0] * Dcos + newPart.directionBias[1] * Dsin) *
        newPart.speed,
      (newPart.directionBias[0] * Dsin - newPart.directionBias[1] * Dcos) *
        newPart.speed,
    ];

    //add it to the particles list
    particles.push(newPart);
  }
};

//Removes expired particles, then shifts them based on their speed
const updateParticles = () => {
  if (particles.length === 0) return;
  //Hopefully before the end I will be able to explore whether remapping
  //particles less efficient than iterating over every element and slicing
  //expired particles
  particles = particles.filter((p) => {
    //remove expired particles
    if (p.Lifetime <= 1) return false;

    p.Lifetime -= 1;
    p.location = [p.location[0] + p.velocity[0], p.location[1] + p.velocity[1]];
    return true;
  });
};
