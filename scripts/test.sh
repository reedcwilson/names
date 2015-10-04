cd client && grunt build --force && cd ../ &&
istanbul cover node_modules/.bin/_mocha "test/**/*Test.js" -- -R spec
