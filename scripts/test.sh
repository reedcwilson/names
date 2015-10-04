cd client && grunt build --force && cd ../ &&
mocha "test/**/*.js"
echo "listing current"
ls
echo "listing node_modules"
ls node_modules
echo "listing .bin"
.bin
