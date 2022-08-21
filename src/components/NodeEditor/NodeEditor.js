import React, { Component } from 'react';
import "./NodeEditor.css";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NodeProperty from "../NodeProperty/NodeProperty";
import api from "../../services/api";
// Class Based React Component
class NodeEditor extends Component {
  constructor(props) {
    super(props);
    //// console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "NodeEditor",
      node: this.props.node
    };
  }


  // Runs after Component is loaded in the broswer


  // Runs after a component has been updated
  componentDidUpdate(props) {
    // console.log(this.props, props);
    this.checkForPropertyChange(props.node,this.props.node);
   }


  // Runs right before a component is removed from the DOM
  componentWillUnmount() { }

  checkForPropertyChange=(oldNode,newNode)=>{
    let changed = false;
    let keys = oldNode.properties.propertyKeys;
    keys.forEach(field=>{
      let oldField = oldNode.properties[field].value;
      let newField = newNode.properties[field].value;
      if(oldField!==newField){
        changed = true;
      }
    })
    if(changed){
      this.setState({
        node:newNode
      })
    }
  }

  updateProperty=(key, property)=>{
    let node = this.state.node;
    node.properties[key] = property;
    this.setState({
      node:node
    },this.updateParent)
  }

  updateParent=()=>{
    if(this.props.update!==undefined){
      this.props.update(this.state.node)
    }
  }

  saveNode=()=>{
    let props = this.state.node.properties.generateCypherPropertyObject();
    // console.log(props);
    api.updateNode(this.state.node.id, props)
      .then(res=>{

      })
  }

  render() {
    let properties = [];
    this.state.node.properties.propertyKeys.forEach(prop=>{
      let property = <NodeProperty 
      key={prop}
      name={prop}
      property={this.state.node.properties[prop]}
      updateProperty={this.updateProperty}
      />
      properties.push(property);
    })
    return (
      <div className={this.state.classList}>
        <Card >
          <CardContent>
          <Typography>{this.props.header}</Typography>
            {properties}
          </CardContent>
          <CardActions>
            {this.props.directSave ? <Button onClick={this.saveNode} size="small">Save Changes</Button> : null}
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default NodeEditor;
