
import React, {Component} from 'react';
import "./WhenBelieved.css";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import api from "../../services/api";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import utils from "../../services/utils";

// Class Based React Component
class WhenBelieved extends Component{
  constructor(props){
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "WhenBelieved"
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  changeTab=()=>{

  }

  render(){
    return(
      <div className={this.state.classList}>

      </div>
    );
  }
}

export default WhenBelieved;
