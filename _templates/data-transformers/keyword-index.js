// Need to take in an array of strings

const { map } = require("d3-array");

let thoughts;

// Create a map object which will server as the index

let keywordMap = {};

// For each Element in the array
for(let i = 0; i < thoughts.length; i++){
    //Parse out all non alphabet letters
    //Split the string by spaces
    
    let thought = thoughts[i].toLowerCase().replace(/[^a-z]/gi, '').split(" ");

    // Iterate through each token in the array
    for(let j = 0; j < thought.length; j++){
        
        // check if it exists in the map
        let key = thought[i];
        if(!!keywordMap[key]){
            keywordMapp[key]++;
        }else{
            keywordMapp[key] = 1;
        }
        // If it doesn't exist in the map, assign a key and value to the map
        
        // If it does exist, iterate the key on the map by 1
    }
    
}

// Now we need to sort the key/values into an array with the largest value at index 0
let keywordArray = Object.keys(keywordMap).map(key=>{
    return {
        word:map,
        count:keywordMap[map]
    }
})

keywordArray = keywordArray.sort(function(a, b) {
    return parseFloat(a.price) - parseFloat(b.price);
});
// 



for(let i = 0; i < 10; i++){
    console.log(keywordArray[i]);
}