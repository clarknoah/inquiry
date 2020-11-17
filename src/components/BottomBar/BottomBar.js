import React, { Component } from "react";
import "./BottomBar.css";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import NotesIcon from "@material-ui/icons/Notes";
import AddAlarmIcon from "@material-ui/icons/AddAlarm";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import FlareIcon from "@material-ui/icons/Flare";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// Class Based React Component
class BottomBar extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "BottomBar",
      showLoggerMenu: false,
      anchor: null,
    };
  }
  showLoggerMenu = (e) => {
    console.log(Boolean(e.currentTarget));

    this.setState({
      anchor: e.currentTarget,
    });
  };

  closeLoggerMenu = () => {
    console.log("Closing");
    this.setState({
      anchor: null,
    });
  };

  // Runs after Component is loaded in the broswer
  componentDidMount() {}

  // Runs after a component has been updated
  componentDidUpdate() {}

  // Runs right before a component is removed from the DOM
  componentWillUnmount() {}

  render() {
    return (
      <div className={this.state.classList}>
        <AppBar color="primary" className="BottomBar-bar">
          <Toolbar>

          <Tooltip title="Thought Journal">
          <Link to="/journal">
            <Fab color="secondary" aria-label="notes">
              <NotesIcon />
            </Fab>
          </Link>
        </Tooltip>
        <Tooltip title="Metacognitive Practices">
          <Link to="/practices">
            <Fab color="secondary" aria-label="meta-practices">
              <AddAlarmIcon />
            </Fab>
          </Link>
        </Tooltip>
        <div>
        <Fab
          aria-controls="simple-menu"
          aria-haspopup="true"
          color="secondary"
          aria-label="add"
          onClick={this.showLoggerMenu}
        >
          <AddIcon />
        </Fab>

        <Menu
          id="simple-menu"
          anchorEl={this.state.anchor}
          keepMounted
          open={Boolean(this.state.anchor)}
          onClose={this.closeLoggerMenu}
        >
          <Link to="/logger/thought">
            <MenuItem onClick={this.closeLoggerMenu}>Add Thought</MenuItem>
          </Link>
          <Link to="/logger/stimulusAndThought">
            <MenuItem onClick={this.closeLoggerMenu}>
              {" "}
              Add Stimulus + Thought
            </MenuItem>
          </Link>
          <Link to="/logger/stimulusAndThoughtAndEmotion">
            <MenuItem onClick={this.closeLoggerMenu}>
              Add Stimulus + THought + Emotion
            </MenuItem>
          </Link>
          <Link to="/logger/stimulusAndThoughtAndEmotionAndConcept">
            <MenuItem onClick={this.closeLoggerMenu}>
              Add Stimulus + Thought + Emotion + Concept
            </MenuItem>
          </Link>
          <Link to="/logger/thoughtAndEmotionAndConcept">
            <MenuItem onClick={this.closeLoggerMenu}>
              Thought + Emotion + Concept
            </MenuItem>
          </Link>
          <Link to="/logger/thoughtAndEmotion">
            <MenuItem onClick={this.closeLoggerMenu}>
              Thought + Emotion
            </MenuItem>
          </Link>
          <Link to="/logger/thoughtAndPart">
            <MenuItem onClick={this.closeLoggerMenu}>
              Thought + Part
            </MenuItem>
          </Link>

          <Link to="/logger/EmotionAndForm">
            <MenuItem onClick={this.closeLoggerMenu}>Emotion + Form</MenuItem>
          </Link>
        </Menu>
        </div>
        <Tooltip title="Inquiry Practice">
          <Link to="/inquiry">
            <Fab color="secondary" aria-label="inquiry">
              <FlareIcon />
            </Fab>
          </Link>
        </Tooltip>
        <Tooltip title="Insights">
          <Link to="/insights">
            <Fab color="secondary" aria-label="insights">
              <InsertChartIcon />
            </Fab>
          </Link>
        </Tooltip>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default BottomBar;
