const filter = require('callbag-filter');
const map = require('callbag-map');

const mapWhen = (f, m) => source => map(m)(filter(f)(source));

module.exports = mapWhen;
