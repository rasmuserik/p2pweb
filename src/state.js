const {get, set, merge} = require('./util');
const assert = require('./assert');

// TODO state should just have get/set/merge method instead of being an actual object
// TODO rename to state.js
// TODO should be part of object, instead of global

class Node {
  constructor() {
    this.handlers = {};
    this.state = {};
  }
  dispatch(action) {
    assert(typeof action.type === 'string', 'action must have a type');
    const handler = get(this.handlers, action.type);
    assert(
      handler instanceof Function,
      `missing handler for "${action.type}"`
    );

    let result = handler({
      state: this.state,
      action,
      data: action.data
    });
    if (!(result instanceof Object)) {
      result = {};
    }
    if (
      result &&
      result instanceof Object &&
      !(result instanceof Promise) &&
      result.state
    ) {
      assert(
        result.state instanceof State,
        'state must be a State object'
      );
      this.state = result.state;
    }

    if (result instanceof Promise) {
      return result.then(result => {
        assert(
          !result.state,
          `async handler "${action.type}" tries to update state`
        );
        return this.handleDispatchResult(result);
      });
    } else {
      return this.handleDispatchResult(result);
    }
  }
  getState() {
    return this.state;
  }
  addHandler({type, fn}) {
    assert(typeof path === 'string', 'handler path must be string');
    assert(typeof fn === 'function', 'handler must be a function');
    this.handler = set(this.handler, type, fn);
  }
}

class State {
  constuctor(state = {}) {
    this.state = state;
  }
  get(path, defaultValue) {
    if (path === undefined) {
      return this.state;
    } else {
      get(this.state, path, defaultValue);
    }
  }
  set(path, value) {
    return new State(set(this.state, path, value));
  }
  merge(obj) {
    return new State(merge(this.state, obj));
  }
}

//module.exports = {dispatch, handle, getState};
