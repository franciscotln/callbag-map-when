/**
 * callbag-map-when
 * -----------
 *
 * Callbag operator that applies a transformation function only to items that
 * satisfy the predicate function. Works as filter() followed by map()
 * Works on either pullable or listenable sources.
 *
 * `npm install callbag-map-when`
 *
 * Example:
 *
 *     const mapWhen = require('callbag-map-when');
 *     const forEach = require('callbag-for-each');
 *     const fromIter = require('callbag-from-iter');
 *     const pipe = require('callbag-pipe');
 *
 *     pipe(
 *       fromIter([1, 2, 3, 4]),
 *       mapWhen(n => n % 2 === 0, n => n * 10),
 *       forEach((n) => {
 *         console.log(n); // 20
 *                         // 40
 *       })
 *     );
 * 
 * @param {Function} f The predicate filter function
 * @param {Function} m The map transformation function
 * @returns {Function} A function of the source Callbag
 */

const mapWhen = (f, m) => (source) => (start, sink) => {
  let ask;
  start === 0 && source(start, (t, d) => {
    if (start === t) ask = d;
    if (t === 1) return f(d) ? sink(t, m(d)) : ask(t);
    sink(t, d);
  });
};

module.exports = mapWhen;