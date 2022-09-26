const keys = {};
const keyHandler = {registeredKeys:[]}

window.addEventListener('load', () => {
  document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  })
  document.addEventListener("keyup", (event) => {
    console.log(event.key);
    keys[event.key] = false;

    addKeyHandler("R", "r", 0.01,defaultParticleProperties.color[0],[0,1]);
  })
})

const handleKeys = () => {
  keyHandler.registeredKeys.forEach(k => {
    console.log(keys[k]);
    if(keys[k]) keyHandler[k].handle(keyHandler[k])
  })
}

const handleKey = (key) => {
  let newValue = key.variable + key.increment;
  newValue = clamp(newValue, key.clamp[0], key.clamp[1]);
  key.variable = newValue;
};

//In the real world I would have to add all sorts of error handling
//but is this the real life, or is this just fantasy
const addKeyHandler = (increaseKey, decreaseKey, increment, variable, clamp) => {
  keyHandler[increaseKey] = {
    increment: increment,
    variable: variable,
    clamp: clamp,
    handle: handleKey,
  };
  keyHandler[decreaseKey] = {
    increment: -1 * increment,
    variable: variable,
    clamp: clamp,
    handle: handleKey,
  };
  keyHandler.registeredKeys.push(increaseKey,decreaseKey)
};

const clamp = (value, upper, lower) => {
  if (value < lower) return lower
  if (value > upper) return upper
  return value
}