# callbag-map-when

Callbag operator that applies a transformation function only to items that satisfy the predicate function. Works as filter() followed by map() on either pullable or listenable sources.

`npm install callbag-map-when`

## Example

```js
const mapWhen = require('callbag-map-when');
const forEach = require('callbag-for-each');
const fromIter = require('callbag-from-iter');
const pipe = require('callbag-pipe');

pipe(
  fromIter([1, 2, 3, 4]),
  mapWhen(n => n % 2 === 0, n => n * 10),
  forEach((n) => {
    console.log(n); // 20
  })                // 40
);
```
