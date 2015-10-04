"use strict";

var fs = require('fs'),
    path = require('path'),
    Heap = require('heap');

let dataDir = __dirname + '/../data';
console.log(dataDir);

class Name {
  constructor(name, gender, count) {
    this.name = name;
    this.gender = gender;
    this.count = parseInt(count);
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
  equals(n) {
    return this.name === n.toLowerCase();
  }
}

class IterationState {
  constructor(names) {
    this.names = names;
    this.lastCount = 0;
  }
  // populates the next item in the iteration
  next() {
    // set our last count to the previous's last count
    if (this.current) {
      this.lastCount = this.current.count;
    }
    // initialize the last index
    if (this.lastIndex == undefined) {
      this.lastIndex = 0;
    }
    // go to the next item
    else {
      this.lastIndex++;
    }
    // make sure our index is in bounds
    if (this.lastIndex < this.names.length) {
      this.current = this.names[this.lastIndex];
    }
    else {
      this.current = null;
    }
    return this.current;
  }
}

var getYearsToNamesFromFiles = function(dir) {
  let years = new Map();
  // get the files
  let files = fs.readdirSync(dir);
  for (var i = 0; i < files.length; ++i) {
    var sortedNames = [];
    //var sortedNames = new Heap((l, r) => r.count - l.count);
    // get the data from each file
    let dataStr = fs.readFileSync(path.join(dir, files[i]));
    if (dataStr) {
      // iterate over the names in the file
      let names = dataStr.toString().split('\n');
      for (var j = 0; j < names.length; ++j) {
        // there might be blank lines
        if (names[j].trim()) {
          // create a name object and store it in the heap
          let parts = names[j].split(',');
          sortedNames.push(new Name(parts[0].toLowerCase(), parts[1], parts[2]));
        }
      }
      // strip off the file suffix
      let yearName = files[i].substring(0, 4);
      years.set(yearName, sortedNames.sort((a, b) => b.count - a.count));
      //years.set(yearName, sortedNames.toArray());
    }
    else {
      console.log(["could not read file", files[i]].join(" "));
    }
  }
  return years;
};


// gets the n and n+1 items out of the heap
var getNthItems = function(heap, n) {
  heap.heapify();
  var items = [];
  for (var i = 0; i < n+1 && heap.size() > 0; i++) {
    items.push(heap.pop());
  }
  for (var i = 0; i < items.length; i++) {
    heap.push(items[i]);
  }
  if (items.length == n+1) {
    return [ items[n-1], items[n] ];
  }
  else {
    return null;
  }
}


var getNames = function(range, num, predicate) {
  // a max heap where the max is the list with the most promising name (lastCount)
  var maxHeap = new Heap((l,r) => r.lastCount - l.lastCount);
  // a max heap where the max is the most promising name
  var names = new Heap((l,r) => r.count - l.count);
  // a dictionary to map names to name objects
  var namesLookup = new Map();
  // the total across the current cross-section
  var total = 0;

  // updates our name lists and the cross-section total
  var updateNameCounts = function(itrState) {
    var currentName = itrState.next();
    if (currentName) {
      if (predicate(currentName)) {
        // see if we already have seen the name
        var existing = namesLookup.get(currentName.name);
        // if we haven't then create one and put it in our lookup and the names heap
        if (!existing) {
          existing = new Name(currentName.name, currentName.gender, currentName.count);
          namesLookup.set(currentName.name, existing);
          names.push(existing);
        }
        // otherwise increment the count by our current instance of the name
        else {
          existing.count += currentName.count;
        }
      }
      // add the current name count to our cross-section total
      total += currentName.count;
      // push the iteration state onto our max heap (which will be sorted to
      //  have the year with the most promising name at the top)
      maxHeap.push(itrState);
    }
  };

  // gets the offset amount by subtracting the nth item count by the nth+1 item
  var getOffset = function(offset, names, num) {
    var items = getNthItems(names, num);
    if (items) {
      offset = items[0].count - items[1].count;
    }
    else {
      offset = 0;
    }
    return offset;
  };


  // get all of the names for the given year range
  for (var i = parseInt(range[0]); i < parseInt(range[1]) + 1; ++i) {
    let name = years.get(i.toString());
    if (name) {
      var itrState = new IterationState(name);
      // process the first name in each list of names to get a bearing
      updateNameCounts(itrState);
    }
  }
  var offset = getOffset(0, names, num);
  // loop while we have a year with a promising name and (our cross-section is
  //  greater than the offset or the matching names is less than the requested
  //  number of names)
  while (maxHeap.size() > 0 && (offset < total || names.size() < num)) {
    //console.log(`offset: ${offset}, total: ${total}, heap: ${names.size()}`);
    for (var i = 0; i < 1000; ++i) {
      var itrState = maxHeap.pop();
      if (!itrState) {
        break;
      }
      // subtract the last name from our total because we will be replacing it
      // with a new name
      total -= itrState.lastCount;
      updateNameCounts(itrState);
    }
    offset = getOffset(offset, names, num);
  }
  var finalNames = [];
  for (var i = 0; i < num; ++i) {
    var name = names.pop();
    if (name) {
      finalNames.push(name);
    }
  }
  return finalNames;
};

let years = getYearsToNamesFromFiles(dataDir);

module.exports = { 'getNames': getNames, 'Name': Name };
