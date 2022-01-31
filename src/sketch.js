import * as random from "./util/random";
import { Lch } from "./util/color";

export default (fxhash) => {
  // these are the variables you can use as inputs to your algorithms
  // You may want to remove this line for production
  console.log(fxhash); // the 64 chars hex number fed to your algorithm
  // console.log(fxrand()); // deterministic PRNG function, use it instead of Math.random()

  // fxrand is a deterministic PRNG function, use it instead of Math.random()
  // we set fxrand as new seed for random functions
  random.set_seed(fxrand);

  const colors = [
    Lch(50, 50, random.range(180, 360)),
    Lch(100, 70, random.range(0, 180)),
  ];

  const background = Lch(95, 0, 0);

  const margin = 0.15;
  const shapes = Array(450)
    .fill()
    .map(() => [
      random.range(margin, 1 - margin),
      random.range(margin, 1 - margin),
      Math.abs(random.gaussian(0, 0.01)),
      random.pick(colors),
    ]);

  const setContext = (context, color) => {
    context.fillStyle = color;
  };

  return (context, width, height) => {
    const dim = Math.min(width, height);
    let lineWidth = dim * 0.1;

    setContext(context, background);
    context.fillRect(0, 0, width, height);
    context.lineWidth = lineWidth;

    // 'contain' fit mode
    let scale = 1 >= width / height ? width : height;

    // 'cover' fit mode
    // let scale = 1 < width / height ? width : height;

    let tx = (width - scale) * 0.5;
    let ty = (height - scale) * 0.5;

    // draw shapes
    shapes.forEach(([x, y, radius, color]) => {
      setContext(context, color);
      context.beginPath();
      context.arc(
        tx + x * scale,
        ty + y * scale,
        radius * scale,
        0,
        Math.PI * 2,
        false
      );
      context.fill();
    });
  };
};
