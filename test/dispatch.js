const {dispatch, handle, getState} = require('../src/dispatch');
const {set, get, sleep} = require('../src/util');
const assert = require('assert');

describe('dispatch', () => {
  handle('test.a', ({state, data}) => {
    return {state: set(state, 'test.hello', data)};
  });
  handle('test', {
    b: ({state}) => ({result: get(state, 'test.hello', 'efg')})
  });
  it('dispatches', async () => {
    assert.equal(await dispatch({type: 'test.b'}), 'efg');
    dispatch({type: 'test.a', data: 'abc'});
    assert.equal(await dispatch({type: 'test.b'}), 'abc');
  });
});
