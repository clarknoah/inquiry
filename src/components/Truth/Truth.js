
import React, {Component} from 'react';
import "./Truth.css";
import Button from "@material-ui/core/Button";

// Class Based React Component
class Truth extends Component{
  constructor(props){
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "Truth",
      isItTrue:null,
      certainlyTrue:null,
      isItTrueStartTimestamp:Date.now(),
      isItTrueEndTimestamp:null,
      isItTrueDuration:null,
      certainlyTrue:null,
      certainlyTrueStartTimestamp:null,
      certainlyTrueEndTimestamp:null,
      certainlyTrueDuration:null
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  onChange=(bool)=>{
    console.log("Changing");
    let state = this.state;
    if(bool==true){
      state.isItTrueEndTimestamp = Date.now();
      state.isItTrueDuration = state.isItTrueEndTimestamp - state.isItTrueStartTimestamp;
      state.isItTrueDuration = parseInt(state.isItTrueDuration.toString().split("")[0]);
      this.setState({
        isItTrue:bool,
        isItTrueEndTimestamp:state.isItTrueEndTimestamp,
        isItTrueDuration: state.isItTrueDuration,
        certainlyTrueStartTimestamp:Date.now()

      })
    }else if(bool==false){
      this.setState({
        isItTrue:false
      },()=>{
        this.submitTrue();
      })
    }

  }

  onCertainChange=(bool)=>{
    console.log("Changing");
    this.setState({
      certainlyTrue:bool
    },()=>{
      this.submitTrue();
    })
  }

  submitTrue=()=>{
    let state = this.state;
    if(this.state.isItTrue==false){
      state.isItTrueEndTimestamp = Date.now();
      state.isItTrueDuration = state.isItTrueEndTimestamp - state.isItTrueStartTimestamp;
      state.isItTrueDuration = parseInt(state.isItTrueDuration.toString().split("")[0]);
      console.log(state);
      this.props.submitTruth(state);
    }else if(this.state.isItTrue==true && this.certainlyTrue!==null){
      state.certainlyTrueEndTimestamp = Date.now();
      state.certainlyTrueDuration = state.certainlyTrueEndTimestamp - state.certainlyTrueStartTimestamp;
      state.certainlyTrueDuration = parseInt(state.certainlyTrueDuration.toString().split("")[0]);
      console.log(state);
      this.props.submitTruth(state);
    }
  }



  ifTrue=()=>{
    console.log("If True");
    if(this.state.isItTrue==true){
      console.log("Thought true")
      return (<div>
          <p>Can you be absolutely certain that this thouht is true?</p>
          <div>
          <Button onClick={()=>{this.onCertainChange(true)}}>Yes</Button>
          <Button onClick={()=>{this.onCertainChange(false)}}>No</Button>
          </div>
        </div>)
    }

  }

  render(){
    return(
      <div className={this.state.classList}>
        <p>Is this thought true?</p>
        <div>
          <Button onClick={()=>{this.onChange(true)}}>Yes</Button>
          <Button onClick={()=>{this.onChange(false)}}>No</Button>
        </div>
        {this.ifTrue()}
      </div>
    );
  }
}

export default Truth;
