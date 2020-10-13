
import React, {Component} from 'react';
import "./PracticesHome.css";


// Class Based React Component
class PracticesHome extends Component{
  constructor(props){
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "PracticesHome"
    };
  }


  render(){
    return(
      <div className={this.state.classList}>
        PracticesHome
      </div>
    );
  }
}

export default PracticesHome;
