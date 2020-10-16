
import React, {Component} from 'react';
import "./ThoughtTracker.css";
import ManifestedPerception from "../../../components/ManifestedPerception/ManifestedPerception";
import TextField from "@material-ui/core/TextField";
import InquiryModel from "../../../models/GraphModel";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// Class Based React Component
class ThoughtTracker extends Component{
  constructor(props){
    super(props);
    console.log(props);

    let tracker = InquiryModel.getNewModelClass("Thought_Tracker");
    tracker.properties.date.setDefaultValue();
    console.log(tracker);
    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtTracker",
      tracker: tracker,
      time:undefined,
      timeRemaining:undefined,
      type:"Thought"
    };
  }

  resetTracker=()=>{
    let tracker = InquiryModel.getNewModelClass("Thought_Tracker");
    tracker.historic = this.state.tracker.historic;
    tracker.properties.date.value = this.state.tracker.properties.date.value;
    this.setState({
      tracker: tracker
    })
  }

  determineTrackerMode=()=>{
    let historic = this.state.tracker.historic;
    console.log(historic);
    if(historic!==true){
      this.beginTracker();
    }else {
      this.beginHistoricTracker();
    }
  }

  beginTracker=()=>{
    let tracker = this.state.tracker;
    tracker.properties.timestampOfStart.setDefaultValue();
    tracker.properties.date.setDefaultValue();
    tracker.properties.realtime.value = true;
    let duration = tracker.properties.duration.value;
    tracker.status = "inProgress";
    this.setState({
      timeRemaining:duration,
      tracker:tracker,
      count:0
    },()=>{
      let timer = setInterval(()=>{
        let timeRemaining = this.state.timeRemaining;
        if(timeRemaining<=0){
          clearInterval(timer);
          this.endTracker();
        }else{
          this.setState({
            timeRemaining:this.state.timeRemaining - 1,
            timer:timer
          })
        }
    },1000)

    })
  }

  beginHistoricTracker=()=>{
    let tracker = this.state.tracker;
    if(tracker.properties.timestampOfStart.value===undefined){
      let date = tracker.properties.date.value.split("-");
      let timestamp = new Date(date[0],date[1],date[2], "07", "30")
      tracker.properties.timestampOfStart.setValue(timestamp.getTime());
    }
    tracker.properties.realtime.setValue(false);
    tracker.status = "inProgress";
    this.setState({
      tracker:tracker
    })

  }

  endTracker=()=>{
    console.log("Tracker Ended");
    let tracker = this.state.tracker;
    if(tracker.historic ==true){
      let duration = tracker.properties.duration.value * 1000;
      let endTimestamp = tracker.properties.timestampOfStart.value+duration;
      tracker.properties.timestampOfEnd.setValue(endTimestamp);
    }else{
      tracker.properties.timestampOfEnd.setDefaultValue();
    }
    tracker.status = "review"
    console.log(tracker);
    tracker.generateCypherQuery()
      .then(res=>{
        console.log(res);
        this.resetTracker();
      })

  }

  submitThought=(aThought, mThought)=>{
    this.setState({
      tracker:this.state.tracker.addThought(aThought, mThought)
    })

  }

  submitHistoricThought=(aThought, mThought)=>{
    this.setState({
      tracker:this.state.tracker.addThought(aThought, mThought)
    })

  }

  setDuration=(e)=>{
    let value = parseInt(e.target.value);
    this.setState({
      tracker:this.state.tracker.setProperty('duration',value)
    })
  }

  setTimestampOfStart=(e)=>{
     let tracker = this.state.tracker;
      let time = e.target.value.split(":")
      let date = tracker.properties.date.value.split("-");
      let timestamp = new Date(date[0],date[1],date[2], time[0], time[1])
      tracker.properties.timestampOfStart.setValue(timestamp.getTime());
      this.setState({
        tracker:tracker
      })
    
  }

  finalInput=(value)=>{
    let tracker = this.state.tracker;
    tracker.finalInput = value;
    this.setState({
      tracker:tracker
    })
  }

  setHistoric=()=>{
    let tracker = this.state.tracker;
    let value = !this.state.tracker.historic;
    if(value==true){
      tracker.properties.date.value = undefined;
    }else{
      tracker.properties.date.setDefaultValue();
    }
    this.setState({ tracker:tracker.updateTrackerProperty('historic', value)})
  }


  render(){
    let duration = this.state.tracker.properties.duration.value;
    let status = this.state.tracker.status;
    let historic = this.state.tracker.historic;
    let checkReady = isNaN(duration) !== true && this.state.tracker.properties.date.value!==undefined ;
    return(
      <div className={this.state.classList}>
        {status === "setup" ? <div className={"ThoughtTracker-setupForm"}>
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
          {checkReady ? <Button
            color="primary"
            variant="contained"
            className={"ThoughtLogger-field"}
            label="Hello"
            onClick={this.determineTrackerMode}
          >Begin Tracker
          </Button> : null}
        </div> : null}
        { status === "inProgress" && historic == true ? <div className="ThoughtTracker-inProgress">
            {this.state.timeRemaining}
            <Button
            color="primary"
            variant="contained"
            className={"ThoughtLogger-field"}
            label="Hello"
            onClick={this.endTracker}
          >End Tracker
          </Button>
            <ManifestedPerception
              label={this.state.type}
              queryKey="perception"
              date={this.state.tracker.properties.date.value} 
              submitPerception={this.submitThought}/>
        </div>: null}
        { status === "inProgress" && historic!==true ? <div className="ThoughtTracker-inProgress">
            
            <ManifestedPerception 
              label={this.state.type} 
              queryKey="perception" 
              submitPerception={this.submitThought} 
              finalInput={this.getFinalInput}/>

        </div>: null}
        {status === "review" ? <div className="ThoughtTracker-Review">

        </div> : null}
        {status=="review" ? <ul>
          {this.state.tracker.thoughts.map(val=>{
            return <li>
              {val[1].properties.dateOfThought.value},
              {val[0].variable}
              </li>
          })}
        </ul> : null}
      </div>
    );
  }
}

export default ThoughtTracker;
