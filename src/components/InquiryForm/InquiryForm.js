import React, { Component } from "react";
import "./InquiryForm.css";
import api from "../../services/api";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import ManifestedPerception from "../ManifestedPerception/ManifestedPerception";
import FullBelief from "../FullBelief/FullBelief";
import UnderlyingBeliefs from "../UnderlyingBeliefs/UnderlyingBeliefs";
import Acceptance from "../Acceptance/Acceptance";
import Truth from "../Truth/Truth";
import WhenBelieved from "../WhenBelieved/WhenBelieved";
import WhenNotBelieved from "../WhenNotBelieved/WhenNotBelieved";
import Turnarounds from "../Turnarounds/Turnarounds";
import CanLetGo from "../CanLetGo/CanLetGo";
import WillLetGo from "../WillLetGo/WillLetGo";
import WhenLetGo from "../WhenLetGo/WhenLetGo";
import PerceptionCollector from "../PerceptionCollector/PerceptionCollector";
import PerceptionsCollector from "../PerceptionsCollector/PerceptionsCollector";
import InquiryModel from "../../models/GraphModel";
import Divider from "@material-ui/core/Divider";
/*
    This class needs to perform the following tasks. 

    1:  Accept a thought as the thought to be inquired into 
    2:  Have a function which can be called to set the inquired thought 
        to either a true or false 

    3:  Have a function which can be called to set the inquired thought 
        of certainly true to either true or false 
    
    4:  Have a component that handles the is it true section 
    
    4:  Have a PerceptionCollector for desires 
    5:  Have a PerceptionCollector for fears 
    6:  Have a PerceptionsCollector for When Believed True
        Also ensure I can import text for the perceptions collector

    7:  Have a way to have Body Sensations and Emotions contain a list
        of associated perceptions 
    8:  Have a way to collector memories (Maybe passing in an "extraLabels"
        prop into manifestedPerception 
    
    9:  Create class for managing how I treat questions 
    10: To do turn arounds, I'm going to use a PerceptionCollector,
        which will collect the perceptions we want to do turn arounds
        for. 

        I'll also be using an PerceptionsCollector, which will
        contain a list of the thoughts
*/

function getSteps() {
  return [
    "Thought to Inquire Into",
    "Is it true?",
    "Associated Desires (Optional)",
    "Associated Fears (Optional)",
    "Full Belief Thought (Optional)",
    "When Believed True",
    "When Not Believed True",
    "Turnarounds",
    "Let go",
  ];
}

let stepsCompleted = {
  inquiryThought: false,
};

