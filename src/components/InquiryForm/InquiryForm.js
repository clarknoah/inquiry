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
import CanLetGo from "../CanLetGo/CanLetGo";
import WillLetGo from "../WillLetGo/WillLetGo";
import WhenLetGo from "../WhenLetGo/WhenLetGo";
import PerceptionCollector from "../PerceptionCollector/PerceptionCollector";
import PerceptionsCollector from "../PerceptionsCollector/PerceptionsCollector";
import InquiryModel from "../../models/GraphModel";
import Divider from "@material-ui/core/Divider";
import Timer from "react-compound-timer";
import HowItServes from "../HowItServes/HowItServes";
import Chip from "@material-ui/core/Chip";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"; 
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
    "How do I treat myself and others? (Optional)",
    "How do I perceive myself and others? (Optional)",
    "Does this thought serve me? (Optional)",
    "Underlying beliefs (Optional)",
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
    this.api = api;
    console.log(this);
    this.steps = getSteps();
    this.timer = React.createRef();
    this.state = {
      activeStep: 0,
      inquiry: InquiryModel.getNewModelClass("Inquiry_Session"),
      manifestedDesire: null,
      manifestedThought: {
        properties: {},
      },
      letGo: undefined,
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
    this.state.inquiry.properties.completed.value = false;
  }

  handleNext = () => {
    let inquiry = this.state.inquiry;
    let nextStep = this.state.activeStep + 1;
    if(nextStep == this.steps.length ){
      //add checkedForCompleted
      if (true) {
        console.log("Finished");
        let duration = this.getCurrentTimerTime();
        inquiry.properties.duration.value = duration;
        inquiry.properties.timestampOfInputEnd.setDefaultValue();
        inquiry.properties.duration.value = this.getCurrentTimerTime();
        this.setState({
          inquiry:inquiry
        },this.finishInquiry)
      }else{
        alert("YOu still have more to finish");
        nextStep = nextStep -1;
        console.log(nextStep);
      }
    }else if(nextStep == 1 && inquiry.stepsCompleted.thought!==true){
        nextStep--;
    }else if (nextStep==2  && inquiry.stepsCompleted.truth!==true){
        nextStep--;
    }
    this.setState({
      activeStep: nextStep,
      inquiry: inquiry,
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

  finishInquiry=()=>{
    let inquiry = this.state.inquiry;
    console.log(this);
    inquiry.createMarkdown();
    inquiry.generateCypherQuery();
    api.cypherQuery(inquiry.query.query, inquiry.query.params)
      .then(res=>{
        console.log(res,"Query submitted");
      })
    this.setState({
      inquiry:inquiry
    })
  }
  finishInquiryPass=(query,params)=>{

    api.cypherQuery(query, params)
      .then(res=>{
        console.log(res,"Query submitted");
      })
 
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div style={{ width: "100%" }}>
            <ManifestedPerception
              label={"Thought"}
              queryKey="perception"
              submitPerception={this.submitThoughtForInquiry}
            />
          </div>
        );
      case 1:
        return (
          <Truth memory={this.state.truth} submitTruth={this.receiveTruth} />
        );
      case 2:
        let getCollector = () => {
          return (
            <PerceptionCollector
              label={"Thought"}
              queryKey={"perception"}
              date={this.state.inquiry.date}
              unique
              list={this.state.inquiry.desires}
              updateList={this.updateDesires}
            />
          );
        };
        return getCollector();
      case 3:
        return (
          <div style={{ width: "100%" }}>
            <PerceptionCollector
              label={"Thought"}
              queryKey={"perception"}
              date={this.state.inquiry.date}
              unique
              list={this.state.inquiry.fears}
              updateList={this.updateFears}
            />
          </div>
        );
      case 4:
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {this.state.inquiry.fullBelief.length > 0 ? (
              <Typography variant="h5">
                {this.state.inquiry.fullBelief[0].properties.perception.value}
              </Typography>
            ) : null}
            <ManifestedPerception
              label={"Thought"}
              hideNewThought
              queryKey="perception"
              date={this.state.inquiry.date}
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
              subRelationships={[
                undefined,
                {
                  label: "Form",
                  queryKey: "perception",
                  unique: true,
                  date: this.state.inquiry.date,
                },
                {
                  label: "Body_Location",
                  queryKey: "perception",
                  unique: true,
                  date: this.state.inquiry.date,
                },
                undefined,
                undefined,
              ]}
              date={this.state.inquiry.date}
              list={this.state.inquiry.whenBelieved}
              unique
              header={"When you believe this thought is true..."}
              updateLists={this.updateWhenBelievedTruePerceptionList}
            />
          </div>
        );
      case 6:
        let getTreat=()=>{
          return (
            <div
              style={{ width: "100%", display: "flex", flexDirection: "column" }}
            ><div></div>
              <Typography>
                How do you treat yourself and others when you believe this
                thought?
              </Typography>
              <PerceptionCollector
                label={"Form"}
                queryKey={"perception"}
                date={this.state.inquiry.date}
                unique
                subRelationships={{
                  label: "Perception",
                  queryKey: "perception",
                  unique: true,
                  date: this.state.inquiry.date,
                  updateList: this.updateTreats,
                }}
                list={this.state.inquiry.treats}
                updateList={this.updateTreats}
              />
            </div>
          );
        }
        return getTreat();
      case 7:
        let getPerceive=()=>{
          return (
            <div
              style={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography>
                How do you perceive yourself and others when you believe this
                thought?
              </Typography>
              <PerceptionCollector
                label={"Form"}
                queryKey={"perception"}
                date={this.state.inquiry.date}
                unique
                subRelationships={{
                  label: "Perception",
                  queryKey: "perception",
                  unique: true,
                  date: this.state.inquiry.date,
                  updateList: this.updatePerceives,
                }}
                list={this.state.inquiry.perceives}
                updateList={this.updatePerceives}
              />
            </div>
          );
        }
        return getPerceive();
      case 8:
        return (
          <HowItServes
            thought={this.getThoughtText()}
            updateList={this.receiveServes}
            doesBenefit={this.getBenefitsValue()}
            date={this.state.inquiry.date}
            list={this.state.inquiry.serves}
          />
        );
      case 9:
        let getUnderlyingBeliefs = () => {
          return (
            <PerceptionCollector
              label={"Thought"}
              queryKey={"perception"}
              date={this.state.inquiry.date}
              unique
              list={this.state.inquiry.underlyingBeliefs}
              updateList={this.updateUnderlyingBeliefs}
            />
          );
        };
        return <div style={{ width: "100%" }}>{getUnderlyingBeliefs()}</div>;
      case 10:
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
            subRelationships={[
              undefined,
              undefined,
              {
                label: "Form",
                queryKey: "perception",
                unique: true,
                date: this.state.inquiry.date,
              },
              {
                label: "Body_Location",
                queryKey: "perception",
                unique: true,
                date: this.state.inquiry.date,
              },
              undefined,
            ]}
            date={this.state.inquiry.date}
            list={this.state.inquiry.whenNotBelieved}
            unique
            header={
              "Who would you be if you didn't believe nor could even experience this thought?"
            }
            updateLists={this.updateWhenBelievedNotTruePerceptionList}
          />
        );
      case 11:
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <PerceptionCollector
              label={"Thought"}
              queryKey={"perception"}
              date={this.state.inquiry.date}
              unique
              list={this.state.inquiry.turnarounds}
              updateList={this.updateTurnAroundsList}
            />
            <Divider />
            {this.state.inquiry.turnarounds.map((turnaround, index) => {
              console.log(turnaround);
              let header = turnaround[0].properties.perception.value;
              return (
                <Accordion className={"PerceptionsCollector-content"}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header"
                  >
                    <Typography className="PerceptionsCollector-header">
                      {header}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    
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
                      unique
                      subRelationships={[
                        undefined,
                        undefined,
                        {
                          label: "Form",
                          queryKey: "perception",
                          unique: true,
                          date: this.state.inquiry.date,
                        },
                        {
                          label: "Body_Location",
                          queryKey: "perception",
                          unique: true,
                          date: this.state.inquiry.date,
                        },
                        undefined,
                      ]}
                      date={this.state.inquiry.date}
                      list={turnaround[2]}
                      unique
                      header={header}
                      updateLists={(list, label) => {
                        this.updateTurnaroundExample(list, index);
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        );
      case 12:
        return (
          <CanLetGo data={this.state.letGo} submit={this.receiveCanLetGo} />
        );
      case 13:
        return <WillLetGo submit={this.receiveWillLetGo} />;
      case 14:
        return <CanLetGo submit={this.receiveCanLetGo} />;
      case 15:
        return <WhenLetGo submit={this.receiveWhenLetGo} />;
      case 16:
        return <WhenLetGo submit={this.receiveWhenLetGo} />;
      default:
        return "Unknown stepIndex";
    }
  };

  updateWhenBelievedNotTruePerceptionList = (list) => {
    console.log(list);
    let inquiry = this.state.inquiry;
    let completed = false;
    for(let key in list){
      if(list[key].length > 0){
        completed = true;
      }
    }
      inquiry.stepsCompleted.whenNotBelieved = completed;

    inquiry.whenNotBelieved = list;
    this.setState({
      inquiry:inquiry
    })
  };

  updateWhenBelievedTruePerceptionList = (list) => {
    console.log(list);
    let inquiry = this.state.inquiry;
    let completed = false;
    for(let key in list){
      if(list[key].length > 0){
        completed = true;
      }
    }
      inquiry.stepsCompleted.whenBelieved = completed;

    inquiry.whenBelieved = list;
    this.setState({
      inquiry:inquiry
    })
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
    if(inquiry.turnarounds.length > 0){
      inquiry.stepsCompleted.turnarounds = true;
    }else{
      inquiry.stepsCompleted.turnarounds = false;
    }
    this.setState({
      inquiry: inquiry,
    });
  };

  receiveServes = (list, bool) => {
    console.log(list, bool);
    let inquiry = this.state.inquiry;
    inquiry.serves = list;
    inquiry.inquiryThought[1].properties.doesThisBenefitMe.value = bool;
    this.setState({
      inquiry: inquiry,
    });
  };

  getBenefitsValue = () => {
    if (this.state.inquiry.inquiryThought.length > 0) {
      return this.state.inquiry.inquiryThought[1].properties.doesThisBenefitMe
        .value;
    } else {
      return undefined;
    }
  };
  updateDesires = (list) => {
    let inquiry = this.state.inquiry;
    inquiry.desires = list;
    this.setState({
      inquiry: inquiry,
    });
  };

  updateTreats = (list) => {
    console.log(list);
    let inquiry = this.state.inquiry;
    inquiry.treats = list;
    this.setState({
      inquiry: inquiry,
    });
  };
  updatePerceives = (list) => {
    console.log(list);
    let inquiry = this.state.inquiry;
    inquiry.perceives = list;
    this.setState({
      inquiry: inquiry,
    });
  };

  updateFears = (list) => {
    let inquiry = this.state.inquiry;
    inquiry.fears = list;
    this.setState({
      inquiry: inquiry,
    });
  };

  updateTurnaroundExample = (exampleList, turnaroundIndex) => {
    console.log(exampleList, turnaroundIndex);
    let inquiry = this.state.inquiry;
    inquiry.turnarounds[turnaroundIndex][2] = exampleList;
    this.setState({
      inquiry: inquiry,
    });
  };

  submitThoughtForInquiry = (a, m) => {
    console.log(a, m);
    let inquiry = this.state.inquiry;
    inquiry.setupSession(a, m);
    this.setState({
      inquiry: inquiry,
      activeStep: 1,
    });
  };

  receiveFullBelief = (a, m) => {
    let inquiry = this.state.inquiry;
    inquiry.fullBelief = [a, m];
    this.setState(
      {
        inquiry: inquiry,
      },
      () => {
        this.handleNext();
      }
    );
  };
  updateUnderlyingBeliefs = (list) => {
    let inquiry = this.state.inquiry;
    inquiry.underlyingBeliefs = list;
    this.setState({
      inquiry: inquiry,
    });
  };

  receiveAcceptance = (accept) => {
    console.log("Acceptance: ", accept);
  };

  receiveTruth = (isTrue) => {
    console.log(isTrue);
    let inquiry = this.state.inquiry;
    inquiry.inquiryThought[1].properties.isItTrue.value = isTrue.isItTrue;
    if(isTrue.isItTrue==true){
      inquiry.inquiryThought[1].properties.certainlyTrue.value = isTrue.certainlyTrue;
    }
    inquiry.stepsCompleted.truth = true;
    console.log("Truth: ", isTrue);
    this.setState({
      truth: isTrue,
      inquiry:inquiry
    },this.handleNext);

  };

  getCurrentTimerTime = () => {
    let timeArr = this.timer.current
      .querySelector("div")
      .innerText.split(":")
      .map((val) => parseInt(val));
    let currentDuration = timeArr[0] * 60 * 60 + timeArr[1] * 60 + timeArr[2];
    console.log(currentDuration);
    return currentDuration;
  };

  receiveCanLetGo = (payload) => {
    let inquiry = this.state.inquiry;
    inquiry.inquiryThought[1].properties.wouldLetGoEmotion.value = payload.wouldEmotion;
    inquiry.inquiryThought[1].properties.wouldLetGoThought.value = payload.wouldThought;
    inquiry.inquiryThought[1].properties.couldLetGoEmotion.value = payload.wouldEmotion;
    inquiry.inquiryThought[1].properties.wouldLetGoThought.value = payload.wouldThought;
    inquiry.inquiryThought[1].properties.whenLetGo.value = payload.when;
    this.setState({
      letGo: payload,
      inquiry:inquiry
    });
  };

  getThoughtText = () => {
    console.log(this.state);
    let thoughtText =
      this.state.inquiry.inquiryThought[0] !== undefined
        ? `${this.state.inquiry.inquiryThought[1].properties.perception.value}`
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
                  {this.state.inquiry.inquiryThought.length > 0 ? (
                    <div ref={this.timer}>
                      <Timer
                        initialTime={0}
                        startImmediately={true}
                        onStart={() => console.log("onStart hook")}
                        onResume={() => console.log("onResume hook")}
                        onPause={() => console.log("onPause hook")}
                        onStop={() => console.log("onStop hook")}
                        onReset={() => console.log("onReset hook")}
                      >
                        {({
                          start,
                          resume,
                          pause,
                          stop,
                          reset,
                          timerState,
                        }) => (
                          <React.Fragment>
                            <div>
                              <Timer.Hours />:
                              <Timer.Minutes />:
                              <Timer.Seconds />
                            </div>
                            <br />
                            <div>
                              <button onClick={pause}>Pause</button>
                              <button onClick={resume}>Resume</button>
                            </div>
                          </React.Fragment>
                        )}
                      </Timer>
                    </div>
                  ) : null}
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
            {this.state.activeStep === this.steps.length ? null : (
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
