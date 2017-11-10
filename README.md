<img src=https://p2pweb.solsort.com/icon.png width=96 height=96 align=right>

[![website](https://img.shields.io/badge/website-p2pweb.solsort.com-blue.svg)](https://p2pweb.solsort.com/)
[![github](https://img.shields.io/badge/github-solsort/p2pweb-blue.svg)](https://github.com/solsort/p2pweb)
[![travis](https://img.shields.io/travis/solsort/p2pweb.svg)](https://travis-ci.org/solsort/p2pweb)
[![coveralls](https://img.shields.io/coveralls/solsort/p2pweb.svg)](https://coveralls.io/r/solsort/p2pweb?branch=master)
[![npm](https://img.shields.io/npm/v/p2pweb.svg)](https://www.npmjs.com/package/p2pweb)

# P2P Web

This is a library (**under development**) for building peer-to-peer web applications.

## Design

- Connection
    - `send(data)`
    - `close()`
    - *abstract* `onclose()`
    - *abstract* `onmessage(data)`
- NetworkAbstraction (abstraction across websocket/webrtc)
    - `startSignalling(signalConnection)`
    - `receiveSignalling(signalConnection)`
        - `{websocket: url}`
    - *abstract* `onconnection(resultConnection)`
- Node
    - `String address` (const)
    - `Map connections[address]` (semi-private)
    - `Map handlers` `.set(type, [async(no-return-state)] {data, state, call, emit, local, address} => {state, result}`)
    - `emit({dest, type, data})`
    - `async call({dest, type, data, timeout})`
    - `onconnection(con)`
    - `state`
- message:
    - `type`
    - `data`
    - `from`
    - `dest`
    - `reply: [dest, type]`
    - data: ...


### Node




## Old notes:

- [Introduction/readme](https://p2pweb.solsort.com)
- [Code documentation](https://p2pweb.solsort.com/jsdoc)
- [Source code on github](https://github.com/solsort/p2pweb)
- [Notes](https://p2pweb.solsort.com/notes) ([pdf](https://p2pweb.solsort.com/notes.pdf))
