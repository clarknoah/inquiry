
import React, {Component} from 'react';
import "./ManifestedDesire.css";
import TextField from '@material-ui/core/TextField';
import api from "../../services/api";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import utils from "../../services/utils";

// Class Based React Component
class ManifestedDesire extends Component{
  constructor(props){
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "ManifestedDesire",
      desire:"",
      abstractForms:[]
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  onChange=(evt)=>{
    let desire = evt.target.value;
    if(desire.length > 3){
      api.nodeListQuery("Abstract_Form", "name", desire).then(res => {
        // console.log(res);
        this.setState({
          desire:desire,
          abstractForms:res
        });
      });
    }else{
      this.setState({
        desire:desire,
        abstractForms:[]
      })
    }
  }

  compareDesireString=()=>{
    // console.log(this.state.desire )
    let same =  this.state.abstractForms.filter(val=>{
      // console.log(val.name,this.state.desire);
      return val.name.toLowerCase() === this.state.desire.toLowerCase()
    }).length == 0;
    // console.log(same);
    if(same){
      return  <Button
      variant="contained"
      label="Hello"
      onClick={this.selectNewDesire}>
                Submit New Desire
                </Button>
    }
  }

  selectExistingDesire=(desire)=>{
    // console.log(desire);
    desire.exists = true;
    desire.nodeId = desire.identity;
    desire.manifestedVar = `node_${utils.getUniqueId()}`;
    desire.abstractVar = `node_${utils.getUniqueId()}`;
    this.props.submitDesire(desire);
  }
  selectNewDesire=()=>{
    let thought = {
      exists:false,
      manifestedVar: `node_${utils.getUniqueId()}`,
      abstractVar:`node_${utils.getUniqueId()}`,
      properties:{
        name: this.state.desire
      }
    }
    this.props.submitDesire(thought);
  }

  render(){
    let chips = this.state.abstractForms.map((val,index)=>{
      return <div><Chip
        label={val.name}
        clickable
        color="primary"
        onClick={()=>{
          this.selectExistingDesire(val)
        }}
      /></div>
    })
    return(
      <div className={this.state.classList}>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          onChange={this.onChange}
          value={this.state.desire}
          />
          {this.compareDesireString()}
          <Card className={"Abstract-Card"}>
            <CardContent>
              {chips}
            </CardContent>
          </Card>
      </div>
    );
  }
}

export default ManifestedDesire;
