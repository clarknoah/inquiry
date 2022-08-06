// Need to take in an array of strings
let thoughts = require("./neoData.json");
console.log(thoughts.length);

// Create a map object which will server as the index

let keywordMap = {};

// For each Element in the array
for(let i = 0; i < thoughts.length; i++){
    //Parse out all non alphabet letters
    //Split the string by spaces
    let thought = thoughts[i]["mt.perception"].toLowerCase().split(" ").map(val=>val.replace(/[^a-z]/gi, ''));
    
    // console.log(thought);
    // Iterate through each token in the array
    for(let j = 0; j < thought.length; j++){
        
        // check if it exists in the map
        let key = thought[j];
        if(!!keywordMap[key] && key.length > 0){
            keywordMap[key]++;
        }else if(key.length > 0){
            keywordMap[key] = 1;
        }
        // If it doesn't exist in the map, assign a key and value to the map
        
        // If it does exist, iterate the key on the map by 1
    }
    
}

// Now we need to sort the key/values into an array with the largest value at index 0
let keywordArray = Object.keys(keywordMap).map(key=>{
    return {
        word:key,
        count:keywordMap[key]
    }
})
keywordArray = keywordArray.sort(function(a, b) {
    return parseFloat(b.count) - parseFloat(a.count);
});
// 




for(let i = 0; i < 1000; i++){
   console.log(keywordArray[i]);
}