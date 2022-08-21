import React, { Component } from "react";
import "./ThoughtLogger.css";
import TextField from "@material-ui/core/TextField";
import ManifestedPerception from "../../components/ManifestedPerception/ManifestedPerception";
import ManifestedThought from "../../components/ManifestedThought/ManifestedThought";
import api from "../../services/api";
import Radio from "@material-ui/core/Radio";
import CypherQuery from "../../models/CypherQuery";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
// Class Based React Component
class ThoughtLogger extends Component {
  constructor(props) {
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      cypherQuery: new CypherQuery(),
      perception: [],
      classList: "ThoughtLogger",
      type: "M_Thought",
    };
  }

  resetLogger = () => {
    this.setState({
      cypherQuery: new CypherQuery(),
      perception: [],
    });
  };

  submitPerception = (a, m) => {
    // console.log(m);
    if (m.properties[m.defaultQueryKey].value.length > 0) {
      m.properties.inputType.setValue("logger");
      let rel = m.addRelationship("MANIFESTATION_OF", a.variable);
      let query = new CypherQuery();
      query.addNode(a);
      query.addNode(m);
      let qString = query.generateQuery();
      // console.log(qString, query.params);
      api.cypherQuery(qString, query.params);
    }
    //api.submitThought(a, m);
  };




  render() {

    return (
      <div className={this.state.classList}>

            <ManifestedPerception
              label={"Thought"}
              queryKey="perception"
              submitPerception={this.submitPerception}
            />
          
      </div>
    );
  }
}

export default ThoughtLogger;
