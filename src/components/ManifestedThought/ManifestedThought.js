import React, { Component } from "react";
import "./ManifestedThought.css";
import api from "../../services/api";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InquiryModel from "../../models/GraphModel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from '@material-ui/core/Radio';
class ManifestedThought extends Component {
  constructor(props) {
    super(props);
    let newThought = true;
    let mThought = InquiryModel.getNewModelClass("M_Thought");
    mThought.properties.thought.value = "";
    if(props.date!==undefined){
      mThought.setProperty("dateOfThought", props.date);
      newThought = false;
    }
    this.inputRef = React.createRef();

    this.state = {
      classList: "ManifestedThought",
      abstractThoughts: [],
      mThought: mThought,
      newThought: newThought,
      type: "verbal"
    };
  }

  // componentWillUnmount(){
  //   this.props.finalInput(this.mThought.timestampOfInput.value);
  // }

  resetForm = () => {
    let mThought = InquiryModel.getNewModelClass("M_Thought");
    mThought.properties.thought.value = "";
    if(this.state.newThought == false){
      mThought.properties.dateOfThought.setValue(this.state.mThought.properties.dateOfThought.value)
    }
    if(this.props.date!==undefined){
      mThought.setProperty("dateOfThought", this.props.date);
    }
    this.setState({
      classList: "ManifestedThought",
      abstractThoughts: [],
      mThought: mThought,
      newThought: this.state.newThought,
    },()=>{
      this.inputRef.current.focus();
    });
  };

  getType=()=>{
    if(this.state.type=="image"){
      return "A_Mental_Image"
    }else{
      return "A_Thought"
    }
  }

  onChange = (evt) => {
    let mThought = this.state.mThought;
    let text = evt.target.value;
    if (text.length === 1 && this.state.newThought == true) {
      mThought.setNewThoughtTimes();
    } else if(text.length === 1 && this.state.newThought == false) {
      mThought.setExistingThoughtTimes(mThought.properties.dateOfThought.value);
    }
    if (text.length > 0) {
      api.nodeListQuery(this.getType(), "thought", text).then((res) => {
       // console.log(res);
        this.setState({
          abstractThoughts: res,
          mThought: this.state.mThought.setProperty("thought", text),
        });
      });
    } else {
      this.setState({
        abstractThoughts: [],
        mThought: mThought.setProperty("thought", text),
      });
    }
  };

  selectNewThought = () => {
    let mThought = this.state.mThought;
    mThought.setInputDuration();
    let aThought = InquiryModel.getNewModelClass(this.getType());
    aThought.setMatchingProperties(mThought);
    this.submitThought(aThought, mThought);
  };


  selectExistingThought = (thought) => {
    let mThought = this.state.mThought;
    mThought.setInputDuration();
    let aThought = InquiryModel.getExistingModelClass(
      thought.labels[0],
      thought.identity,
      thought.properties
    );
    mThought.setProperty("thought", aThought.properties.thought.value);
    this.submitThought(aThought, mThought);
  };

  submitThought = (aThought, mThought) => {
    this.props.submitThought(aThought, mThought);
    this.resetForm();
  };

  compareThoughtString = () => {
    let same =
      this.state.abstractThoughts.filter((val) => {
        val = val.name.toLowerCase().trim();
        let thought = this.state.mThought.properties.thought.value.toLowerCase().trim();
        return val === thought;
      }).length == 0;
    if (same) {
      return (
        <Button
        className={"ThoughtLogger-field"}
          variant="contained"
          label="Hello"
          onClick={this.selectNewThought}
        >
          Submit New Thought
        </Button>
      );
    }
  };

  selectType=(e)=>{
    console.log(e.target.value);
    let type = e.target.value;
    let mThought = this.state.mThought;
    if(type == "verbal"){
      mThought.labels = ['M_Thought'];
    }else{
      mThought.labels = ['M_Mental_Image'];
    }
    this.setState({
      type: type,
      mThought: mThought
    })
  }

  render() {
    let chips = this.state.abstractThoughts.map((val, index) => {
      return (
        <React.Fragment>
          <Button
            color="primary"
            variant="contained"
            className={"ThoughtLogger-field"}
            label="Hello"
            onClick={() => {
              this.selectExistingThought(val);
            }}
          >
            {val.name}
          </Button>
        </React.Fragment>
      );
    });
    return (
      <div className={this.state.classList}>
      <div> 
        <span>Verbal Thought</span>     
       <Radio
        checked={this.state.type == 'verbal'}
        onChange={this.selectType}
        value="verbal"
      />
      <Radio
        checked={this.state.type=='image'}
        onChange={this.selectType}
        value="image"
      /><span>Mental Image</span></div>
        {this.props.date === undefined ?<FormControlLabel
          className={"ThoughtLogger-field"}
          control={
            <Checkbox
              checked={this.state.newThought}
              onChange={() =>
                this.setState({ newThought: !this.state.newThought })
              }
              name="checkedB"
              color="primary"
            />
          }
          label="New Thought? (In this moment)"
        /> : null}
        {this.state.newThought == false && this.props.date === undefined ? (
          <TextField
            id="date"
            label="Date of Thought"
            type="date"
            onChange={(e) => {
              this.setState({
                mThought: this.state.mThought.setProperty(
                  "dateOfThought",
                  e.target.value
                ),
              });
            }}
            value={this.state.mThought.properties.dateOfThought.value}
            className={"ThoughtLogger-field"}
            InputLabelProps={{
              shrink: true,
            }}
          />
        ) : null}
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
        {chips}
          
      </div>
    );
  }
}

export default ManifestedThought;
