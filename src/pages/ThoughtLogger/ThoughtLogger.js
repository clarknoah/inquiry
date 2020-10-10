
import React, {Component} from 'react';
import "./ThoughtLogger.css";
import TextField from '@material-ui/core/TextField';
import ManifestedThought from "../../components/ManifestedThought/ManifestedThought";
import api from "../../services/api";
// Class Based React Component
class ThoughtLogger extends Component{
  constructor(props){
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtLogger"
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  submitThought=(a, m)=>{

    api.submitThought(a, m);
  }

  render(){
    return(
      <div className={this.state.classList}>
           
        <ManifestedThought submitThought={this.submitThought}/>
      </div>
      
    );
  }
}

export default ThoughtLogger;
