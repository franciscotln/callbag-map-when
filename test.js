const test = require('tape');
const mapWhen = require('.');

const TYPES = {
  FUNCTION: 'function',
  NUMBER: 'number',
  UNDEFINED: 'undefined',
}
const isEven = x => x % 2 === 0;
const add = x => y => x + y;

test('it filters then maps a pullable source', function(t) {
  t.plan(23);
  const upwardsExpected = [
    [0, TYPES.FUNCTION],
    [1, TYPES.UNDEFINED],
    [1, TYPES.UNDEFINED],
    [1, TYPES.UNDEFINED],
    [1, TYPES.UNDEFINED],
  ];
  const downwardsExpectedType = [
    [0, TYPES.FUNCTION],
    [1, TYPES.NUMBER],
    [2, TYPES.UNDEFINED],
  ];
  const downwardsExpected = [12];

  function makeSource() {
    let _sink;
    let sent = 0;
    return function source(type, data) {
      t.true(upwardsExpected.length > 0, 'source can be pulled');
      const e = upwardsExpected.shift();
      t.equals(type, e[0], 'upwards type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards data is expected: ' + e[1]);

      if (type === 0) {
        _sink = data;
        _sink(0, source);
        return;
      }
      if (sent === 3) {
        _sink(2);
        return;
      }
      if (sent === 0) {
        sent++;
        _sink(1, 1);
        return;
      }
      if (sent === 1) {
        sent++;
        _sink(1, 2);
        return;
      }
      if (sent === 2) {
        sent++;
        _sink(1, 3);
        return;
      }
    };
  }

  function makeSink() {
    let talkback;
    return function(type, data) {
      const et = downwardsExpectedType.shift();
      t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
      t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
      if (type === 0) {
        talkback = data;
        return talkback(1);
      }
      if (type === 1) {
        const e = downwardsExpected.shift();
        t.equals(data, e, 'downwards data is expected: ' + e);
        return talkback(1);
      }
    };
  }

  mapWhen(isEven, add(10))(makeSource())(0, makeSink());

  setTimeout(function() {
    t.pass('nothing else happens');
    t.end();
  }, 300);
});

test('it filters then maps an async finite listenable source', function(t) {
  t.plan(14);
  const upwardsExpected = [
    [0, TYPES.FUNCTION],
    [1, TYPES.UNDEFINED],
    [1, TYPES.UNDEFINED],
  ];
  const downwardsExpectedType = [
    [0, TYPES.FUNCTION],
    [1, TYPES.NUMBER],
    [2, TYPES.UNDEFINED],
  ];
  const downwardsExpected = [7];

  function makeSource() {
    let sent = 0;
    return function source(type, data) {
      const e = upwardsExpected.shift();
      t.equals(type, e[0], 'upwards type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards data is expected: ' + e[1]);
      if (type === 0) {
        const sink = data;
        const id = setInterval(function() {
          if (sent === 0) {
            sent++;
            sink(1, 1);
            return;
          }
          if (sent === 1) {
            sent++;
            sink(1, 2);
            return;
          }
          if (sent === 2) {
            sent++;
            sink(1, 3);
            return;
          }
          if (sent === 3) {
            sink(2);
            clearInterval(id);
            return;
          }
        }, 100);
        sink(0, source);
      }
    };
  }

  function makeSink() {
    return function(type, data) {
      const et = downwardsExpectedType.shift();
      t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
      t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
      if (type === 1) {
        const e = downwardsExpected.shift();
        t.equals(data, e, 'downwards data is expected: ' + e);
      }
    };
  }

  mapWhen(isEven, add(5))(makeSource())(0, makeSink());

  setTimeout(function() {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

test('it returns a source that disposes upon upwards END (2)', function(t) {
  t.plan(12);
  const upwardsExpected = [
    [0, TYPES.FUNCTION],
    [1, TYPES.UNDEFINED],
    [2, TYPES.UNDEFINED]
  ];
  const downwardsExpectedType = [
    [0, TYPES.FUNCTION],
    [1, TYPES.NUMBER],
    [1, TYPES.NUMBER],
    [1, TYPES.NUMBER],
  ];
  const downwardsExpected = [15];

  function makeSource() {
    let sent = 0;
    let id;
    return function source(type, data) {
      const e = upwardsExpected.shift();
      t.equals(type, e[0], 'upwards type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards data is expected: ' + e[1]);
      if (type === 0) {
        const sink = data;
        id = setInterval(function() {
          sink(1, ++sent);
        }, 100);
        sink(0, source);
      } else if (type === 2) {
        clearInterval(id);
      }
    };
  }

  function makeSink(type, data) {
    let talkback;
    return function(type, data) {
      const et = downwardsExpectedType.shift();
      t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
      t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
      if (type === 0) {
        talkback = data;
      }
      if (type === 1) {
        const e = downwardsExpected.shift();
        t.equals(data, e, 'downwards data is expected: ' + e);
      }
      if (downwardsExpected.length === 0) {
        talkback(2);
      }
    };
  }

  mapWhen (isEven, add(13)) (makeSource()) (0, makeSink());

  setTimeout(function() {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});
