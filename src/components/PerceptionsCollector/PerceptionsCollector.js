import React, { Component } from "react";
import "./PerceptionsCollector.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PerceptionCollector from "../PerceptionCollector/PerceptionCollector";
import Chip from '@material-ui/core/Chip';
/*
  This component should accept props informing the collector of which perceptions it
  is expected to collect.

  When a perception is updated in the PerceptionCollector, it should update the
  PerceptionsCollector 
*/
// Class Based React Component
class PerceptionsCollector extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "PerceptionsCollector",
      perceptions: props.list,
    };
  }
  updatePerceptionArray=(list,label)=>{
    console.log(list);
    let obj = {perceptions:this.state.perceptions};
    obj.perceptions[label] = list
    this.setState(obj,()=>{
      
      this.props.updateLists(this.state.perceptions);
    })
  }

  updateSubPerceptionArray=(list, index)=>{
    console.log(list, index);
  }

  determineCollector=(mainLabel, index)=>{
    if(this.props.subRelationships!==undefined && this.props.subRelationships[index]!==undefined){
      let {label, queryKey, unique, date, updateList}= this.props.subRelationships[index];

      return (
        <PerceptionCollector
        label={mainLabel}
        queryKey={this.props.queryKeys[index]}
        date={this.props.date}
        unique
        subRelationships={{
          label:label,
          queryKey:queryKey,
          unique:true,
          date:date,
          hideNewThought:true,
          updateList:(list)=>{this.updateSubPerceptionArray(list, index)}

        }}
        list={this.state.perceptions[mainLabel]}
        updateList={(list)=>{this.updatePerceptionArray(list,mainLabel)}}
      />
      )
    }else{
      return (
        <PerceptionCollector
        label={mainLabel}
        queryKey={this.props.queryKeys[index]}
        date={this.props.date}
        hideNewThought
        unique
        list={this.state.perceptions[mainLabel]}
        updateList={(list)=>{this.updatePerceptionArray(list,mainLabel)}}
      />
      )
    }
  }

  render() {
    return (
      <div className={this.state.classList}>
        {this.props.header!==undefined ? (
          <Typography variant="h5">{this.props.header}</Typography>
        ) : null}
        {this.props.labels.map((label, index) => {
          console.log(label);
          return (
            <Accordion className={"PerceptionsCollector-content"}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions1-content"
                id="additional-actions1-header"
              >
                <Typography className="PerceptionsCollector-header">
                  {this.props.text[index]}
                  </Typography>

                  <Chip label={this.state.perceptions[label].length} />

              </AccordionSummary>
              <AccordionDetails >
                {this.determineCollector(label, index)}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  }
}

export default PerceptionsCollector;
