import React, { Component } from "react";
import "./PerceptionCollector.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ManifestedPerception from "../ManifestedPerception/ManifestedPerception";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
/*
  This component should accept as inputs a date prop which will determine 
  whether thoughts are marked as in the moment or as in the past 
  If no date is added. 

  If no date prop is added, the component should render a checkbox option 
  in which the user themselve can determine if the thoughts arising are new 
  or old. 

  It should accept a prop of of perception type, which will ultimately get 
  fed into the manifestedPerception component

  On the left hand side, the component will have the input field for adding
  thoughts. 

  On the right hand side, the component should have a list (which will be 
   scrollable if it goes past a certain point). The list should contain 
   The individual thoughts that are added. 

  The component should accept a prop called "unique", which when it is added, 
  will enforce that only unique props can be added. 

  Each list item for each added perception should contain the perception 
  itself, as well as a button to remove from the list. 

  Everytime the list containing the thoughts added changes, it should return 
  the new list to the parent component
*/

// Class Based React Component
class PerceptionCollector extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    let list = [];
    if (props.list !== undefined) {
      list = props.list;
    }
    // Default CSS class to apply to the Component
    this.state = {
      classList: "PerceptionCollector",
      list: list,
    };
  }

  updateList = (action) => {
    let list = this.state.list;
    this.props.updateList(list, action);
  };

  addToList = (a, m) => {
    let perception = [a, m];
    if (this.props.subRelationships !== undefined) {
      m.collectorList = [];
    }
    let list = this.state.list;
    if (this.props.unique && this.checkForUnique(perception[0])) {
      list.push(perception);
      this.setState(
        {
          list: list,
        },
        () => {
          this.updateList("add");
        }
      );
    } else if (this.props.unique !== true) {
      list.push(perception);
      this.setState(
        {
          list: list,
        },
        () => {
          this.updateList("add");
        }
      );
    }
  };

  addToSubList = () => {};

  removeFromSubList = () => {};

  updateSubList = (subList, mainIndex) => {
    // console.log(subList, mainIndex);
    let list = this.state.list;
    list[mainIndex][1].collectorList = subList;
    this.setState(
      {
        list: list,
      },
      () => {
        this.updateList();
      }
    );
  };

  checkForUnique = (perception) => {
    let isUnique =
      this.state.list.filter((val) => {
        return (
          val[0].properties.perception.value.toLowerCase().trim() ===
          perception.properties.perception.value.toLowerCase().trim()
        );
      }).length === 0;
    if (isUnique == false) {
      // console.log(`${this.props.label} is duplicative`);
    }
    return isUnique;
  };

  removeFromList = (index) => {
    let list = this.state.list;
    list.splice(index, 1);
    this.setState(
      {
        list: list,
      },
      () => {
        this.updateList("remove");
      }
    );
  };

  getAccordian = () => {
    // console.log(this.state.list, this.props);
    let accordians = this.state.list.map((label, index) => {
      let list = label[1].collectorList;
      return (
        <Accordion className={"PerceptionsCollector-content"}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
          >
            <Typography className="PerceptionsCollector-header">
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => this.removeFromList(index)}
              >
                <DeleteIcon />
              </IconButton>
              {label[0].properties.perception.value}
            </Typography>
            <Chip label={label[1].collectorList.length} />
          </AccordionSummary>
          <AccordionDetails>
            <PerceptionCollector
              label={this.props.subRelationships.label}
              queryKey={this.props.subRelationships.queryKey}
              date={this.props.subRelationships.date}
              unique={this.props.subRelationships.unique}
              list={list}
              updateList={(list) => {
                this.updateSubList(list, index);
              }}
            />
          </AccordionDetails>
        </Accordion>
      );
    });
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {accordians}
      </div>
    );
  };

  getList = () => {
    return (
      <List
        className={"PerceptionCollector-list"}
        component="nav"
        aria-label="main mailbox folders"
      >
        {this.state.list.map((item, index) => {
          return (
            <ListItem key={item[1].variable}>
              <ListItemText primary={item[1].properties.perception.value} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => this.removeFromList(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    );
  };

  determineCollector = () => {
    if (this.props.subRelationships !== undefined) {
      return this.getAccordian();
    } else {
      return this.getList();
    }
  };

  render() {
    return (
      <div className={this.state.classList}>
        <ManifestedPerception
          className="PerceptionCollector-flex"
          label={this.props.label}
          queryKey={this.props.queryKey}
          submitPerception={this.addToList}
          date={this.props.date}
          hideNewThought
        />
        {this.state.list.length > 0 ? this.determineCollector() : null}
      </div>
    );
  }
}

export default PerceptionCollector;
