"use strict";

var fs = require('fs'),
    path = require('path');

let dataDir = 'data';

class Name {
  constructor(name, gender, instances) {
    this.name = name;
    this.gender = gender;
    this.instances = instances;
  }
  isFemale() {
    return this.gender.toUpperCase() === 'F';
  }
  isMale() {
    return this.gender.toUpperCase() === 'M';
  }
  startsWith(c) {
    return this.name.startsWith(c);
  }
}


var getYearsToNamesFromFiles = function(dir) {
  let years = new Map();
  // get the files
  let files = fs.readdirSync(dir);
  for (var i = 0; i < files.length; ++i) {
    let year = [];
    // get the data from each file
    let dataStr = fs.readFileSync(path.join(dir, files[i]));
    if (dataStr) {
      // iterate over the names in the file
      let names = dataStr.toString().split('\n');
      for (var j = 0; j < names.length; ++j) {
        // there might be blank lines
        if (names[j].trim()) {
          // create a name object and store it in the year array
          let parts = names[j].split(',');
          year.push(new Name(parts[0], parts[1], parts[2]));
        }
      }
      // strip off the file suffix
      let yearName = files[i].substring(0, 4);
      years.set(yearName, year);
    }
    else {
      console.log(["could not read file", files[i]].join(" "));
    }
  }
  return years;
};

var getMostPopular = function(years, range, num, predicate) {
  let names = [];
  var atLeastOneYear = true;
  var nameDepth = 0;
  var namesFound = [];
  // iterate over the names in the years (max length)
  while(atLeastOneYear) {
    ++nameDepth;
    atLeastOneYear = false;
    // iterate over the years between the given range
    var depthTotal = 0;
    for (var i = parseInt(range[0]); i < parseInt(range[1]) + 1; ++i) {
      if (years[i].length > nameDepth) {
        atLeastOneYear = true;
        var name = years[i][nameDepth];
        if (predicate(name)) {
          depthTotal += name.instances;

          namesFound.push(name);
        }
      }
    }
  }
};


// get the 5 most popular male names from 1900 to 2000
let years = getYearsToNamesFromFiles(dataDir);
let names = getMostPopular(years, ['1900', '2000'], 5, n => n.isMale());
console.log(names);
