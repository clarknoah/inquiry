
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
    title:"Track Realtime Perceptions",
    content:"Use iAm to record thoughts per minute, hedonic affect, concept meaning, and so much more"
  },
  {
    title:"Visualize your data",
    content:"Using a series of visualizations, you can track your own mental activity over time to see how things such as diet, meditation, and psychoactive substances affect your mind"
  },
  {
    title:"Question your thoughts",
    content:"Using a variety of disciplines including Cognitive Behavior Therapy (CBT), Internal Family Systems (IFS), The Work, and the Ideal Parent Figure Protocol (IPF), actively question and change maladaptive thoughts"
  }
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
      <Typography variant="h3">The Ultimate Self Knowledge Research Platform</Typography>
        <div style={cardContainer}>
            {cards.map(val=><HCard content={val.content} title={val.title}/>)}
        </div>
      </div>
    );
  }
}

export default HomePage;
