
import React, {Component} from 'react';
import "./ThoughtJournal.css";
import NodeEditor from "../../components/NodeEditor/NodeEditor";
import api from "../../services/api";
import InquiryModel from "../../models/GraphModel";
// Class Based React Component
class ThoughtJournal extends Component{
  constructor(props){
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtJournal",
      thoughts:[]
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount(){
    api.nodeListQuerySize("Thought","perception",undefined, 50,0)
      .then(res=>{
        let thoughts = [];
        res = res.map(val=>{
          let thought = InquiryModel.getExistingModelClass("A_Thought",val.identity,val.properties)
          thought.count = val.count.low;
          return thought
        })
        // console.log("hello",res);
        this.setState({
          thoughts:res
        })
      })
  }


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}

  render(){
    let thoughts = this.state.thoughts.map(node=>{
      let header = "("+node.labels.join(":")+"): "+node.properties.perception.value;
      return <NodeEditor header={header} key={node.variable} node={node} directSave/>
    })
    return(
      <div className={this.state.classList}>
        {this.state.thoughts.length > 0 ? thoughts:null}
      </div>
    );
  }
}

export default ThoughtJournal;