class InquiryForm extends Component {
  constructor() {
    super();
    this.steps = getSteps();
    this.state = {
      activeStep: 8,
      inquiry: InquiryModel.getNewModelClass("Inquiry_Session"),
      manifestedDesire: null,
      manifestedThought: {
        properties: {},
      },
      letGo:undefined,
      whenBelieved: {
        Perception: [],
        Thought: [],
        Emotion: [],
        Body_Sensation: [],
        Mental_Image: [],
      },
      whenNotBelieved: {
        Perception: [],
        Thought: [],
        Emotion: [],
        Body_Sensation: [],
        Mental_Image: [],
      },
    };
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div style={{width:"100%"}}>

            <ManifestedPerception
              label={"Thought"}
              queryKey="perception"
              submitPerception={this.submitThoughtForInquiry}
            />

          </div>
        );
      case 1:
        return (
          <Truth memory={this.state.truth} submitTruth={this.receiveTruth}/>
        );
      case 2:
        let getCollector= ()=>{
          return (<PerceptionCollector
            label={"Thought"}
            queryKey={"perception"}
            date={"2020-10-15"}
            unique
            list={this.state.inquiry.desires}
            updateList={this.updateDesires}
          />)
        }
        return getCollector();
        case 3:
          return (
            <div style={{width:"100%"}}>
            <PerceptionCollector
              label={"Thought"}
              queryKey={"perception"}
              date={"2020-10-15"}
              unique
              list={this.state.inquiry.fears}
              updateList={this.updateFears}
            />
            </div>
          );
      case 4:
        return (
          <div style={{width:"100%"}}>
          <ManifestedPerception
            label={"Thought"}
            queryKey="perception"
            date={"2020-10-15"}
            submitPerception={this.receiveFullBelief}
          />
          </div>
        );
      case 5:
        return (
          <div style={{ width: "100%" }}>
            <PerceptionsCollector
              labels={[
                "Thought",
                "Emotion",
                "Body_Sensation",
                "Mental_Image",
                "Perception",
              ]}
              text={[
                "What other verbal thoughts arise in relationship to this thought?",
                "What emotions arise in relationship to this thought?",
                "What sensations in the body arise in relationship to this thought?",
                "What memories arise in relationship to this this thought?",
                "How do you react/behave when you believe this thought is true?",
              ]}
              queryKeys={[
                "perception",
                "perception",
                "perception",
                "perception",
                "perception",
              ]}
              date={"2020-10-15"}
              list={this.state.whenBelieved}
              unique
              header={"When you believe this thought is true..."}
              updateLists={this.updateWhenBelievedTruePerceptionList}
            />
          </div>
        );
      case 6:
        return (
          <PerceptionsCollector
            labels={[
              "Perception",
              "Thought",
              "Emotion",
              "Body_Sensation",
              "Mental_Image",
            ]}
            text={[
              "Who would you be/how would you see life without this thought?",
              "What thoughts arise (if any) when imagining life without this thought?",
              "What emotions arise (if any) when imagining life without this thought?",
              "What bodily sensations arise (if any) when imagining life without this thought?",
              "What mental images arise (if any) when imagining life without this thought?",
            ]}
            queryKeys={[
              "perception",
              "perception",
              "perception",
              "perception",
              "perception",
            ]}
            date={"2020-10-15"}
            list={this.state.whenNotBelieved}
            unique
            header={
              "Who would you be if you didn't believe nor could even experience this thought?"
            }
            updateLists={this.updateWhenBelievedNotTruePerceptionList}
          />
        );
      case 7:
        return (
          <div
            style={{ width: "100%", height:"100%", display: "flex", flexDirection: "column" }}
          >
            <PerceptionCollector
              label={"Thought"}
              queryKey={"perception"}
              date={"2020-10-15"}
              unique
              list={this.state.inquiry.turnarounds}
              updateList={this.updateTurnAroundsList}
            />
            <Divider />
            {this.state.inquiry.turnarounds.map((turnaround, index) => {
              console.log(turnaround);
              return (
                <PerceptionsCollector
                  labels={[
                    "Perception",
                    "Thought",
                    "Emotion",
                    "Body_Sensation",
                    "Mental_Image",
                  ]}
                  text={[
                    "What are some real world examples where this thought has been true?",
                    "What thoughts arise (if any) in association with this thought?",
                    "What emotions arise (if any) in association with this thought?",
                    "What bodily sensations arise (if any) in association with this thought?",
                    "What mental images arise (if any) in association with this thought",
                  ]}
                  queryKeys={[
                    "perception",
                    "perception",
                    "perception",
                    "perception",
                    "perception",
                  ]}
                  date={"2020-10-15"}
                  list={turnaround[2]}
                  unique
                  header={
                    "Who would you be if you didn't believe nor could even experience this thought?"
                  }
                  updateLists={(list, label) => {
                    this.updateTurnaroundExample(list, index);
                  }}
                />
              );
            })}
          </div>
        );
      case 8:
        return (
          <CanLetGo data={this.state.letGo} submit={this.receiveCanLetGo} />
        );
      case 9:
        return <WillLetGo submit={this.receiveWillLetGo} />;
      case 10:
        return <CanLetGo submit={this.receiveCanLetGo} />;
      case 11:
        return <WhenLetGo submit={this.receiveWhenLetGo} />;
      case 12:
        return <WhenLetGo submit={this.receiveWhenLetGo} />;
      default:
        return "Unknown stepIndex";
    }
  };

  updateWhenBelievedNotTruePerceptionList = (list) => {
    console.log(list);
  };
  updateWhenBelievedTruePerceptionList = (list) => {
    console.log(list);
  };

  updateTurnAroundsList = (list, action = undefined) => {
    let inquiry = this.state.inquiry;
    console.log(list, inquiry.turnarounds, action);

    if (action == "add") {
      let turnaroundList = {
        Perception: [],
        Thought: [],
        Emotion: [],
        Body_Sensation: [],
        Mental_Image: [],
      };
      list[list.length - 1].push(turnaroundList);
    } else if (action == "remove") {
      console.log("Something removed");
    }
    console.log(list, this.state.turnarounds);
    inquiry.turnarounds = list;
    this.setState({
      inquiry: inquiry,
    });
  };

  updateDesires =(list)=>{
    let inquiry = this.state.inquiry;
    inquiry.desires = list;
    this.setState({
      inquiry:inquiry
    })
  }

  updateFears =(list)=>{
    let inquiry = this.state.inquiry;
    inquiry.fears = list;
    this.setState({
      inquiry:inquiry
    })
  }

  updateTurnaroundExample = (exampleList, turnaroundIndex) => {
    console.log(exampleList, turnaroundIndex);
    let inquiry = this.state.inquiry;
    inquiry.turnarounds[turnaroundIndex][2] = exampleList;
    this.setState({
      inquiry: inquiry,
    });
  };

  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  submitThoughtForInquiry = (a, m) => {
    console.log(a, m);
    let inquiry = this.state.inquiry;
    inquiry.inquiryThought = [a, m];
    this.setState({
      inquiry: inquiry,
      activeStep: 1,
    });
  };

  // receiveManifestedThought=(thought)=>{
  //   console.log("Selected Thought: ", thought);
  //   this.state.manifestedThought = thought;
  //   this.setState({
  //     manifestedThought:thought
  //   },()=>{
  //     this.handleNext();
  //   })
  // }

  receiveManifestedDesire = (desire) => {
    console.log("Selected Desire: ", desire);
    let thought = this.state.manifestedThought;
    thought.desire = desire;
    this.setState(
      {
        manifestedThought: thought,
      },
      () => {
        this.handleNext();
      }
    );
  };

  receiveFullBelief = (belief) => {
    console.log("Full Belief: ", belief);
    let thought = this.state.manifestedThought;
    thought.properties.fullBelief = thought;
    this.setState(
      {
        manifestedThouht: thought,
      },
      () => {
        this.handleNext();
      }
    );
  };
  receiveUnderlyingBeliefs = (beliefs) => {
    console.log("Underlying Beliefs: ", beliefs);
  };
  receiveAcceptance = (accept) => {
    console.log("Acceptance: ", accept);
  };

  receiveTruth = (isTrue) => {
    let inquiry = this.state.inquiry;
    console.log("Truth: ", isTrue);
    this.setState({
      truth:isTrue
    })
    this.handleNext();
  };

  receiveCanLetGo = (payload) => {
    this.setState({
      letGo:payload
    })
  };

  getThoughtText = () => {
    console.log(this.state);
    let thoughtText =
      this.state.inquiry.inquiryThought[0] !== undefined
        ? `Thought: ${this.state.inquiry.inquiryThought[1].properties.perception.value}`
        : "";
    return thoughtText;
  };

  render() {
    return (
      <div className="InquiryForm">
        <div className={"stepper-root"}>

        <div>
            {this.state.activeStep === this.steps.length ? (
              <div>
                <Typography>All steps completed</Typography>
                <Button onClick={this.handleReset}>Reset</Button>
              </div>
            ) : (
              <div className="InquiryForm-content">
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
                    {this.state.activeStep === this.steps.length - 1
                      ? "Finish"
                      : "Next"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        <h3>{this.getThoughtText()}</h3>
          <Stepper
            nonLinear
            activeStep={this.state.activeStep}
            alternativeLabel
          >
            {this.steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {this.state.activeStep === this.steps.length ? (
              null
             ) : (
              <div className="InquiryForm-content">
                {this.getStepContent(this.state.activeStep)}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }
}
export default InquiryForm;
