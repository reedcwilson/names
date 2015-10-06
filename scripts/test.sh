cd client && grunt build && grunt test && cd ../ &&
istanbul cover --dir 'coverage/server' node_modules/.bin/_mocha 'test/**/*Test.js' -- -R spec
./node_modules/.bin/lcov-result-merger 'coverage/*/lcov.info' 'coverage/lcov.info'
