const handleKey = (key, flip) => {
  let inc = key.increment;
  if (flip) inc *= -1;
  let newValue = key.variable + inc;
  newValue = clamp(newValue, key.clamp[0], key.clamp[1]);
  key.variable = newValue;
};

//In the real world I would have to add all sorts of error handling
//but is this the real life, or is this just fantasy
const addKeyHandler = (key, increment, variable, clamp) => {
  keyHandler[key] = {
    increment: increment,
    variable: variable,
    clamp: clamp,
    handle: handleKey,
  };
};

const clamp = (value, upper, lower) => {
  if (value < lower) return lower
  if (value > upper) return upper
  return value
}