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
    // console.log(props);
    mPerception.properties[props.queryKey].value = "";
    if (props.date !== undefined) {
      mPerception.setProperty("dateOfPerception", props.date);
      newPerception = false;
    }
    this.inputRef = React.createRef();

    this.state = {
      classList: `ManifestedPerception ${props.className}`,
      text:"",
      abstractPerceptions: [],
      mPerception: mPerception,
      newPerception: newPerception,
      label: props.label,
      queryKey: props.queryKey,
      hideNewThought: false
    };
    if (props.hideNewThought) {
      this.state.hideNewThought = true;
    }
  }


  resetForm = () => {
    console.log("reset");
    let mPerception = InquiryModel.getNewModelClass(`M_${this.props.label}`);
    //// console.log(mPerception);
    mPerception.properties[this.props.queryKey].value = "";
    if (this.state.newPerception == false) {
      mPerception.properties.dateOfPerception.setValue(this.state.mPerception.properties.dateOfPerception.value)
    }
    if (this.props.date !== undefined) {
      mPerception.setProperty("dateOfPerception", this.props.date);
    }
    this.setState({
      text:"",
      textz:"",
      classList: "ManifestedPerception",
      abstractPerceptions: [],
      mPerception: mPerception,
      newPerception: this.state.newPerception,
      label: this.props.label,
      queryKey: this.props.queryKey
    }, () => {
      this.focus();
    });
  };

  focus = () => {
    this.inputRef.current.focus()
  }

  switchLabel = (text) => {
    let label;
    if (text === "-T") {
      label = "Thought"
    } else if (text === "-I") {
      label = "Mental_Image"
    } else if (text == "-E") {
      label = "Emotion"
    } else if (text == "-B") {
      label = "Body_Sensation"
    } else if (text == "-P") {
      label = "Perception"
    }

    if (label !== undefined) {
      let mPerception = InquiryModel.getNewModelClass(`M_${label}`);
      mPerception.properties.perception.value = "";
      if (this.state.newPerception == false) {
        mPerception.properties.dateOfPerception.setValue(this.state.mPerception.properties.dateOfPerception.value)
      }
      if (this.props.date !== undefined) {
        mPerception.setProperty("dateOfPerception", this.props.date);
      }
      this.setState({
        classList: "ManifestedPerception",
        abstractPerceptions: [],
        mPerception: mPerception,
        newPerception: this.state.newPerception,
        label: label,
        queryKey: this.props.queryKey
      }, () => {
        this.inputRef.current.focus();
      });
    }
  }

  isHedonicChar = (char) =>{
    // console.log("Is called");
    let charMap = {
      "1":true,
      "2":true,
      "3":true
    };
    let hedonicChar = !!charMap[char];
    let firstChar = char.length === 1;
    // console.log(hedonicChar, firstChar);
    if(hedonicChar && firstChar){
      return true;
    }
    return false;
  }

  getHedonicName = (char) => {
    if (char === "1") {
      return "negative";
    }else if(char === "2"){
      return "neutral";
    }else if(char === "3"){
      return "positive";
    }
  }

  onChange = (evt) => {
    let text = evt.target.value;
    let lastChar;
    if(text.length){
      lastChar = text[text.length-1];
    }
    console.log(lastChar);
    let switchLabel = text[0] == "-" && text.length === 2;
    let mPerception = this.state.mPerception;
    let hedonicSet = mPerception.properties["hedonicAffect"].value !== 'unassigned';
    if(lastChar && this.isHedonicChar(lastChar)){
      console.log("hedonic", lastChar);
        mPerception.setProperty("hedonicAffect", this.getHedonicName(lastChar));
        text = text.slice(0, text.length-1);

    }
    let noText = mPerception.properties[this.state.queryKey].value.length === 0;
    let assignTimes = text.length > 0 && noText;
    if (switchLabel) {
      this.switchLabel(text);
    } else if (assignTimes && this.state.newPerception == true) {
      mPerception.setNewPerceptionTimes(this.props.date);
    } else if ((assignTimes && this.state.newPerception == false)
      || (assignTimes && this.state.newPerception == false && this.props.date !== undefined)) {
      mPerception.setExistingPerceptionTimes(mPerception.properties.dateOfPerception.value);
    }
    if (text.length > 0 && switchLabel == false) {
      api.nodeListQuery(`A_${this.state.label}`, this.state.queryKey, text).then((res) => {
        // // console.log(res);
        this.setState({
          text:text,
          abstractPerceptions: res,
          mPerception: this.state.mPerception.setProperty(this.state.queryKey, text),
        });
      });
    } else if (switchLabel == false) {
      this.setState({
        text:text,
        abstractPerceptions: [],
        mPerception: mPerception.setProperty(this.state.queryKey, text),
      });
    }
  };

  textOnChange=(evt)=>{
    let text = evt.target.value;
    this.setState({textz: text})
  }

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
    // console.log(perception);
    let aPerception = InquiryModel.getExistingModelClass(
      perception.labels[0],
      perception.identity,
      perception.properties
    );
    mPerception.setProperty(this.state.queryKey, aPerception.properties[this.props.queryKey].value);
    this.submitPerception(aPerception, mPerception);
  };

  submitPerception = (aPerception, mPerception) => {
    // console.log(this.props);
    if (mPerception.properties.perception.value.length > 0) {
      this.props.submitPerception(aPerception, mPerception);
      this.resetForm();
    } else {
      // console.log("Empty thought...hahah")
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

  componentDidUpdate(props) {
    if (this.props.label !== props.label) {
      this.resetForm();
    }

    if (this.props.focus) {
      this.focus();
    }
  }

  componentDidMount() {
    // console.log("Mounted");
    if (this.props.focus) {
      this.focus();
    }
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
              // console.log(val);
              this.selectExistingPerception(val);
            }}
          >
            {val.name}
          </Button>
        </React.Fragment>
      );
    });
    console.log(this.state.textz);
    return (
      <div className={this.state.classList} style={this.props.style}>
        {"Affect:  " + this.state.mPerception.properties.hedonicAffect.value}
        {/* {this.props.date === undefined && this.props.hideNewThought !== true ? <FormControlLabel
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
        /> : null} */}
        {/* {this.state.newPerception == false && this.props.date === undefined ? (
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
        ) : null} */}
        <div style={{margin:"20px 0 5px 0"}}>

        <TextField
          id="outlined-multiline-static"
          label={this.state.label}
          inputRef={this.inputRef}
          multiline
          
          rows={4}
          placeholder={`Type in ${this.state.label}`}
          variant="outlined"
          value={this.state.text}
          onChange={this.onChange}
          />
          </div>

        {this.comparePerceptionString()}
        {chips}

      </div>
    );
  }
}

export default ManifestedPerception;
