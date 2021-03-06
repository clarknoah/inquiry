import _ from "lodash";
import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
let utils = {
  addslashes: function (str) {
    return (str + "").replace(/[\\"'`]/g, "\\$&").replace(/\u0000/g, "\\0");
  },
  loading: () => {
    return <div className="Loading"><CircularProgress /></div>
  },

  createUniqueArray: (inputArray, filterKey) => {
    var flags = {};
    var filteredArray = inputArray.filter(function (entry) {
      if (flags[entry[filterKey]]) {
        return false;
      }
      flags[entry.city] = true;
      return true;
    });
    return filteredArray;
  },

  getUniqueId: function () {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  },

  shuffle: function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },
  deduplicateArray: (arr, key) => {
    arr = arr.filter(function (obj, index, self) {
      return index === self.findIndex(function (t) {
        return t[key] === obj[key].toLowerCase().trim();
      });
    })
    return arr;
  },
  parseBoolean: (string) => {
    string = string.toLowerCase();
    if (string === "false") {
      return false;
    } else if (string === "true") {
      return true;
    } else {
      return undefined;
    }
  },
  getColorArray: (amount) => {
    let isPrime = (value) => {
      for (var i = 2; i < value; i++) {
        if (value % i === 0) {
          return false;
        }
      }
      return value > 1;
    }
    let closestPrime = (x) => {
      let lowerPrime, higherPrime;
      let counter = 1;
      if (isPrime(x)) {
        return [x];
      }
      while (!(lowerPrime && higherPrime)) {
        if (!higherPrime) {
          if (isPrime(x + counter)) {
            higherPrime = x + counter;
          }
        }
        if (!lowerPrime) {
          if (isPrime(x - counter)) {
            lowerPrime = x - counter;
          }
        }
        counter++
      }
      return higherPrime;
    }
    
    console.log(`Number of different lines: ${amount}`)
    amount = closestPrime(amount);
    let colors = [];
    let multiplier = Math.floor(16777215 / amount);
    for (let i = 1; i < amount; i++) {
      colors.push("#" + Math.floor(multiplier * i).toString(16))
    }
    console.log(colors);
    return colors;
  }
};

export default utils;
