#!/bin/bash
(
kill `cat .pid-liveserver`
sleep 0.1 
npx live-server --no-browser dist &
echo $! > .pid-liveserver
sleep 1;
google-chrome \
  'http://localhost:8080/#P2PWEB_BOOTSTRAP=["ws://localhost:3500","ws://localhost:3501"]' \
  'http://localhost:8080/#P2PWEB_BOOTSTRAP=["ws://localhost:3500","ws://localhost:3501"]' \
  'http://localhost:8080/#P2PWEB_BOOTSTRAP=["ws://localhost:3500","ws://localhost:3501"]' \
  'http://localhost:8080/#P2PWEB_BOOTSTRAP=["ws://localhost:3500","ws://localhost:3501"]' \
  'http://localhost:8080/#P2PWEB_BOOTSTRAP=["ws://localhost:3500","ws://localhost:3501"]' \
  'http://localhost:8080/#P2PWEB_BOOTSTRAP=["ws://localhost:3500","ws://localhost:3501"]' \
  'http://localhost:8080/#P2PWEB_BOOTSTRAP=["ws://localhost:3500","ws://localhost:3501"]' \
  &
touch src/main.js) &
while inotifywait -e modify,close_write,move_self -q src src/* package.json .eslintrc.js
do 
  kill `cat .pid`; sleep 1
  npx eslint src/*.js && 
  make dist/p2pweb.js &&
  (

  P2PWEB_URL=ws://localhost:3500 \
  P2PWEB_BOOTSTRAP=ws://localhost:3501 \
  P2PWEB_PORT=3500 \
  node src/nodejs.js &
  echo $! >> .pid

  sleep 0.5
  P2PWEB_URL=ws://localhost:3501 \
  P2PWEB_BOOTSTRAP=ws://localhost:3500 \
  P2PWEB_PORT=3501 \
  node src/nodejs.js &
  echo $! >> .pid
  )
done
