const {get, set, merge} = require('./util');
const assert = require('./assert');

// TODO state should just have get/set/merge method instead of being an actual object
// TODO rename to state.js
// TODO should be part of object, instead of global
let state = {
  handlers: {
    p2pweb: {
      addHandler: ({state, data: {path, fns}}) => {
        assert(typeof path === 'string', 'handler path must be string');
        path = `handlers.${path}`;
        return {
          state: set(state, path, merge(get(state, path), fns))
        };
      }
    }
  }
};

function dispatch(action) {
  assert(typeof action.type === 'string', 'action must have a type');
  const handler = get(state, `handlers.${action.type}`);
  assert(
    handler instanceof Function,
    `missing handler for "${action.type}"`
  );

  let result = handler({state, action, data: action.data});
  if (!(result instanceof Object)) {
    result = {};
  }
  if (
    result instanceof Object &&
    !(result instanceof Promise) &&
    result.state
  ) {
    assert(result.state instanceof Object, 'state must be an Object');
    assert(result.state.handlers, 'state missing handlers');
    state = result.state;
  }
  if (result instanceof Promise) {
    return result.then(result => {
      assert(
        !result.state,
        `async handler "${action.type}" tries to update state`
      );
      return handleDispatchResult(result);
    });
  } else {
    return handleDispatchResult(result);
  }
}

async function handleDispatchResult(result) {
  if (result.dispatch) {
    assert(
      Array.isArray(result.dispatch),
      'handler result.dispatch must be an array'
    );
    const errors = [];
    for (let action of result.dispatch) {
      if (action === null || typeof action !== 'object') {
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
        throw errors[0].error;
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
function handle(path, fns) {
  dispatch({type: 'p2pweb.addHandler', data: {path, fns}});
}
function getState() {
  return state;
}

module.exports = {dispatch, handle, getState};
