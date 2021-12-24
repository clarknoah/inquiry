import React from 'react';
import "./KeyboardVisualizer.css";

// Function based React Component
const KeyboardVisualizer = (props) => {
  let properties = Object.keys(props.keys);
  let displayKeys = []
   properties.forEach(key=>{
    key = props.keys[key]
    if(key.type === "input"){
      displayKeys.push(key);
    }
  })
  // Default Class to apply to Component
  let classList = `KeyboardVisualizer`;


  return(
    <div className={classList}>
      {displayKeys.map(key=>{
        console.log(key);
        return <div className={`${key.pressed ? "showKey" : "hideKey"}`}>{key.label}</div>
      })}
    </div>
  );
}

export default KeyboardVisualizer;
