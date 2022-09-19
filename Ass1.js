//Rendering context variables
let gl;
let aspect;

//The Default particle and its attributes
const defaultParticleProperties = {
  color: vec4(1.0, 1.0, 0.25, 1), //RGBA
  size: 100.0,
  emmitter: vec3(0.0, 0.0, 0.0),
  velocity: 5,
  directionBias: vec3(1.0, 0.0, 0.0), //no bias, going right (+X)
  Lifetime: 60,
  Shape: 0.5,
  EmissionRate: 1,
};

//A list of all the particles
let particles = []

//Transformation Matrices
let defaultMV = new mat4();
let p = new mat4();
let mvLoc, projLoc, colorLoc;

//the vertices
let points = [
  vec3(0.0, 0.0, 0.0), //Center Center;
  vec3(0.0, 1.0, 0.0), //Top Center;
  vec3(-1.0, 1.0, 0.0), //Top Left;
  vec3(-1.0, 0.0, 0.0), //Center Left;
  vec3(-1.0, -1.0, 0.0), //Bottom Left;
  vec3(0.0, -1.0, 0.0), //Bottom Center;
  vec3(1.0, -1.0, 0.0), //Bottom Right;
  vec3(1.0, 0.0, 0.0), //Center Right;
  vec3(1.0, 1.0, 0.0), //Top Right;
  vec3(0.0, 1.0, 0.0), //Top Center;
];

//informs the shader whether that vertex should be moved
let isMoveable = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

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
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.CULL_FACE);

  let program = initShaders(gl, "shader.vert", "shader.frag");
  gl.useProgram(program);

  //Load the shape into the buffer
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  program.vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(program.vPosition, 3, gl.FLOAT, gl.FALSE, 0, 0);
  gl.enableVertexAttribArray(program.vPosition);

  const moveBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, moveBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(isMoveable), gl.STATIC_DRAW);
  program.vMove = gl.getAttribLocation(program, "vMove");
  gl.vertexAttribPointer(program.vMove, 1, gl.FLOAT, gl.FALSE, 0, 0);
  gl.enableVertexAttribArray(program.vMove);

  // Get addresses of shader uniforms
  projLoc = gl.getUniformLocation(program, "p");
  mvLoc = gl.getUniformLocation(program, "mv");
  colorLoc = gl.getUniformLocation(program, "vColor");
  moveLoc = gl.getUniformLocation(program, "moveBy");

  //Set initial view
  let eye = vec3(0.0, 0.0, 100.0);
  let at = vec3(0.0, 0.0, 0.0);
  let up = vec3(0.0, 1.0, 0.0);

  aspect = canvas.clientWidth / canvas.clientHeight;
  defaultMV = lookAt(eye, at, up);

  //Set up projection matrix
  p = ortho(-3.4 * aspect, 3.4 * aspect, -3.4, 3.4, 1.0, 200.0);
  gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(transpose(p)));

  //DRAW BABY DRAW
  requestAnimationFrame(animate);
};

const animate = () => {
  handleKeys();
  spawnNewParticle(1);
  updateParticles();
  render();
};

const handleKeys = () => {
  //you will do something someday, but for now you do not
};

const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Data we need per instance
  //MV matrix (could be simplified) MAT4
  //color vec4, float moveBy
  defaultMV = mult(defaultMV, translate(0.0, 0.0, 0.0));
  gl.uniform4fv(colorLoc, defaultParticleProperties.color);
  gl.uniform1f(moveLoc, defaultParticleProperties.Shape);

  gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(transpose(defaultMV)));
  gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
};

const spawnNewParticle = (numberToSpawn) => {
  for (let i = 0; i < numberToSpawn; i++) {
    
  }
}

const updateParticles = () => {

}
