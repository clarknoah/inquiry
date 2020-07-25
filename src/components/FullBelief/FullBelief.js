
import React, {Component} from 'react';
import "./FullBelief.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
// Class Based React Component
class FullBelief extends Component{
  constructor(props){
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "FullBelief",
      thought:""
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
    this.setState({
      thought:belief
    })
  }

  render(){
    return(
      <div className={this.state.classList}>
      <TextareaAutosize
        rowsMin={3}
        aria-label="empty textarea"
        placeholder="Empty"
        value={this.state.thought}
        onChange={this.onChange}
      />
      <Button
      variant="contained"
      label="Hello"
      onClick={this.props.submitFullBelief}>
                Submit Full Belief
                </Button>
      </div>
    );
  }
}

export default FullBelief;
