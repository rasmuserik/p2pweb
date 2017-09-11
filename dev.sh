#!/bin/bash
(
kill `cat .pid-liveserver`
sleep 0.1 
./node_modules/.bin/live-server --no-browser &
echo $! > .pid-liveserver
sleep 1;
google-chrome \
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
touch p2pweb.js) &
while inotifywait -e modify,close_write,move_self -q p2pweb.js
do 
  kill `cat .pid`; 
  kill -9 `cat .pid`; rm .pid
  P2PWEB_URL=ws://localhost RUN_TESTS=true node p2pweb.js && (
  P2PWEB_URL=ws://localhost:3500 \
  P2PWEB_BOOTSTRAP=ws://localhost:3501 \
  P2PWEB_PORT=3500 \
  node p2pweb.js &
  echo $! >> .pid

  P2PWEB_URL=ws://localhost:3501 \
  P2PWEB_BOOTSTRAP=ws://localhost:3500 \
  P2PWEB_PORT=3501 \
  node p2pweb.js &
  echo $! >> .pid

  sleep 0.5
  )
done
