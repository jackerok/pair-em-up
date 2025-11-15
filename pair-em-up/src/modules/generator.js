export const generateNumbers = (mode) => {
  const makeBaseSet = () => {
    const vals = [];

    for (let i = 1; i <= 9; i++) vals.push(i);
    for (let n = 11; n <= 19; n++) {
      const digits = String(n).split("").map(Number);
      vals.push(...digits);
    }

    return vals;
  };

  if (mode === "classic") {
    return makeBaseSet();
  }

  if (mode === "random") {
    const base = makeBaseSet();
    return shuffle(base);
  }
  if (mode === "chaotic") {
    const vals = [];
    for (let i = 0; i < 27; i++) vals.push(Math.floor(Math.random() * 9) + 1);
    return vals;
  }
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
