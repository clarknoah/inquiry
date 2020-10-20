
import React, {Component} from 'react';
import "./TefLogger.css";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import ManifestedPerception from "../../../components/ManifestedPerception/ManifestedPerception";
import Typography from '@material-ui/core/Typography';
import CypherQuery from '../../../models/CypherQuery';
import api from "../../../services/api";
// Class Based React Component


class TefLogger extends Component{
  constructor(props){
    super(props);
    console.log(props);
    this.steps = [ "Select Thought","Select Emotion","Select Form","Submit!"];
    this.state = {
      perception:[],
      emotion:[],
      form:[],
      classList: "TefLogger",
      text:"",
      activeStep:0,
      cypherQuery: new CypherQuery(),
      date:undefined,
      perceptionDate:undefined,

    };
  }
  


  correctDates=(a,m,corrector)=>{
    m.properties.timestampOfPerception.value = corrector.properties.timestampOfPerception.value;
    m.properties.timestampOfInput.value = corrector.properties.timestampOfInput.value;
    m.properties.dateOfInput.value = corrector.properties.dateOfInput.value;
    m.properties.dateOfPerception.value = corrector.properties.dateOfPerception.value;

    if(a.exists!==true){
      a.properties.timestampOfPerception.value = corrector.properties.timestampOfPerception.value;
      a.properties.timestampOfInput.value = corrector.properties.timestampOfInput.value;
      a.properties.dateOfInput.value = corrector.properties.dateOfInput.value;
      a.properties.dateOfPerception.value = corrector.properties.dateOfPerception.value;
    }
    return {a:a,m:m};
  }



  submitPerception=(a, m)=>{
    if(m.properties.perception.value.length > 0){
      let {text, cypherQuery} = this.state;
      text += `(${m.labels[0]}): ${m.properties.perception.value})`;

      m.properties.inputType.setValue("logger");
      this.setState({
        text:text,
        cypherQuery:cypherQuery,
        activeStep:1,
        perception:[a,m],
        date:m.properties.dateOfPerception.value
      })
    }
  }

  submitEmotion=(a,m)=>{
    if(m.properties.perception.value.length > 0){
      m.properties.inputType.setValue("logger");
      let {text, cypherQuery, perception} = this.state;
      ({a,m} = this.correctDates(a,m,perception[1]));
      text += `(${m.labels[0]}): ${m.properties.perception.value})-[:IN_RELATIONSHIP_TO]->`;

      this.setState({
        text:text,
        cypherQuery:cypherQuery,
        activeStep:2,
        emotion:[a,m],
        perception:[perception[0],perception[1]]
      })
    }
  }


  submitForm=(a,m)=>{
    if(m.properties.perception.value.length > 0){
      m.properties.inputType.setValue("logger");
      let {text, cypherQuery, perception,emotion} = this.state;
      ({a,m} = this.correctDates(a,m,perception[1]));
      text += `(${m.labels[0]}): ${m.properties.perception.value})`;
      this.setState({
        text:text,
        cypherQuery:cypherQuery,
        activeStep:3,
        form:[a,m],
        emotion:[emotion[0],emotion[1]]
      })
    }
  }

  setActiveStep=()=>{

  }

  submitLog=()=>{
    let {perception, emotion,form, cypherQuery} = this.state;
    perception[1].addRelationship("MANIFESTATION_OF",perception[0].variable);
    emotion[1].addRelationship("MANIFESTATION_OF",emotion[0].variable);
    form[1].addRelationship("MANIFESTATION_OF",form[0].variable);
    perception[1].addRelationship("WHEN_BELIEVED",emotion[1].variable);
    emotion[1].addRelationship("IN_RELATIONSHIP_TO",form[1].variable);
    cypherQuery.addNode(perception[0]);
    cypherQuery.addNode(perception[1]);
    cypherQuery.addNode(emotion[0]);
    cypherQuery.addNode(emotion[1]);
    cypherQuery.addNode(form[0]);
    cypherQuery.addNode(form[1]);
    cypherQuery.generateQuery();
    console.log(cypherQuery.query, cypherQuery.params);
    api.cypherQuery(cypherQuery.query,cypherQuery.params)
      .then(res=>{
        this.handleReset();
      })

  }
  handleNext = (e) => {
    console.log(e.target.innerText);
    if(e.target.innerText === "FINISH"){
      this.submitLog();
    }else{
      this.setState({
        activeStep:this.state.activeStep + 1
      })
    }
 };

  handleBack = () => {
   this.setState({
     activeStep:this.state.activeStep -1
   })
 };

  handleReset = () => {
   this.setState({
     activeStep:0,
     perception:[],
     text:"",
     cypherQuery: new CypherQuery(),
     date:undefined
   })
 };



  getStepContent=(stepIndex)=>{
    switch (stepIndex) {
      case 0:
        return <ManifestedPerception label="Thought" date={this.state.date} queryKey="perception" submitPerception={this.submitPerception}/>;
      case 1:
          return <ManifestedPerception label="Emotion" date={this.state.date} queryKey="perception" submitPerception={this.submitEmotion}/>;      
      case 2: 
          return <ManifestedPerception label="Form" date={this.state.date} queryKey="perception" submitPerception={this.submitForm}/>; 
      case 3: 
          return "Ready to Submit, click finish!"
      default:
        return "Unknown stepIndex";
    }
  }


  render(){
    let {activeStep } = this.state;
    return(
      <div className={this.state.classList}>
        <div className={"TefLogger-output"}>{this.state.text}</div>
        <Stepper activeStep={activeStep}>
          {this.steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
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
    );
  }
}

export default TefLogger;
