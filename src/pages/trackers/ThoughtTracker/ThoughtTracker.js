import React, { Component } from "react";
import "./ThoughtTracker.css";
import ManifestedPerception from "../../../components/ManifestedPerception/ManifestedPerception";
import TextField from "@material-ui/core/TextField";
import InquiryModel from "../../../models/GraphModel";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import NodeEditor from "../../../components/NodeEditor/NodeEditor";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Countdown from "react-countdown";
// Class Based React Component
class ThoughtTracker extends Component {
  constructor(props) {
    super(props);
    // console.log(props);

    let tracker = InquiryModel.getNewModelClass("Thought_Tracker");
    tracker.properties.date.setDefaultValue();
    // console.log(tracker);
    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtTracker",
      tracker: tracker,
      time: undefined,
      timeRemaining: undefined,
      type: "Thought",
      query: undefined,
      trackerSubmitted: false,
      displayCountDown: false,
      countdown: 600
    };
  }

  resetTracker = () => {
    let tracker = InquiryModel.getNewModelClass("Thought_Tracker");
    tracker.historic = this.state.tracker.historic;
    tracker.properties.date.value = this.state.tracker.properties.date.value;
    this.setState({
      tracker: tracker,
      query: undefined,
      trackerSubmitted: false,
    });
  };

  determineTrackerMode = () => {
    let historic = this.state.tracker.historic;
    // console.log(historic);
    if (historic !== true) {
      this.beginTracker();
    } else {
      this.beginHistoricTracker();
    }
  };

  beginTracker = () => {
    let tracker = this.state.tracker;
    tracker.properties.timestampOfStart.setDefaultValue();
    tracker.properties.date.setDefaultValue();
    tracker.properties.realtime.value = true;
    let duration = tracker.properties.duration.value;
    tracker.status = "inProgress";
    this.setState(
      {
        timeRemaining: duration,
        tracker: tracker,
        count: 0,
      },
      () => {
        let timer = setInterval(() => {
          let timeRemaining = this.state.timeRemaining;
          if (timeRemaining <= 0) {
            clearInterval(timer);
            this.endTracker();
          } else {
            this.setState({
              timeRemaining: this.state.timeRemaining - 1,
              timer: timer,
            });
          }
        }, 1000);
      }
    );
  };

  beginHistoricTracker = () => {
    let tracker = this.state.tracker;
    if (tracker.properties.timestampOfStart.value === undefined) {
      let date = tracker.properties.date.value.split("-");
      let timestamp = new Date(date[0], (parseInt(date[1])-1), date[2], "07", "30");
      tracker.properties.timestampOfStart.setValue(timestamp.getTime());
    }
    tracker.properties.realtime.setValue(false);
    tracker.status = "inProgress";
    this.setState({
      tracker: tracker,
    });
  };

  endTracker = () => {
    // console.log("Tracker Ended");
    let tracker = this.state.tracker;
    if (tracker.historic == true) {
      let duration = tracker.properties.duration.value * 1000;
      let endTimestamp = tracker.properties.timestampOfStart.value + duration;
      tracker.properties.timestampOfEnd.setValue(endTimestamp);
    } else {
      tracker.properties.timestampOfEnd.setDefaultValue();
    }
    tracker.status = "review";
    // console.log(tracker);
    //tracker.generateCypherQuery();
    this.setState({
      tracker: tracker,
    });
  };
  submitTracker = () => {
    let tracker = this.state.tracker;
    tracker.generateCypherQuery();
    // console.log(tracker.query);
    tracker.submitTracker().then((res) => {
      this.setState({
        trackerSubmitted:true
      });
    });
  };

  submitThought = (aThought, mThought) => {
    this.setState({
      tracker: this.state.tracker.addThought(aThought, mThought),
    });
  };

  submitHistoricThought = (aThought, mThought) => {
    // console.log("Historic");
    if(aThought.exists!==true){
      aThought.properties.timestampOfPerception.value = this.state.tracker.properties.timestampOfStart.value+1;
    }
    mThought.properties.timestampOfPerception.value = this.state.tracker.properties.timestampOfStart.value+1;

    this.setState({
      tracker: this.state.tracker.addThought(aThought, mThought),
    });
  };

  setDuration = (e) => {
    let value = parseInt(e.target.value);
    this.setState({
      tracker: this.state.tracker.setProperty("duration", value),
    });
  };

  setTimestampOfStart = (e) => {
    let tracker = this.state.tracker;
    let time = e.target.value.split(":");
    let date = tracker.properties.date.value.split("-");
    let timestamp = new Date(date[0], (parseInt(date[1])-1), date[2], time[0], time[1]);
    tracker.properties.timestampOfStart.setValue(timestamp.getTime());
    this.setState({
      tracker: tracker,
    });
  };

  finalInput = (value) => {
    let tracker = this.state.tracker;
    tracker.finalInput = value;
    this.setState({
      tracker: tracker,
    });
  };

  getNodeEditors=()=>{
    // console.log(this.state.tracker.thoughts);
    let editProps = {
      hedonicAffect:true
    }
    // console.log(this.state.tracker.thoughts);
    let  editors = this.state.tracker.thoughts.map((perception, key)=>{
      let node = perception[0];
      node.properties.hideProperties();
      node.properties.hedonicAffect.edittable = true;
      let header = "("+node.labels.join(":")+"): "+node.properties.perception.value;
      return <NodeEditor header={header} key={key} node={node} update={(node)=>{
        this.editNode(node,key)
      }}/>
    })
    return editors;
  }

  editNode=(node,key)=>{
    let tracker = this.state.tracker;
    tracker.thoughts.forEach((nodes,index)=>{
      if(nodes[0].variable == node.variable){
        tracker.thoughts[index][0].properties.hedonicAffect = node.properties.hedonicAffect;
        // console.log(tracker.thoughts[index][0]);
        tracker.cypherQuery.updateParams(node);
      }
    })
    //tracker.thoughts[key][0] = node;
    this.setState({
      tracker:tracker
    })
  }

  updateType =(e)=>{
    // console.log(e.target.value);
    let trackerType = e.target.value;
    let tracker = this.state.tracker;
    let type = trackerType === "passiveEmotion" ? "Emotion" : "Thought";
    tracker.properties.trackerType.setValue(e.target.value);
    this.setState({tracker, type});
  }

  setHistoric = () => {
    let tracker = this.state.tracker;
    let value = !this.state.tracker.historic;
    if (value == true) {
      //tracker.properties.date.value = undefined;
    } else {
      tracker.properties.date.setDefaultValue();
    }
    this.setState({
      tracker: tracker.updateTrackerProperty("historic", value),
    });
  };

  render() {
    let { setState, state } = this;
    let { tracker, timeRemaining, countdown, showCountdown} = state;
    let duration = tracker.properties.duration.value;
    let {status, historic} = tracker;

    let checkReady =
      isNaN(duration) !== true &&
      this.state.tracker.properties.date.value !== undefined;

    return (
      <div className={this.state.classList}>
        {status === "setup" ? (
          <div className={"ThoughtTracker-setupForm"}>
            <FormControlLabel
              className={"ThoughtLogger-field"}
              control={
                <Checkbox
                  checked={showCountdown}
                  onChange={e=>this.setState({showCountdown:!showCountdown})}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Show Countdown?"
            />
            {showCountdown ? (                
            <TextField
                  id="date"
                  label="Countdown Display"
                  type="number"
                  onChange={(e) =>this.setState({countdown: e.target.value}) }
                  value={countdown}
                  className={"ThoughtLogger-field"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />) : null}
            <FormControlLabel
              className={"ThoughtLogger-field"}
              control={
                <Checkbox
                  checked={this.state.tracker.historic}
                  onChange={this.setHistoric}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Historic Tracker"
            />
            {this.state.tracker.historic == true ? (
              <div>
                <TextField
                  id="date"
                  label="Date of Entry"
                  type="date"
                  onChange={(e) => {
                    this.setState({
                      tracker: this.state.tracker.setProperty(
                        "date",
                        e.target.value
                      ),
                    });
                  }}
                  value={this.state.tracker.properties.date.value}
                  className={"ThoughtLogger-field"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="time"
                  label="Alarm clock"
                  type="time"
                  defaultValue="07:30"
                  onChange={this.setTimestampOfStart}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </div>
            ) : null}
                  <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">Tracker Type</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={this.state.tracker.properties.trackerType.value}
          onChange={this.updateType}
          label="Tracker Type"
        >
          {this.state.tracker.properties.trackerType.meta.enum.map(val=>{
            return <MenuItem value={val}>{val}</MenuItem>
          })}
        </Select>
      </FormControl>
            <TextField
              label="Please Select Duration"
              type="number"
              inputRef={this.inputRef}
              className={"ThoughtLogger-field"}
              placeholder="Duration (In Seconds)"
              variant="outlined"
              value={duration}
              onChange={this.setDuration}
            />
            {checkReady ? (
              <Button
                color="primary"
                variant="contained"
                className={"ThoughtLogger-field"}
                label="Hello"
                onClick={this.determineTrackerMode}
              >
                Begin Tracker
              </Button>
            ) : null}
          </div>
        ) : null}
        {status === "inProgress" && historic == true ? (
          <div className="ThoughtTracker-inProgress">
            {this.state.timeRemaining}
            <Button
              color="primary"
              variant="contained"
              className={"ThoughtLogger-field"}
              label="Hello"
              onClick={this.endTracker}
            >
              End Tracker
            </Button>
            <ManifestedPerception
              label={this.state.type}
              queryKey="perception"
              date={this.state.tracker.properties.date.value}
              submitPerception={this.submitHistoricThought}
            />
          </div>
        ) : null}
        {status === "inProgress" && historic !== true ? (
          <>
         { timeRemaining <= countdown ? <div>{this.state.timeRemaining}</div> : null}
          <div className="ThoughtTracker-inProgress">
            <ManifestedPerception
              label={this.state.type}
              queryKey="perception"
              submitPerception={this.submitThought}
              finalInput={this.getFinalInput}
            />
          </div>
          </>
        ) : null}
        {status === "review" ? (
          <div className="ThoughtTracker-Review"></div>
        ) : null}
        {status == "review" ? (
          <div>
                        {this.state.trackerSubmitted === false ? (
              <button onClick={this.submitTracker}>Submit</button>
            ) : (
              <button onClick={this.resetTracker}>Reset</button>
            )}
            {/* <pre>{this.state.tracker.query.query}</pre> */}
              <div>
                {this.getNodeEditors()}
              </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ThoughtTracker;
