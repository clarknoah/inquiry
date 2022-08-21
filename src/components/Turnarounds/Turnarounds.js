
import React, {Component} from 'react';
import "./Turnarounds.css";
import PerceptionCollector from "../PerceptionCollector/PerceptionCollector"
import PerceptionsCollector from "../PerceptionsCollector/PerceptionsCollector"
import Divider from "@material-ui/core/Divider";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"; 

class Turnarounds extends Component{
  constructor(props){
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "Turnarounds"
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  render(){
    return(
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
        // console.log(turnaround);
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
          <AccordionDetails >
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
  }
}

export default Turnarounds;
