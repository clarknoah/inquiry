
import React, {Component} from 'react';
import "./Truth.css";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
// Class Based React Component
class Truth extends Component{
  constructor(props){
    super(props);
    // console.log(props);
    let state = {
      classList: "Truth",
      button1:"outlined",
      button2:"outlined",
      button3:"outlined",
      button4:"outlined",
      isItTrue:null,
      certainlyTrue:null,
    };
    if(props.memory!==undefined){
      state = props.memory;
    }
    this.state = state;
  }


  onChange=(bool)=>{
    // console.log("Changing");
    let state = this.state;
    if(bool==true){

      this.setState({
        isItTrue:bool,
        button1:"contained",
        button2:"outlined"
      })
    }else if(bool==false){
      this.setState({
        isItTrue:false,
        button2:"contained",
        button1:"outlined"
      },()=>{
        this.submitTrue();
      })
    }

  }

  onCertainChange=(bool)=>{
    // console.log("Changing");
    if(bool==true){
      this.setState({
        certainlyTrue:bool,
        
        button3:"contained",
        button4:"outlined"
      },()=>{
        this.submitTrue();
      })
    }else if(bool==false){
      this.setState({
        certainlyTrue:bool,
  
        button4:"contained",
        button3:"outlined"
      },()=>{
        this.submitTrue();
      })
    }

  }

  submitTrue=()=>{
    let state = this.state;
    if(this.state.isItTrue==false){

      this.props.submitTruth(state);
    }else if(this.state.isItTrue==true && this.certainlyTrue!==null){
      // console.log(state);
      this.props.submitTruth(state);
    }
  }



  ifTrue=()=>{
    // console.log("If True");
    if(this.state.isItTrue==true){
      // console.log("Thought true")
      return (<div>
          <p>Can you be absolutely certain that this thought is true?</p>
          <div>
          <Button color="secondary" variant={this.state.button3} size="large" onClick={()=>{this.onCertainChange(true)}}>Yes</Button>
          <Button color="secondary" variant={this.state.button4} size="large" onClick={()=>{this.onCertainChange(false)}}>No</Button>
          </div>
        </div>)
    }

  }

  render(){
    return(
      <div className={this.state.classList}>
        <p>Is this thought true?</p>
        <div>
          <Button color="secondary" variant={this.state.button1} size="large" onClick={()=>{this.onChange(true)}}>Yes</Button>
          <Button color="secondary" variant={this.state.button2} size="large" onClick={()=>{this.onChange(false)}}>No</Button>
        </div>
        {this.ifTrue()}
        <Divider/>
      </div>
    );
  }
}

export default Truth;
