#!/bin/bash
npm install
node tic-tac-toe.js solution > solution.js
./run.sh "########X"
rm *.zip
zip tic-tac-toe.zip -R *
