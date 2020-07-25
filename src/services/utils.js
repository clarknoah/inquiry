import _ from "lodash";
import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
let utils = {
  addslashes: function(str) {
    return (str + "").replace(/[\\"'`]/g, "\\$&").replace(/\u0000/g, "\\0");
  },
  loading:()=>{
    return <div className="Loading"><CircularProgress/></div>
  },

  createUniqueArray: (inputArray, filterKey) => {
    var flags = {};
    var filteredArray = inputArray.filter(function(entry) {
      if (flags[entry[filterKey]]) {
        return false;
      }
      flags[entry.city] = true;
      return true;
    });
    return filteredArray;
  },

  getUniqueId: function() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  },

  shuffle: function(array) {
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
  parseBoolean:(string)=>{
    string = string.toLowerCase();
    if(string === "false"){
      return false;
    }else if (string==="true"){
      return true;
    }else{
      return undefined;
    }
  }
};

export default utils;
