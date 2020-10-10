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
import models from "../../models/inquiry_models_v1.json";

console.log(new GraphNode(models.collections.filter(node=>node.collectionName=="A_Thought")[0]));
// Class Based React Component
class ManifestedThought extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.inputRef = React.createRef();

    this.state = {
      classList: "ManifestedThought",
      thought: "",
      dateOfThought:"2020-07-17",
      abstractThoughts:[],
      thoughtDate:null
    };
  }

  // Runs after Component is loaded in the broswer
  componentDidMount() {}

  // Runs after a component has been updated
  componentDidUpdate() {}

  onChange = evt => {
    let text = evt.target.value;
    if(text.length > 4){
      api.nodeListQuery("Abstract_Thought", "thought", text).then(res => {
        console.log(res);
        this.setState({
          thought: text,
          abstractThoughts:res
        });
      });
    }else{
      this.setState({
        thought: text,
        abstractThoughts:[]
      });
    }

  };
  selectExistingThought=(thought)=>{
    let currentDate = new Date();
    const offset = currentDate.getTimezoneOffset()
    currentDate = new Date(currentDate.getTime() - (offset*60*1000))

    thought.properties.dateOfThought = this.state.dateOfThought;
    thought.properties.dateOfInput = currentDate.toISOString().split('T')[0]
    thought.properties.timestampOfInput = Date.now();
    console.log(thought);
    thought.exists = true;
    thought.nodeId = thought.identity;
    thought.manifestedVar = `node_${utils.getUniqueId()}`;
    thought.abstractVar = `node_${utils.getUniqueId()}`;
    this.props.submitThought(thought);
    this.inputRef.current.focus();
    this.setState({
      thought:"",
      abstractThoughts:[]
    })
  }

  compareThoughtString=()=>{
    console.log(this.state.thought, )
    let same =  this.state.abstractThoughts.filter(val=>{
      return val.name === this.state.thought
    }).length == 0;
    console.log(same);
    if(same){
      return  <Button
      variant="contained"
      label="Hello"
      onClick={this.selectNewThought}>
                Submit New Thought
                </Button>
    }
  }

  selectNewThought=()=>{
    let currentDate = new Date();
    const offset = currentDate.getTimezoneOffset()
    currentDate = new Date(currentDate.getTime() - (offset*60*1000))
    console.log(this.state.dateOfThought);
    let thought = {
      exists:false,
      manifestedVar: `node_${utils.getUniqueId()}`,
      abstractVar:`node_${utils.getUniqueId()}`,
      properties:{
        thought: this.state.thought,
        dateOfThought:this.state.dateOfThought
      }
    }
    thought.properties.dateOfInput = currentDate.toISOString().split('T')[0]
    thought.properties.timestampOfInput = Date.now();
    this.props.submitThought(thought);
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
          this.setState({dateOfThought:e.target.value})
        }}
        value={this.state.dateOfThought}
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
          value={this.state.thought}
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
