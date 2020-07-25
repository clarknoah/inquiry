import React, { Component } from "react";
import "./InquiryForm.css";
import api from "../../services/api";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ReactJson from "react-json-view";

import ManifestedThought from "../ManifestedThought/ManifestedThought";
import ManifestedDesire from "../ManifestedDesire/ManifestedDesire";
import FullBelief from "../FullBelief/FullBelief";
import UnderlyingBeliefs from "../UnderlyingBeliefs/UnderlyingBeliefs";
import Acceptance from '../Acceptance/Acceptance';
import Truth from "../Truth/Truth";
import WhenBelieved from "../WhenBelieved/WhenBelieved";
import WhenNotBelieved from "../WhenNotBelieved/WhenNotBelieved";
import Turnarounds from "../Turnarounds/Turnarounds";
import CanLetGo from "../CanLetGo/CanLetGo";
import WillLetGo from "../WillLetGo/WillLetGo";
import WhenLetGo from "../WhenLetGo/WhenLetGo";



function doQuery() {
  api.nodeListQuery("Abstract_Thought", "thought", "I ").then((res) => {
    console.log(res);
  });
}

function getSteps() {
  return [
    "Input Thought",
    "Associated Desire/Fear",
    "Full Belief Thought",
    "Underlying Beliefs",
    "Acceptance",
    "Is it true?",
    "When believed",
    "When not believed",
    "Turnarounds",
    "Let go",
    "Would I let go",
    "When?"
  ];
}

class InquiryForm extends Component {
  constructor() {
    super();
    this.steps = getSteps();
    this.state = {
      activeStep:5,
      inquiry:{},
      manifestedDesire:null,
      manifestedThought:{
        properties:{}
      },
      whenBelieved:{
        perceptions:[],
        thoughts:[],
        emotions:[],
        bodySensations:[]
      },
      whenNotBelieved:{
        perceptions:[],
        thoughts:[],
        emotions:[],
        bodySenations:[]
      },
      turnarounds:[]
    };
  }
   handleNext = () => {
     this.setState({
       activeStep:this.state.activeStep + 1
     })
  };

   handleBack = () => {
    this.setState({
      activeStep:this.state.activeStep -1
    })
  };

   handleReset = () => {
    this.setState({
      activeStep:0
    })
  };

  getStepContent=(stepIndex)=>{
    switch (stepIndex) {
      case 0:
        return <ManifestedThought submitThought={this.receiveManifestedThought}/>;
      case 1:
        return <ManifestedDesire submitDesire={this.receiveManifestedDesire}/>;
      case 2:
        return <FullBelief submitFullBelief={this.receiveFullBelief}/>;
      case 3:
        return <UnderlyingBeliefs submitUnderlyingBeliefs={this.receiveUnderlyingBeliefs}/>;
      case 4:
        return <Acceptance submitAcceptance={this.receiveAcceptance}/>;
      case 5:
        return <Truth submitTruth={this.receiveTruth}/>;
      case 6:
        return <WhenBelieved submitWhenBelieved={this.receiveWhenBelieved}/>;
      case 7:
        return <WhenNotBelieved submitWhenNotBelieved={this.receiveWhenNotBelieved}/>;
      case 8:
        return <Turnarounds submitTurnarounds={this.receiveTurnarounds}/>;
      case 9:
        return <CanLetGo submitCanLetGo={this.receiveCanLetGo}/>;
      case 10:
        return <WillLetGo submitX={this.receiveWillLetGo}/>;
      case 11:
        return <WhenLetGo submitWhenLetGo={this.receiveWhenLetGo}/>;
      default:
        return "Unknown stepIndex";
    }
  }

  receiveManifestedThought=(thought)=>{
    console.log("Selected Thought: ", thought);
    this.state.manifestedThought = thought;
    this.setState({
      manifestedThought:thought
    },()=>{
      this.handleNext();
    })
  }

  receiveManifestedDesire=(desire)=>{
    console.log("Selected Desire: ", desire);
    let thought = this.state.manifestedThought;
    thought.desire = desire;
    this.setState({
      manifestedThought:thought
    },()=>{
      this.handleNext();
    })
  }


  receiveFullBelief=(belief)=>{
    console.log("Full Belief: ", belief);
    let thought = this.state.manifestedThought;
    thought.properties.fullBelief = thought;
    this.setState({
      manifestedThouht: thought
    },()=>{
      this.handleNext();
    })

  }
  receiveUnderlyingBeliefs=(beliefs)=>{
    console.log("Underlying Beliefs: ",beliefs);
  }
  receiveAcceptance=(accept)=>{
    console.log("Acceptance: ",accept);
  }

  receiveTruth=(isTrue)=>{
    console.log("Truth: ",isTrue);
    this.handleNext();
  }
  receiveWhenBelieve=(payload)=>{

  }
  receiveWhenNotBelieved=(payload)=>{}
  receiveTurnarounds=(payload)=>{}
  receiveCanLetGo=(payload)=>{}
  receiveWillLetGo=(payload)=>{}
  receiveWhenLetGo=(payload)=>{}



  render() {
    return (
      <div className="InquiryForm">
        <div className={"stepper-root"}>

          <Stepper activeStep={this.state.activeStep} alternativeLabel>
            {this.steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {this.state.activeStep === this.steps.length ? (
              <div>
                <Typography >
                  All steps completed
                </Typography>
                <Button onClick={this.handleReset}>Reset</Button>
              </div>
            ) : (
              <div>
                <Typography >
                  {this.getStepContent(this.state.activeStep)}
                </Typography>
                <div>
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={this.handleBack}
                    variant="contained"
                    className="stepper-buttons"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="stepper-buttons"
                    onClick={this.handleNext}
                  >
                    {this.state.activeStep === this.steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Button variant="contained" label="Submit" onClick={doQuery}>
          Submit
        </Button>
        <div className={"show-json"}>
        <ReactJson src={this.state}/>
        </div>
      </div>
    );
  }
}
export default InquiryForm;
