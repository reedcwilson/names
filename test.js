'use strict';

var nameManager = require('./name_manager');

nameManager.getMostPopular

// get the 5 most popular male names from 1900 to 2000
//let names = nameManager.getMostPopular(['1900', '2000'], 5, n => n.isMale());
//console.log(names);

// get the 5 most popular names from 2014 that start with 'r'
//let names = nameManager.getMostPopular(['2014', '2014'], 5, n => n.startsWith('r'));
//console.log(names);

// doesn't show the female versions
//let names = nameManager.getMostPopular(['1900', '2014'], 5, n => n.startsWith('reed'));
//console.log(names);

// it reports ryan as the top with a gender of female. the number of names might be right but the gender is wrong
let names = nameManager.getMostPopular(['2014', '2014'], 5, n => n.startsWith('r'));
console.log(JSON.stringify(names));
