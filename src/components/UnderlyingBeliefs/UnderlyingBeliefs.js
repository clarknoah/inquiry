
import React, {Component} from 'react';
import "./UnderlyingBeliefs.css";
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import api from "../../services/api";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import utils from "../../services/utils";

// Class Based React Component
class UnderlyingBeliefs extends Component{
  constructor(props){
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "UnderlyingBeliefs",
      selectedBeliefs:[],
      queriedBeliefs:[],
      underlyingBelief:""
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  onChange=(evt)=>{
    let belief = evt.target.value;
    if(belief.length > 3){
      api.nodeListQuery("Abstract_Thought", "thought", belief).then(res => {
        console.log(res);
        res.map(val=>{
          val.exists = true;
          val.nodeId = val.identity;
          val.manifestedVar = `node_${utils.getUniqueId()}`;
          val.abstractVar = `node_${utils.getUniqueId()}`;
          return val;
        })
        this.setState({
          underlyingBelief: belief,
          queriedBeliefs:res
        });
      });
    }else{
      this.setState({
        underlyingBelief:belief,
        queriedBeliefs:[]
      })
    }
  }

  removeSelectedBelief=(element)=>{
      let selectedBeliefs = this.state.selectedBeliefs;
      selectedBeliefs.splice(element, 1);
      this.setState({
        selectedBeliefs:selectedBeliefs
      })
  }

  addBelief=(belief)=>{
    console.log(belief);
    let beliefAdded = this.state.selectedBeliefs.filter(val=>{
      return belief.name.toLowerCase() == val.name.toLowerCase();
    }).length > 0;

    if(!beliefAdded){
      let selectedBeliefs = this.state.selectedBeliefs;
      selectedBeliefs.push(belief);
      this.setState({
        selectedBeliefs:selectedBeliefs
      })
    }
  }

  compareThoughtString=()=>{
    console.log(this.state.thought, )
    let same =  this.state.queriedBeliefs.filter(val=>{
      return val.name === this.state.underlyingBelief
    }).length == 0;
    console.log(same);
    if(same){
      return  <Button
      variant="contained"
      label="Hello"
      onClick={()=>{
        let belief = {
          name: this.state.underlyingBelief,
          exists:false,
          properties:{
            thought:this.state.underlyingBelief
          }
        }
        this.addBelief(belief);
      }}>
                Add new belief
                </Button>
    }
  }


  submitBeliefs=()=>{
    this.props.submitUnderlyingBeliefs(this.state.selectedBeliefs);
  }


  render(){
    let chips = this.state.queriedBeliefs.map((val,index)=>{
      return <div><Chip
        label={val.name}
        clickable
        color="primary"
        onClick={()=>{
          this.addBelief(val)
        }}
      /></div>
    })

    return(
      <div className={""}>

        <div className={this.state.classList}>
          <TextareaAutosize
            rowsMin={3}
            aria-label="empty textarea"
            placeholder="Empty"
            value={this.state.underlyingBelief}
            onChange={this.onChange}
          />
          {this.compareThoughtString()}
          <Card className={"Abstract-Card"}>
            <CardContent>
              {chips}
            </CardContent>
          </Card>
          <hr/>
          <Card className={"Abstract-Card"}>
            <CardContent>
              {this.state.selectedBeliefs.map((val,index)=>{
                return <div>
                <Checkbox
                   checked={true}
                   onClick={()=>{
                     this.removeSelectedBelief(index);
                   }}
                   inputProps={{ 'aria-label': 'primary checkbox' }}
                 />
                 <Chip
                   label={val.name}
                   color="primary"
                 />
                </div>

              })}
              <Button
              variant="contained"
              label="Hello"
              onClick={this.submitBeliefs}>
                        Submit Beliefs
              </Button>
            </CardContent>
          </Card>
        </div>


      </div>
    );
  }
}

export default UnderlyingBeliefs;
