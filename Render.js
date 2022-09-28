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
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 1);

  program = initShaders(gl, "shader.vert", "shader.frag");
  gl.useProgram(program);

  resizeScreen();

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, gl.FALSE, 12, 0);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(1, 1, gl.FLOAT, gl.FALSE, 12, 8);
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
  if (rainbow) {
    defaultParticleProperties.color = nextRainbowColor((frame % 360) / 360);
    redrawTable();
  }
  updateParticles();
  spawnNewParticle(emitter.emmissionRate);
  // updateParticles();
  // spawnNewParticle(emitter.emmissionRate);
  // updateParticles();
  // spawnNewParticle(emitter.emmissionRate);
  render();
  frame++;
};

const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);

  //update the age uniform

  const frameLoc = gl.getUniformLocation(program, "frame");
  gl.uniform1f(frameLoc, frame);

  //Buffer Layout
  //1x4 birth, 1x4 size, 1x4 shape, 1x4 rotation, 2x4 location, 2x4 translate, 4x4 color - to save Attrib Pointers, this is packed
  // 4x4 + 4x4 + 4x4 = 48 bytes

  gl.bindBuffer(gl.ARRAY_BUFFER, instanceVBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particles), gl.DYNAMIC_DRAW);
  //4 random variables
  gl.vertexAttribPointer(2, 4, gl.FLOAT, gl.FALSE, 48, 0);
  gl.enableVertexAttribArray(2);
  //starting location and translate
  gl.vertexAttribPointer(3, 4, gl.FLOAT, gl.FALSE, 48, 16);
  gl.enableVertexAttribArray(3);
  //color
  gl.vertexAttribPointer(4, 4, gl.FLOAT, gl.FALSE, 48, 32);
  gl.enableVertexAttribArray(4);

  gl.vertexAttribDivisor(2, 1);
  gl.vertexAttribDivisor(3, 1);
  gl.vertexAttribDivisor(4, 1);
  console.log(points.length);
  gl.drawArraysInstanced(
    gl.TRIANGLE_FAN,
    0,
    points.length,
    particles.length / 12
  );
};

//Buffer Layout
//1x4 birth, 1x4 size, 1x4 shape, 1x4 rotation, 2x4 location, 2x4 translate, 4x4 color

//Because I never want to touch a particle again until it is killed this gets complicated
const spawnNewParticle = (numberToSpawn) => {
  for (let i = 0; i < numberToSpawn; i++) {
    const directionWiggle = ((Math.random() - 0.5) * Math.PI) / 3;
    const Dsin = Math.sin(directionWiggle);
    const Dcos = Math.cos(directionWiggle);
    velocityX =
      (defaultParticleProperties.directionBias[0] * Dcos -
        defaultParticleProperties.directionBias[1] * Dsin) *
      defaultParticleProperties.speed;
    velocityY =
      (defaultParticleProperties.directionBias[0] * Dsin +
        defaultParticleProperties.directionBias[1] * Dcos) *
      defaultParticleProperties.speed;

    particles.push(
      frame,
      defaultParticleProperties.size,
      defaultParticleProperties.Shape,
      defaultParticleProperties.RotationSpeed,
      ...emitter.location,
      velocityX,
      velocityY,
      ...defaultParticleProperties.color
    );
  }
};

//Removes expired particles
const updateParticles = () => {
  let sliceLoc = 0;
  while (particles[sliceLoc] + defaultParticleProperties.Lifetime <= frame) {
    sliceLoc += 12;
  }
  particles = particles.slice(sliceLoc);
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
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    //reset the perspective uniform
    const projLoc = gl.getUniformLocation(program, "p");
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
      particles.length / 12
    } frame: ${frame}`
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

const nextRainbowColor = (step) => {
  let h = step + 0.5;
  h *= -1;
  const r = Math.sin(Math.PI * h);
  const g = Math.sin(Math.PI * (h + 1 / 3));
  const b = Math.sin(Math.PI * (h + 2 / 3));
  return [r * r, g * g, b * b, defaultParticleProperties.color[3]];
};
