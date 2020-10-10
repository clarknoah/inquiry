import React, { Component } from "react";
import "./ManifestedThought.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import api from "../../services/api";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import utils from "../../services/utils";
import TextField from '@material-ui/core/TextField';
import GraphNode from "../../models/GraphNode";
import InquiryModel from "../../models/GraphModel";

let exp = InquiryModel.getNewModelClass('M_Thought');
console.log(exp);
// Class Based React Component
class ManifestedThought extends Component {
  constructor(props) {
    super(props);
    let mThought = InquiryModel.getNewModelClass("M_Thought");
    mThought.setProperty('dateOfThought','2020-07-17');
    this.inputRef = React.createRef();

    this.state = {
      classList: "ManifestedThought",
      abstractThoughts:[],
      mThought: mThought
    };
  }

  // Runs after Component is loaded in the broswer
  componentDidMount() {}

  // Runs after a component has been updated
  componentDidUpdate() {}

  resetForm=()=>{
    let mThought = InquiryModel.getNewModelClass("M_Thought");
    mThought.setProperty('dateOfThought','2020-07-17');
    this.setState({
      classList: "ManifestedThought",
      abstractThoughts:[],
      mThought: mThought
    })
  }

  onChange = evt => {
    let text = evt.target.value;
    if(text.length > 4){
      api.nodeListQuery("A_Thought", "thought", text).then(res => {
        console.log(res);
        this.setState({
          abstractThoughts:res,
          mThought: this.state.mThought.setProperty('thought',text)
        });
      });
    }else{
      this.setState({
        abstractThoughts:[],
        mThought: this.state.mThought.setProperty('thought',text)
      });
    }

  };
  selectExistingThought=(thought)=>{

    console.log(thought);
    let aThought = InquiryModel.getExistingModelClass(thought.labels[0], thought.identity,thought.properties)
    let mThought = this.state.mThought;
    console.log(this.state.mThought);
    mThought.setProperty('thought',aThought.properties.thought.value);
    //aThought
    this.props.submitThought(aThought, mThought);
    this.inputRef.current.focus();

  }

  compareThoughtString=()=>{
    let same =  this.state.abstractThoughts.filter(val=>{
      return val.name === this.state.thought
    }).length == 0;
    if(same){
      return  <Button
      variant="contained"
      label="Hello"
      onClick={this.selectNewThought}>
                Submit New Thought
                </Button>
    }
  }

  submitThought=(thought)=>{
    let mThought = this.state.mThought;
    mThought.setDefaultProperty('dateOfInput');
    mThought.setDefaultProperty('timestampOfInput');

    let payload = {
      aThought:this.state.aThought
    }
    api.submitThought()
  }

  selectNewThought=()=>{
    let mThought = this.state.mThought;
    mThought.properties.timestampOfThought.setValueByDate(mThought.properties.dateOfThought.value);
    mThought.setAllDefaultProperties();
    let aThought = InquiryModel.getNewModelClass("A_Thought");
    aThought.setMatchingProperties(mThought);
    console.log(mThought);
    this.props.submitThought(aThought, mThought);
    this.inputRef.current.focus();
    this.setState({thought:""})
  }

  // Runs right before a component is removed from the DOM
  componentWillUnmount() {}

  render() {
    let chips = this.state.abstractThoughts.map((val,index)=>{
      return <div>
        <Button
      variant="contained"
      className={"ThoughtLogger-field"}
      label="Hello"
      onClick={()=>{
        this.selectExistingThought(val)
      }}>
                {val.name}
                </Button>
        </div>
    })
    return (
      <div className={this.state.classList}>

         <TextField
         
        id="date"
        label="Date of Thought"
        type="date"
        onChange={(e)=>{
          this.setState({mThought:this
            .state
            .mThought
            .setProperty('dateOfThought',e.target.value)})
        }}
        value={this.state.mThought.properties.dateOfThought.value}
        className={"ThoughtLogger-field"}
        InputLabelProps={{
          shrink: true,
        }}
      />
        <TextField
          id="outlined-multiline-static"
          label="Thought"
          inputRef={this.inputRef}
          multiline
          className={"ThoughtLogger-field"}
          rows={4}
          placeholder="Type in thought"
          variant="outlined"
          value={this.state.mThought.properties.thought.value}
          onChange={this.onChange}
        />
        {this.compareThoughtString()}
        <Card className={"Abstract-Card"}>
          <CardContent>
            {chips}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default ManifestedThought;
