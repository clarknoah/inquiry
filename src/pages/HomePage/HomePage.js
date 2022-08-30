
import React, {Component} from 'react';
import "./HomePage.css";
import api from "../../services/api";
import {Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
// Class Based React Component

let changeLog = [
  {
    date:"2022-08-26",
    changes: [
      "Added video tutorials to explain how to use the application",
      "Shortest Thought Gap and Longest Thought Gap values are now reporting correctly",
      "Users can now set hedonic tone at any point while inputting their perception",
      "Application automatically updates dashboard",
      "Users can now successfully submit zero perceptions without an error being thrown"
    ]
  }
]


let HCard = ({title, content}) => {
  let style = {
    margin: "20px",
    minWidth: "33%"
  }
  return (   
    <Card style={style}>
    <CardActionArea>
      <CardMedia
        image="/static/images/cards/contemplative-reptile.jpg"
        title="Contemplative Reptile"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {content}
        </Typography>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button size="small" color="primary">
        Share
      </Button>
      <Button size="small" color="primary">
        Learn More
      </Button>
    </CardActions>
  </Card>
  )
}

let cardContainer = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "flex-start",
  height:"100%"

}

let cards = [
  {
    title:"Track Sense Phenomena",
    content:(
      <div>
        <p>Use iAm to track subjective experience in real time</p>
        <a href="https://youtu.be/eCP2UGvzIls">Video tutorial for how to use iAm Trackers</a>
        </div>
      )
  },
  {
    title:"Visualize your data",
    content:(
      <div>
        <p>There are several visualizers we support, and more coming soon!</p>
        <a href="https://youtu.be/lRQ-OruAzz8">Video tutorial for how to use the visualizers</a>
        </div>
      )
  }
  // ,
  // {
  //   title:"Question your thoughts",
  //   content:"Using a variety of disciplines including Cognitive Behavior Therapy (CBT), Internal Family Systems (IFS), The Work, and the Ideal Parent Figure Protocol (IPF), actively question and change maladaptive thoughts"
  // }
  ]

class HomePage extends Component{
  constructor(props){
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "HomePage"
    };
  }


  render(){

    return(
      <div className={this.state.classList}>
      <Typography variant="h3">iAm: the Phenomenology Research Platform</Typography>
        <div style={cardContainer}>
            {cards.map(val=><HCard content={val.content} title={val.title}/>)}
        </div>
        <div style={cardContainer}>
        <HCard
          title={"Change Log"}
          content={(
            <div>
              {changeLog.map(val=>{
                return (<div style={{textAlign:"left"}}>
                  <h3>{val.date}</h3>
                  <ul style={{textAlign:"left"}}>
                    {val.changes.map(change=><li>{change}</li>)}
                  </ul>
                </div>)
              })}
            </div>
          )
          }
        />
        </div>
      </div>
    );
  }
}

export default HomePage;
