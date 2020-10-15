
import React, {Component} from 'react';
import "./ThoughtLogger.css";
import TextField from '@material-ui/core/TextField';
import ManifestedPerception from "../../components/ManifestedPerception/ManifestedPerception";
import ManifestedThought from "../../components/ManifestedThought/ManifestedThought";
import api from "../../services/api";
import Radio from '@material-ui/core/Radio';
// Class Based React Component
class ThoughtLogger extends Component{
  constructor(props){
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtLogger",
      type:"M_Thought"
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  submitPerception=(a, m)=>{
    a.properties.inputType.setValue("logger");
    console.log(a,m);
    //api.submitThought(a, m);
  }

  getType=()=>{
    if(this.state.type=="M_Mental_Image"){
      return "A_Mental_Image"
    }else{
      return "A_Thought"
    }
  }

  selectType=(e)=>{
    console.log(e.target.value);
    let type = e.target.value;
    this.setState({
      type: type,
    })
  }
  getComponent=()=>{
    if(this.state.type=="M_Thought"){
      return <ManifestedPerception label={"Thought"} queryKey="thought" submitPerception={this.submitPerception}/>
     // return <ManifestedThought label={"Thought"} queryKey="thought" submitThought={this.submitPerception}/>
    }else {
      return <ManifestedPerception label={"Mental_Image"} queryKey="perception" submitPerception={this.submitPerception}/>
    }
  }

  render(){
    return(
      <div className={this.state.classList}>
                 <div> 
        <span>Verbal Thought</span>     
       <Radio
        checked={this.state.type == 'M_Thought'}
        onChange={this.selectType}
        value="M_Thought"
      />
      <Radio
        checked={this.state.type=='M_Mental_Image'}
        onChange={this.selectType}
        value="M_Mental_Image"
      /><span>Mental Image</span></div>
        {this.getComponent()}
      </div>
      
    );
  }
}

export default ThoughtLogger;
