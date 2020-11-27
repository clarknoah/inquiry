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
      showInsightMenu:false,
      insightAnchor:null
    };
  }
  showLoggerMenu = (e,key) => {
    console.log(Boolean(e.currentTarget));

    this.setState({
      [key]: e.currentTarget,
    });
  };

  closeLoggerMenu = (key) => {
    console.log("Closing");
    this.setState({
      [key]: null,
    });
  };

  // Runs after Component is loaded in the broswer
  componentDidMount() { }

  // Runs after a component has been updated
  componentDidUpdate() { }

  // Runs right before a component is removed from the DOM
  componentWillUnmount() { }

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
                onClick={(e)=>this.showLoggerMenu(e,"anchor")}
              >
                <AddIcon />
              </Fab>

              <Menu
                id="simple-menu"
                anchorEl={this.state.anchor}
                keepMounted
                open={Boolean(this.state.anchor)}
                onClick={()=>this.closeLoggerMenu("anchor")}
              >
                <Link to="/logger/thought">
                <MenuItem onClick={()=>this.closeLoggerMenu("anchor")}>Add Thought</MenuItem>
                </Link>
                <Link to="/logger/stimulusAndThought">
                <MenuItem onClick={()=>this.closeLoggerMenu("anchor")}>
                    {" "}
              Add Stimulus + Thought
            </MenuItem>
                </Link>
                <Link to="/logger/stimulusAndThoughtAndEmotion">
                <MenuItem onClick={()=>this.closeLoggerMenu("anchor")}>
                    Add Stimulus + THought + Emotion
            </MenuItem>
                </Link>
                <Link to="/logger/stimulusAndThoughtAndEmotionAndConcept">
                  <MenuItem onClick={()=>this.closeLoggerMenu("anchor")}>
                    Add Stimulus + Thought + Emotion + Concept
            </MenuItem>
                </Link>
                <Link to="/logger/thoughtAndEmotionAndConcept">
                <MenuItem onClick={()=>this.closeLoggerMenu("anchor")}>
                    Thought + Emotion + Concept
            </MenuItem>
                </Link>
                <Link to="/logger/thoughtAndEmotion">
                <MenuItem onClick={()=>this.closeLoggerMenu("anchor")}>
                    Thought + Emotion
            </MenuItem>
                </Link>
                <Link to="/logger/thoughtAndPart">
                <MenuItem onClick={()=>this.closeLoggerMenu("anchor")}>
                    Thought + Part
            </MenuItem>
                </Link>

                <Link to="/logger/EmotionAndForm">
                <MenuItem onClick={()=>this.closeLoggerMenu("anchor")}>Emotion + Form</MenuItem>
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
            <div>


                <Fab
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  color="secondary"
                  aria-label="add"
                  onClick={(e)=>this.showLoggerMenu(e,"insightAnchor")}
                >
                  <InsertChartIcon />
                </Fab>

            </div>

            <Menu
              id="simple-menu"
              anchorEl={this.state.insightAnchor}
              keepMounted
              open={Boolean(this.state.insightAnchor)}
              onClose={()=>this.closeLoggerMenu("insightAnchor")}
            >
              <Link to="/insights/thoughtTrackerTimeseries">
              <MenuItem onClick={()=>this.closeLoggerMenu("insightAnchor")}>Thought Tracker Timeseries</MenuItem>
              </Link>
              <Link to="/insights/thoughtTimeseries">
              <MenuItem onClick={()=>this.closeLoggerMenu("insightAnchor")}>
                 Thought Timeseries
            </MenuItem>
              </Link>

            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default BottomBar;
