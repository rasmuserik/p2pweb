const {get, set, merge} = require('./util');
const {assert} = require('./assert');

let state = {
  handlers: {
    p2pweb: {
      addHandler: ({state, data: {path, fns}}) => {
        assert(typeof path === 'string', 'handler path must be string');
        return {
          state: set(state, path, merge(get(state, path), fns))
        };
      }
    }
  }
};

async function dispatch(action) {
  assert(typeof action.type === 'string', 'action must have a type');
  const handler = get(state, `handlers.${action.type}`);
  assert(
    handler instanceof Function,
    `missing handler for "${action.type}"`
  );

  let result = handler({state: this.state, action, data: action.data});
  if (result instanceof Promise) {
    result = await result;
    assert(
      !result.state,
      `async handler "${action.type}" tries to update state`
    );
  }
  if (result === null || typeof result !== 'object') {
    result = {};
  }
  if (result.state) {
    assert(typeof result.state === Object, 'state must be an Object');

    this.state = state;
  }
  if (result.dispatch) {
    assert(
      Array.isArray(result.dispatch),
      'handler result.dispatch must be an array'
    );
    const errors = [];
    for (let action of dispatch) {
      if (typeof action === null || typeof action !== 'object') {
        action = {};
      }
      try {
        await dispatch(action);
      } catch (error) {
        errors.push({action, error});
      }
    }
    if (errors.length) {
      if (errors.length === 1) {
        throw errors[0];
      } else {
        throw new Error(
          'Multiple errors during dispatch:\n' +
            errors.map(o => `${o.action.type}: ${o.error}`).join('\n')
        );
      }
    }
  }
  if (result.result) {
    return result.result;
  }
}

function handler(path, fns) {
  dispatch({type: 'p2pweb.addHandler', data: {path, fns}});
}

modules.exports = {dispatch, handler};
