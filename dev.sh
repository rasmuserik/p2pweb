#!/bin/bash -x
(
kill `cat .pid-liveserver`
sleep 0.1 
./node_modules/.bin/live-server --no-browser &
echo $! > .pid-liveserver
sleep 1;
google-chrome \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3500" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3501" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3500" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3501" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3500" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3501" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3500" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3501" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3500" \
  "http://localhost:8080/#SEA_BOOTSTRAP=ws://localhost:3501" \
  &
touch p2pweb.js) &
while inotifywait -e modify,close_write,move_self -q p2pweb.js
do 
  kill `cat .pid`
  sleep 0.1
  SEA_URL=ws://localhost:3500 \
  SEA_BOOTSTRAP=ws://localhost:3501 \
  SEA_PORT=3500 \
  node p2pweb.js &
  echo $! > .pid
  sleep 1;

  SEA_URL=ws://localhost:3501 \
  SEA_BOOTSTRAP=ws:localhost:3500 \
  SEA_PORT=3501 \
  node p2pweb.js &
  echo $! >> .pid
  sleep 1
done
