import React, { Component } from "react";
import "./HowItServes.css";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Chip from '@material-ui/core/Chip';
import PerceptionCollector from "../PerceptionCollector/PerceptionCollector";
// Class Based React Component
class HowItServes extends Component {
  constructor(props) {
    super(props);
    // console.log(props);

    let list = [];
    if (props.list!==undefined){
      list = props.list;
    }

    this.state = {
      serves:props.doesBenefit,
      list:list,
      classList: "HowItServes",
      buttonYes: {
        variant: "outlined",
        color: "secondary",
      },
      buttonNo: {
        variant: "outlined",
        color: "secondary",
      },
    };
    if(props.doesBenefit!==undefined){
      if(props.doesBenefit===true){
        this.clickYes();
      }else if(props.doesBenefit===false){
        this.clickNo();
      }
    }
  }

  clickYes=()=>{
    let state = this.state;
    state.serves=true;
    state.buttonYes.variant="contained";
    state.buttonNo.variant="outlined";
    this.setState(state,()=>{
      this.update(this.state.list);
    })
  }
  clickNo=()=>{
    let state = this.state;
    state.serves=false;
    state.buttonYes.variant="outlined";
    state.buttonNo.variant="contained";
    this.setState(state,()=>{
      this.update(this.state.list);
    })
  }

  update=(list)=>{

    this.props.updateList(list,this.state.serves);
  }

  render() {
    return (
      <div className={this.state.classList}>
        <Typography variant="h4">
          Does the thought <Chip label={this.props.thought}/> serve me in
          <strong>
            <em> any </em>
          </strong>
          <u>beneficial</u> way?
        </Typography>
        <div className="HowItServes-buttons">
          <Button variant={this.state.buttonYes.variant} 
            color="secondary"
            onClick={this.clickYes}
          >
            Yes
          </Button>
          <Button 
            variant={this.state.buttonNo.variant}
            color="secondary"
            onClick={this.clickNo}
            >No</Button>
        </div>
        <Typography variant="h6">
          In what ways (if any) does this thought serve me?
        </Typography>
        <PerceptionCollector
          label={"Perception"}
          queryKey={"perception"}
          date={this.props.date}
          unique
          list={this.state.list}
          updateList={this.update}
        />
      </div>
    );
  }
}

export default HowItServes;
