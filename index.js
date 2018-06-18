const mapWhen = (f, m) => (source) => (start, sink) => {
  if (start !== 0) return;
  let ask;
  source(0, (t, d) => {
    if (t === 0) ask = d;
    if (t === 1) {
      f(d) ? sink(t, m(d)) : ask(t);
    } else {
      sink(t, d);
    }
  });
};

module.exports = mapWhen;
