/**
 * A set of random utilities.
 *
 */

let fxrand;
let _nextGaussian = null;
let _hasNextGaussian = false;

// sets the seed to a fxhash string "oo..."
export const set_seed = (prng) => {
  if (typeof prng === "function") fxrand = prng;
};

const check = () => {
  if (typeof fxrand !== "function")
    throw new Error("fxhash has not been defined, did you call set_seed?");
};

export const value = () => {
  check();
  return fxrand();
};

// random boolean with 50% uniform chance
export const boolean = () => value() > 0.5;

// random chance
export const chance = (n = 0.5) => value() < n;

// random value between min (inclusive) and max (exclusive)
export const range = (min, max) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return value() * (max - min) + min;
};

// random value between min (inclusive) and max (exclusive), then floored
export const rangeFloor = (min, max) => Math.floor(range(min, max));

// pick a random element in the given array
export const pick = (array) =>
  array.length ? array[rangeFloor(array.length)] : undefined;

// shuffle an array
export const shuffle = (arr) => {
  var rand;
  var tmp;
  var len = arr.length;
  var ret = [...arr];
  while (len) {
    rand = ~~(value() * len--);
    tmp = ret[len];
    ret[len] = ret[rand];
    ret[rand] = tmp;
  }
  return ret;
};

// random point in a uniform 2D disc with given radius
export function insideCircle(radius = 1, out = []) {
  var theta = value() * 2.0 * Math.PI;
  var r = radius * Math.sqrt(value());
  out[0] = r * Math.cos(theta);
  out[1] = r * Math.sin(theta);
  return out;
}

// weighted randomness, specify weights array and the return value is an index
export const weighted = (weights) => {
  var totalWeight = 0;
  var i;

  for (i = 0; i < weights.length; i++) {
    totalWeight += weights[i];
  }

  var random = value() * totalWeight;
  for (i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return i;
    }
    random -= weights[i];
  }
  return 0;
};

// random gaussian distribution
export const gaussian = (mean = 0, standardDerivation = 1) => {
  // https://github.com/openjdk-mirror/jdk7u-jdk/blob/f4d80957e89a19a29bb9f9807d2a28351ed7f7df/src/share/classes/java/util/Random.java#L496
  if (_hasNextGaussian) {
    _hasNextGaussian = false;
    var result = _nextGaussian;
    _nextGaussian = null;
    return mean + standardDerivation * result;
  } else {
    var v1 = 0;
    var v2 = 0;
    var s = 0;
    do {
      v1 = value() * 2 - 1; // between -1 and 1
      v2 = value() * 2 - 1; // between -1 and 1
      s = v1 * v1 + v2 * v2;
    } while (s >= 1 || s === 0);
    var multiplier = Math.sqrt((-2 * Math.log(s)) / s);
    _nextGaussian = v2 * multiplier;
    _hasNextGaussian = true;
    return mean + standardDerivation * (v1 * multiplier);
  }
};

// Generates a pure random hash, useful for testing
// i.e. not deterministic!
export function getRandomHash() {
  let result = "oox";
  for (let i = 64; i > 0; --i)
    result += "0123456789abcdef"[~~(Math.random() * 16)];
  return result;
}
