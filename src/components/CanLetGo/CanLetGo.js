
import React, {Component} from 'react';
import "./CanLetGo.css";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
// Class Based React Component
class CanLetGo extends Component{
  constructor(props){
    super(props);
    console.log(props);
    let data = {
      classList: "CanLetGo",
      couldEmotion:undefined,
      couldThought:undefined,
      wouldEmotion:undefined,
      wouldThought: undefined,
      when:"",
      emotionButtonYes:"outlined",
      emotionButtonNo:"outlined",
      thoughtButtonYes:"outlined",
      thoughtButtonNo:"outlined",
      wouldEmotionButtonYes:"outlined",
      wouldEmotionButtonNo:"outlined",
      wouldThoughtButtonYes:"outlined",
      wouldThoughtButtonNo:"outlined",
    };
    if(props.data!==undefined){
      data = props.data;
    }
    // Default CSS class to apply to the Component
    this.state = data;
  }

   updateCouldEmotionQuestion=(bool)=>{
    console.log("Changing");
    let obj = {};
    obj.couldEmotion = bool;
    if(bool==true){
      obj.emotionButtonYes = "contained";
      obj.emotionNButtonNo = "outlined";
    }else{
      obj.emotionButtonNo = "contained";
      obj.emotionButtonYes = "outlined";
    }
    this.setState(obj,()=>{
      this.submit();
    })
  }

  updateCouldThoughtQuestion=(bool)=>{
    console.log("Changing");
    let obj = {};
    obj.couldThought = bool;
    if(bool==true){
      obj.thoughtButtonYes = "contained";
      obj.thoughtNButtonNo = "outlined";
    }else{
      obj.thoughtButtonNo = "contained";
      obj.thoughtButtonYes = "outlined";
    }
    this.setState(obj,()=>{
      this.submit();
    })
  }
  updateWouldEmotionQuestion=(bool)=>{
    console.log("Changing");
    let obj = {};
    obj.wouldEmotion = bool;
    if(bool==true){
      obj.wouldEmotionButtonYes = "contained";
      obj.wouldEmotionNButtonNo = "outlined";
    }else{
      obj.wouldEmotionButtonNo = "contained";
      obj.wouldEmotionButtonYes = "outlined";
    }
    this.setState(obj,()=>{
      this.submit();
    })
  }

  updateWouldThoughtQuestion=(bool)=>{
    console.log("Changing");
    let obj = {};
    obj.wouldThought = bool;
    if(bool==true){
      obj.wouldThoughtButtonYes = "contained";
      obj.wouldThoughtButtonNo = "outlined";
    }else{
      obj.wouldThoughtButtonNo = "contained";
      obj.wouldThoughtButtonYes = "outlined";
    }
    this.setState(obj,()=>{
      this.submit();
    })
  }

  updateWhen=(e)=>{
    let val = e.target.value;
    this.setState({
      when:val
    },()=>{
      this.submit();
    })
  }
  submit=()=>{
    let data = this.state;
    this.props.submit(data);
  }

  render(){
    return(
      <div className={this.state.classList}>
          <Typography><em>Could</em> I let go of the feeling associated with believing this thought?</Typography>
          <div className={"CanLetGo-buttons"}>

          <Button variant={this.state.emotionButtonYes} 
          onClick={()=>this.updateCouldEmotionQuestion(true)} 
          color="secondary">Yes</Button>

          <Button variant={this.state.emotionButtonNo}  
          onClick={()=>this.updateCouldEmotionQuestion(false)} 
          color="secondary">No</Button>
          </div>
          <Divider variant="fullWidth"/>
          <Typography><em>Could</em> I let go of this thought?</Typography>
          <div className={"CanLetGo-buttons"}>

          <Button variant={this.state.thoughtButtonYes}  
          onClick={()=>this.updateCouldThoughtQuestion(true)} 
           color="secondary">Yes</Button>

          <Button variant={this.state.thoughtButtonNo} 
          onClick={()=>this.updateCouldThoughtQuestion(false)} 
          color="secondary">No</Button>
          </div>
          <Divider variant="fullWidth"/>
          <Typography><em>Would</em> I let go of these emotions?</Typography>
          <div className={"CanLetGo-buttons"}>

          <Button variant={this.state.wouldEmotionButtonYes}
          onClick={()=>this.updateWouldEmotionQuestion(true)} 
          color="secondary">Yes</Button>

          <Button variant={this.state.wouldEmotionButtonNo}
          onClick={()=>this.updateWouldEmotionQuestion(false)} 
          color="secondary">No</Button>
          </div>
          <Divider variant="fullWidth"/>
          <Typography><em>Would</em> I let go of this thought?</Typography>
          <div className={"CanLetGo-buttons"}>

          <Button variant={this.state.wouldThoughtButtonYes} 
          onClick={()=>this.updateWouldThoughtQuestion(true)} 
          color="secondary">Yes</Button>

          <Button variant={this.state.wouldThoughtButtonNo} 
          onClick={()=>this.updateWouldThoughtQuestion(false)} 
          color="secondary">No</Button>
          </div>
          <Divider variant="fullWidth"/>
          <Typography variant="h5"><em>When?</em></Typography>
          <TextField 
          value={this.state.when} 
            id="outlined-basic" 
            label="When?" 
            onChange={this.updateWhen}
            variant="outlined" />
      </div>
    );
  }
}

export default CanLetGo;
