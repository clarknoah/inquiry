import React, {Component} from 'react';
import "./ThoughtTrackerSessionsTimeseries.css";

/* 

  Summary: This component will be responsible for showing individual tracker sesssions, 
           and be split into left and right, with the left side containing all the 
           configuration information, and the right side containing the actual timeseries.

  
  Configuration: The Configuration side should contain the following options: 

        1: Start Date Range 
        2: End Date Range 
        3: Switch for showing Thought Count 
        4: Switch for showing time between thoughts 
        5: Select option for how the chart should be displayed 
        6: Switch to determine whether or not certain datapoints should be based off percentages, or a number

        For all switches, if selected, an option should pop up to select which color
        you want the line to be


  Available Datapoints: 

        1: HedonicAffect Percentages 
        2: Average Seconds between thoughts 
        3: Average Thoughts per minute 
        4: Associated Parts with each session
        5: 

*/ 

// Class Based React Component
class ThoughtTrackerSessionsTimeseries extends Component{
  constructor(props){
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtTrackerSessionsTimeseries"
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  render(){
    return(
      <div className={this.state.classList}>
        ThoughtTrackerSessionsTimeseries
      </div>
    );
  }
}

export default ThoughtTrackerSessionsTimeseries;
