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
// Class Based React Component
class ManifestedThought extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "ManifestedThought",
      thought: "",
      abstractThoughts:[]
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
    console.log(thought);
    thought.exists = true;
    thought.nodeId = thought.identity;
    thought.manifestedVar = `node_${utils.getUniqueId()}`;
    thought.abstractVar = `node_${utils.getUniqueId()}`;
    this.props.submitThought(thought);
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
    let thought = {
      exists:false,
      manifestedVar: `node_${utils.getUniqueId()}`,
      abstractVar:`node_${utils.getUniqueId()}`,
      properties:{
        thought: this.state.thought
      }
    }
    this.props.submitThought(thought);
  }

  // Runs right before a component is removed from the DOM
  componentWillUnmount() {}

  render() {
    let chips = this.state.abstractThoughts.map((val,index)=>{
      return <div><Chip
        label={val.name}
        clickable
        color="primary"
        onClick={()=>{
          this.selectExistingThought(val)
        }}
      /></div>
    })
    return (
      <div className={this.state.classList}>
        <TextareaAutosize
          rowsMin={3}
          aria-label="empty textarea"
          placeholder="Empty"
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
