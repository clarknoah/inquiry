import React, { Component } from "react";
import "./ManifestedPerception.css";
import api from "../../services/api";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InquiryModel from "../../models/GraphModel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class ManifestedPerception extends Component {
  constructor(props) {
    super(props);
    let newPerception = true;
    let mPerception = InquiryModel.getNewModelClass(`M_${props.label}`);
    console.log(props);
    mPerception.properties[props.queryKey].value = "";
    if(props.date!==undefined){
      mPerception.setProperty("dateOfPerception", props.date);
      newPerception = false;
    }
    this.inputRef = React.createRef();

    this.state = {
      classList: `ManifestedPerception ${props.className}`,
      abstractPerceptions: [],
      mPerception: mPerception,
      newPerception: newPerception,
      label: props.label,
      queryKey:props.queryKey
    };
  }


  resetForm = () => {
    let mPerception = InquiryModel.getNewModelClass(`M_${this.props.label}`);
    console.log(mPerception);
    mPerception.properties[this.props.queryKey].value = "";
    if(this.state.newPerception == false){
      mPerception.properties.dateOfPerception.setValue(this.state.mPerception.properties.dateOfPerception.value)
    }
    if(this.props.date!==undefined){
      mPerception.setProperty("dateOfPerception", this.props.date);
    }
    this.setState({
      classList: "ManifestedPerception",
      abstractPerceptions: [],
      mPerception: mPerception,
      newPerception: this.state.newPerception,
      label:this.props.label,
      queryKey:this.props.queryKey
    },()=>{
      this.inputRef.current.focus();
    });
  };

  switchLabel=(text)=>{
    let label;
    if(text==="-T"){
      label = "Thought"
    }else if(text==="-I"){
      label = "Mental_Image"
    }else if(text=="-E"){
      label = "Emotion"
    }else if(text=="-B"){
      label = "Body_Sensation"
    }else if(text=="-P"){
      label = "Perception"
    }

    if(label!==undefined){
      let mPerception = InquiryModel.getNewModelClass(`M_${label}`);
      mPerception.properties.perception.value="";
      if(this.state.newPerception == false){
        mPerception.properties.dateOfPerception.setValue(this.state.mPerception.properties.dateOfPerception.value)
      }
      if(this.props.date!==undefined){
        mPerception.setProperty("dateOfPerception", this.props.date);
      }
      this.setState({
        classList: "ManifestedPerception",
        abstractPerceptions: [],
        mPerception: mPerception,
        newPerception: this.state.newPerception,
        label:label,
        queryKey:this.props.queryKey
      },()=>{
        this.inputRef.current.focus();
      });
    }
  }


  onChange = (evt) => {
    let text = evt.target.value;
    let switchLabel = text[0] == "-" && text.length === 2;
    let mPerception = this.state.mPerception;
    if(switchLabel){
      this.switchLabel(text);
    }else if (text.length === 1 && this.state.newPerception == true) {
      mPerception.setNewPerceptionTimes(this.props.date);
    } else if((text.length === 1 && this.state.newPerception == false) 
      || (text.length === 1 && this.state.newPerception == false && this.props.date!==undefined)) {
      mPerception.setExistingPerceptionTimes(mPerception.properties.dateOfPerception.value);
    }
    if (text.length > 0 && switchLabel==false) {
      api.nodeListQuery(`A_${this.state.label}`, this.state.queryKey, text).then((res) => {
       // console.log(res);
        this.setState({
          abstractPerceptions: res,
          mPerception: this.state.mPerception.setProperty(this.state.queryKey, text),
        });
      });
    } else if(switchLabel==false) {
      this.setState({
        abstractPerceptions: [],
        mPerception: mPerception.setProperty(this.state.queryKey, text),
      });
    }
  };

  selectNewPerception = () => {
    let mPerception = this.state.mPerception;
    mPerception.setInputDuration();
    let aPerception = InquiryModel.getNewModelClass(`A_${this.state.label}`);
    aPerception.setMatchingProperties(mPerception);
    this.submitPerception(aPerception, mPerception);
  };


  selectExistingPerception = (perception) => {
    let mPerception = this.state.mPerception;
    mPerception.setInputDuration();
    console.log(perception);
    let aPerception = InquiryModel.getExistingModelClass(
      perception.labels[0],
      perception.identity,
      perception.properties
    );
    mPerception.setProperty(this.state.queryKey, aPerception.properties[this.props.queryKey].value);
    this.submitPerception(aPerception, mPerception);
  };

  submitPerception = (aPerception, mPerception) => {
    console.log(this.props);
    if(mPerception.properties.perception.value.length > 0){
      this.props.submitPerception(aPerception, mPerception);
      this.resetForm();
    }else{
      console.log("Empty thought...hahah")
    }
  };

  comparePerceptionString = () => {
    let same =
      this.state.abstractPerceptions.filter((val) => {
        val = val.name.toLowerCase().trim();
        let perception = this.state.mPerception.properties[this.state.queryKey].value.toLowerCase().trim();
        return val === perception;
      }).length == 0;
    if (same) {
      return (
        <Button
        className={"ThoughtLogger-field"}
          variant="contained"
          label="Hello"
          onClick={this.selectNewPerception}
        >
          Submit New Perception
        </Button>
      );
    }
  };

  componentDidUpdate(props){
    if(this.props.label!==props.label){
      this.resetForm();
    }
  }

  componentDidMount(){
    console.log("Mounted");
  }

  render() {
    let chips = this.state.abstractPerceptions.map((val, index) => {
      return (
        <React.Fragment>
          <Button
            color="primary"
            variant="contained"
            label="Hello"
            onClick={() => {
              this.selectExistingPerception(val);
            }}
          >
            {val.name}
          </Button>
        </React.Fragment>
      );
    });
    return (
      <div className={this.state.classList} style={this.props.style}>
        {this.props.date === undefined ?<FormControlLabel
          control={
            <Checkbox
              checked={this.state.newPerception}
              onChange={() =>
                this.setState({ newPerception: !this.state.newPerception })
              }
              name="checkedB"
              color="primary"
            />
          }
          label={`New ${this.state.label}? (In this moment)`}
        /> : null}
        {this.state.newPerception == false && this.props.date === undefined ? (
          <TextField
            id="date"
            label="Date of Perception"
            type="date"
            onChange={(e) => {
              this.setState({
                mPerception: this.state.mPerception.setProperty(
                  "dateOfPerception",
                  e.target.value
                ),
              });
            }}
            value={this.state.mPerception.properties.dateOfPerception.value}

            InputLabelProps={{
              shrink: true,
            }}
          />
        ) : null}
        <TextField
          id="outlined-multiline-static"
          label={this.state.label}
          inputRef={this.inputRef}
          multiline

          rows={4}
          placeholder={`Type in ${this.state.label}`}
          variant="outlined"
          value={this.state.mPerception.properties[this.state.queryKey].value}
          onChange={this.onChange}
        />
        {this.comparePerceptionString()}
        {chips}
          
      </div>
    );
  }
}

export default ManifestedPerception;
