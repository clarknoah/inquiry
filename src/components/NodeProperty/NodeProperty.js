import React, { Component } from 'react';
import "./NodeProperty.css";
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// Class Based React Component
class NodeProperty extends Component {
  constructor(props) {
    super(props);
   // // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "NodeProperty",
      property: props.property
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount() { }


  // Runs after a component has been updated
  componentDidUpdate(props) {
      if(this.props.property.value!==props.property.value){
        this.setState({
          property:this.props.property
        })
      }
   }


  // Runs right before a component is removed from the DOM
  componentWillUnmount() { }

  onChange = (e) => {
    let property = this.state.property;
    let value = e.target.value;
    property.setValue(value);
    this.setState({
      property:property
    },this.props.updateProperty(this.props.name,property))
  }

  determineField = () => {
    let field;
    if (this.state.property.meta.enum.length > 0) {
      field = <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-filled-label">{this.props.name}</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={this.state.property.value}
          onChange={this.onChange}
        >
          {this.state.property.meta.enum.map(item=><MenuItem key={item} value={item}>{item}</MenuItem>)}
        </Select>
      </FormControl>
    } else{
      field = <TextField variant="outlined" onChange={this.onChange} value={this.state.property.value} label={this.props.name} />
    }
    return field;
  }

  render() {
    if(this.state.property.edittable){
      return (
        <div className={this.state.classList}>
          {this.state.property.edittable ? this.determineField(): null}
        </div>
      );
    }else{
      return null;
    }
  }
}

export default NodeProperty;
