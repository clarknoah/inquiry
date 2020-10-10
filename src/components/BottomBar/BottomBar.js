import React, { Component } from "react";
import "./BottomBar.css";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import FavoriteIcon from "@material-ui/icons/Favorite";
import NotesIcon from "@material-ui/icons/Notes";
import AddAlarmIcon from "@material-ui/icons/AddAlarm";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import FlareIcon from "@material-ui/icons/Flare";
import Tooltip from "@material-ui/core/Tooltip";
import {Link} from 'react-router-dom';

// Class Based React Component
class BottomBar extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "BottomBar"
    };
  }

  // Runs after Component is loaded in the broswer
  componentDidMount() {}

  // Runs after a component has been updated
  componentDidUpdate() {}

  // Runs right before a component is removed from the DOM
  componentWillUnmount() {}

  render() {
    return (
      <div className={this.state.classList}>
        <Tooltip title="Thought Journal">
          <Link to="/journal">
          <Fab color="primary" aria-label="notes">
            <NotesIcon />
          </Fab>
          </Link>
        </Tooltip>
        <Tooltip title="Metacognitive Practices">
        <Link to="/practices">
          <Fab color="primary" aria-label="meta-practices">
            <AddAlarmIcon />
          </Fab>
          </Link>
        </Tooltip>
        <Tooltip title="Log a Thought">
        <Link to="/logger">
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
          </Link>
        </Tooltip>
        <Tooltip title="Inquiry Practice">
        <Link to="/inquiry">
          <Fab color="primary" aria-label="inquiry">
            <FlareIcon />
          </Fab>
          </Link>
        </Tooltip>
        <Tooltip title="Insights">
        <Link to="/insights">
          <Fab color="primary" aria-label="insights">
            <InsertChartIcon />
          </Fab>
          </Link>
        </Tooltip>
      </div>
    );
  }
}

export default BottomBar;
