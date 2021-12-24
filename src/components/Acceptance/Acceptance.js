
import React, {Component} from 'react';
import "./Acceptance.css";
import Button from "@material-ui/core/Button";

// Class Based React Component
class Acceptance extends Component{
  constructor(props){
    super(props);


    // Default CSS class to apply to the Component
    this.state = {
      classList: "Acceptance",
      properties:{
        fullyAccept:false,
        fullyAcceptStartTimestamp:Date.now(),
        fullyAcceptEndTimestamp:Date.now(),

      }
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  submitAcceptance=(accept)=>{
    let state = this.state;
    state.properties.fullyAcceptEndTimestamp=Date.now();
    state.properties.fullyAccept = accept;
    this.props.submitAcceptance(state.properties);
  }


  render(){
    return(
      <div className={this.state.classList}>
        <p>Can you accept and enter the feeling fully in this moment?</p>
        <div>
        <Button variant="contained" onClick={()=>{
          this.submitAcceptance(true);
        }}>Yes</Button>
        <Button variant="contained" onClick={()=>{
          this.submitAcceptance(false);
        }}>No</Button>
        </div>
      </div>
    );
  }
}

export default Acceptance;
