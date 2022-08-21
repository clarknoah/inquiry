
import React, {Component} from 'react';
import "./ThoughtReview.css";
import ManifestedThought from "../../../components/ManifestedThought/ManifestedThought";
import TextField from "@material-ui/core/TextField";
import InquiryModel from "../../../models/GraphModel";
import Button from "@material-ui/core/Button";
// I should be able to change the thought and associated abstract thought

// Class Based React Component
class ThoughtReview extends Component{
  constructor(props){
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtReview",
      aThought:props.aThought,
      mThought:props.mTHought
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
        <div>Thought to Review</div>
      </div>
    );
  }
}

export default ThoughtReview;
disabled