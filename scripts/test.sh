cd client && grunt build --force && cd ../ &&
istanbul cover node_modules/.bin/_mocha test/**/*.js --report lcovonly -- -R spec
