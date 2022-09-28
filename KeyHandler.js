const handleKeys = () => {
  keyHandler.registeredKeys.forEach((k) => {
    if (keys[k]) keyHandler[k].handle();
  });
};

window.addEventListener("load", () => {
  document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });

  document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });

  addKeyHandler("R", increaseRed);
  addKeyHandler("r", decreaseRed);
  addKeyHandler("G", increaseGreen);
  addKeyHandler("g", decreaseGreen);
  addKeyHandler("B", increaseBlue);
  addKeyHandler("b", decreaseBlue);
  addKeyHandler("T", increaseTransparency);
  addKeyHandler("t", decreaseTransparency);
  addKeyHandler("+", increaseSize);
  addKeyHandler("-", decreaseSize);
  addKeyHandler("w", moveEmitterNorth);
  addKeyHandler("s", moveEmitterSouth);
  addKeyHandler("a", moveEmitterWest);
  addKeyHandler("d", moveEmitterEast);
  addKeyHandler("ArrowUp", increaseSpeed);
  addKeyHandler("ArrowDown", DecreaseSpeed);
  addKeyHandler("ArrowLeft", increaseAngle);
  addKeyHandler("ArrowRight", decreaseAngle);
  addKeyHandler("H", increaseShape);
  addKeyHandler("h", decreaseShape);
  addKeyHandler("n", increaseEmission);
  addKeyHandler("m", decreaseEmission);
  addKeyHandler("q", increaseRotation);
  addKeyHandler("e", decreaseRotation);

  document.getElementById("rainbow").addEventListener("input", flipRainbow);
});

const addKeyHandler = (key, handler) => {
  keyHandler[key] = {
    handle: handler,
  };
  keyHandler.registeredKeys.push(key);
};

const increaseRed = () => changeColor(0, ColorScalar);
const decreaseRed = () => changeColor(0, -1 * ColorScalar);
const increaseGreen = () => changeColor(1, ColorScalar);
const decreaseGreen = () => changeColor(1, -1 * ColorScalar);
const increaseBlue = () => changeColor(2, ColorScalar);
const decreaseBlue = () => changeColor(2, -1 * ColorScalar);
const increaseTransparency = () => changeColor(3, ColorScalar);
const decreaseTransparency = () => changeColor(3, -1 * ColorScalar);
const increaseSize = () => changeSize(sizeScalar);
const decreaseSize = () => changeSize(-1 * sizeScalar);
const moveEmitterNorth = () => moveEmitter([0, moveScalar]);
const moveEmitterSouth = () => moveEmitter([0, -1 * moveScalar]);
const moveEmitterWest = () => moveEmitter([-1 * moveScalar, 0]);
const moveEmitterEast = () => moveEmitter([moveScalar, 0]);
const increaseSpeed = () => changeSpeed(speedScalar);
const DecreaseSpeed = () => changeSpeed(-1 * speedScalar);
const increaseAngle = () => changeAngle(angleScalar);
const decreaseAngle = () => changeAngle(-1 * angleScalar);
const increaseShape = () => changeShape(shapeScalar);
const decreaseShape = () => changeShape(-1 * shapeScalar);
const increaseEmission = () => changeEmission(emissionScalar);
const decreaseEmission = () => changeEmission(-emissionScalar);
const increaseRotation = () => changeRotation(rotationScalar);
const decreaseRotation = () => changeRotation(-rotationScalar);
const flipRainbow = () => {
  rainbow = !rainbow;
};
const changeColor = (color, amount) => {
  let c = defaultParticleProperties.color[color];
  c += amount;
  c = Clamp(c, 1, 0);
  defaultParticleProperties.color[color] = c;
  redrawTable();
};

const changeSize = (amount) => {
  let s = defaultParticleProperties.size + amount;
  s = Clamp(s, 200, 1);
  defaultParticleProperties.size = s;
  redrawTable();
};

const moveEmitter = (amount) => {
  let x = emitter.location[0] + amount[0];
  let y = emitter.location[1] + amount[1];
  x = Clamp(x, canvas.width / 4, canvas.width / -4);
  y = Clamp(y, canvas.height / 4, canvas.height / -4);
  emitter.location[0] = x;
  emitter.location[1] = y;
  redrawTable();
};

const changeSpeed = (amount) => {
  let s = defaultParticleProperties.speed;
  s += amount;
  s = Clamp(s, 10, 0);
  defaultParticleProperties.speed = s;
  redrawTable();
};

const changeAngle = (amount) => {
  dcos = Math.cos(amount);
  dsin = Math.sin(amount);
  x1 = defaultParticleProperties.directionBias[0];
  y1 = defaultParticleProperties.directionBias[1];
  defaultParticleProperties.directionBias[0] = x1 * dcos - y1 * dsin;
  defaultParticleProperties.directionBias[1] = x1 * dsin + y1 * dcos;
  redrawTable();
};

const changeShape = (amount) => {
  let s = defaultParticleProperties.Shape;
  s += amount;
  s = Clamp(s, 3, 0.5);
  defaultParticleProperties.Shape = s;
  redrawTable();
};

const changeEmission = (amount) => {
  let s = emitter.emmissionRate;
  s += amount;
  s = Clamp(s, 5000, 1);
  emitter.emmissionRate = Math.round(s);
  redrawTable();
};

const changeRotation = (amount) => {
  let r = defaultParticleProperties.RotationSpeed;
  r += amount;
  r = Clamp(r, Math.PI, 0);
  defaultParticleProperties.RotationSpeed = r;
  redrawTable();
};

const Clamp = (value, upper, lower) => {
  if (value < lower) return lower;
  if (value > upper) return upper;
  return value;
};
