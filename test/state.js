const {dispatch, handle, getState} = require('../src/state');
const {set, get, sleep, throwError} = require('../src/util');
const assert = require('assert');

describe('dispatch', () => {
  handle('test.a', ({state, data}) => {
    return {state: set(state, 'test.hello', data)};
  });
  handle('test', {
    b: ({state}) => ({result: get(state, 'test.hello', 'efg')}),
    err: () => throwError('argh'),
    twiceErr: () => ({
      dispatch: [{type: 'test.err'}, {type: 'test.err'}]
    }),
    twiceWithErr: () => ({
      dispatch: [{type: 'test.err'}, {type: 'test.a', data: 123}]
    })
  });
  it('dispatches', async () => {
    assert.equal(await dispatch({type: 'test.b'}), 'efg');
    dispatch({type: 'test.a', data: 'abc'});
    assert.equal(await dispatch({type: 'test.b'}), 'abc');
  });
  it('handles errors', async () => {
    try {
      await dispatch({type: 'test.err'});
    } catch (e) {
      assert.equal(String(e), `Error: argh`);
    }

    try {
      await dispatch({type: 'test.twiceErr'});
    } catch (e) {
      assert.equal(
        String(e),
        `Error: Multiple errors during dispatch:
test.err: Error: argh
test.err: Error: argh`
      );
    }
  });
  it('runs through all dispatches, even if errors occurs', async () => {
    try {
      await dispatch({type: 'test.twiceWithErr'});
    } catch (e) {
      assert.equal(String(e), `Error: argh`);
    }
    assert.equal(getState().test.hello, 123);
  });
});
