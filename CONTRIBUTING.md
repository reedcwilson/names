# CONTRIBUTING
 
A seed that uses yeoman generators to springboard into angular and express development.

## Install and Deploy

You will need both node.js and ruby in your environment and they will need to be available on the PATH. The app uses express and AngularJS which is what uses node.js. The build environment requires Compass primarily for conversion from Sass to CSS. Compass also does quite a few other things which is why we justify using it in a node.js app.

node.js (preferrably using nvm) nvm install stable

ruby (preferrably using rvm or rbenv)

compass gem install compass

Install the following node modules globally:

npm install -g express bower phantomjs grunt-cli lru-cache
Clone this repository

    npm install && bower install
    
The following command packages up (minifies, concatenates, revs, etc.) all of the client files and places them in a dist directory at the root.

    grunt
    
You can now simply push the directory to your hosting server. Note that you may exclude the following directories:

- bower_components
- client
- scripts
- test
- coverage

## Run

The app will run in production mode by typing the standard npm start script

    npm start
    
## Contribute

You will need to set up your environment with the following tools:

    npm install -g yo express-generator generator-angular nodemon

Run the app by opening two shells and executing the following commands:

In the first shell

    grunt serve
    
In the second shell

    npm run dev
