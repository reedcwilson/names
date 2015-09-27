"use strict";

var fs = require('fs'),
    path = require('path'),
    Heap = require('heap');

let dataDir = 'data';

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
    var sortedNames = new Heap((l, r) => r.count - l.count);
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
      years.set(yearName, sortedNames.toArray());
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

var getMostPopular = function(range, num, predicate) {
  var maxHeap = new Heap((l,r) => r.lastCount - l.lastCount);
  var names = new Heap((l,r) => r.count - l.count);
  var namesLookup = new Map();
  var total = 0;

  var updateNameCounts = function(itrState) {
    var currentName = itrState.next();
    if (currentName) {
      if (predicate(currentName)) {
        // indexed by name and/or gender
        var existing = namesLookup.get(currentName.name);
        if (!existing) {
          existing = new Name(currentName.name, currentName.gender, currentName.count);
          namesLookup.set(currentName.name, existing);
          names.push(existing);
        }
        else {
          existing.count += currentName.count;
        }
      }
      total += currentName.count;
      maxHeap.push(itrState);
    }
  }

  for (var i = parseInt(range[0]); i < parseInt(range[1]) + 1; ++i) {
    let name = years.get(i.toString());
    if (name) {
      var itrState = new IterationState(name);
      updateNameCounts(itrState);
    }
  }
  var offset = 0;
  var items = getNthItems(names, num);
  if (items) {
    offset = items[0].count - items[1].count;
  }
  else {
    offset = 0;
  }
  while (maxHeap.size() > 0 && (offset < total || names.size() < num)) {
    //console.log(`offset: ${offset}, total: ${total}, heap: ${names.size()}`);
    for (var i = 0; i < 1000; ++i) {
      var itrState = maxHeap.pop();
      if (!itrState) {
        break;
      }
      total -= itrState.lastCount;
      updateNameCounts(itrState);
    }
    items = getNthItems(names, num);
    if (items) {
      offset = items[0].count - items[1].count;
    }
    else {
      offset = 0;
    }
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

module.exports = { 'getMostPopular': getMostPopular };
