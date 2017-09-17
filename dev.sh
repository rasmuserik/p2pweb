#!/bin/bash
(
kill `cat .pid-liveserver`
sleep 0.1 
./node_modules/.bin/webpack-dev-server --content-base dist/ &
echo $! > .pid-liveserver
sleep 1;
echo google-chrome \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500&RUN_TESTS=true" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  "http://localhost:8080/#P2PWEB_BOOTSTRAP=ws://localhost:3500%20ws://localhost:3501" \
  &
touch src/p2pweb.js) &
while inotifywait -e modify,close_write,move_self -q src src/* package.json .eslintrc.js
do 
  kill `cat .pid`; sleep 1
  kill -9 `cat .pid`; rm .pid
  npx eslint src/*.js && (

  P2PWEB_URL=ws://localhost:3500 \
  P2PWEB_BOOTSTRAP=ws://localhost:3501 \
  P2PWEB_PORT=3500 \
  node src/nodejs.js &
  echo $! >> .pid

  sleep 1
  P2PWEB_URL=ws://localhost:3501 \
  P2PWEB_BOOTSTRAP=ws://localhost:3500 \
  P2PWEB_PORT=3501 \
  node src/nodejs.js &
  echo $! >> .pid
  )
done
