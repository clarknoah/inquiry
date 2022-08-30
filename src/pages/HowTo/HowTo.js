import React, {Component} from 'react';
import "./HowTo.css";
import { TextField, Button } from '@material-ui/core';
import neo4j from "neo4j-driver";

// Class Based React Component
class HowTo extends Component{
  constructor(props){
    super(props);

    // Default CSS class to apply to the Component
    let password = localStorage.getItem("iamPassword");
    this.state = {
      classList: "HowTo",
      password:"",
      saved: !!password,
    };
  }


  setPassword=(e)=>{
    this.setState({password:e.target.value});
  }

  savePassword=()=>{
    if(this.state.password!==""){
      localStorage.setItem("iamPassword", this.state.password);
      this.setState({saved:true});
    }else{
      alert("Password cannot be empty")
    }
  }

  // Runs after Component is loaded in the broswer
  componentDidMount(){}


  // Runs after a component has been updated
  componentDidUpdate(){}


  // Runs right before a component is removed from the DOM
  componentWillUnmount(){}


  render(){
    let passwordSet = localStorage.getItem("iamPassword") !== "";
    let password = localStorage.getItem("iamPassword");
    console.log(localStorage);
    let saved = this.state.saved;
    return(
      <div className={this.state.classList}>
        <h1>You are not logged in</h1>
        <p>Given the sensitive nature of the data being collect, all data needs to be saved to a database locally on your computer. Instructions to setup this database are listed below</p>
        
        <ol style={{textAlign:"left"}}>
          <li>A video tutorial to set this up can be found <a href="https://youtu.be/2EWlQZ3OiY0">here</a></li>
          <li><a href="https://neo4j.com/download/" target="_blank">Download Neo4j Desktop</a></li>
          <li>Follow required steps to download Neo4j Desktop, ensuring you copy the Activation Key</li>
          <li>Install the application on your computer</li>
          <li>Open the Neo4j Desktop application</li>
          <li>Once the application has opened, you should see a blue button that says "Add", click on this and select Local DBMS</li>
          <li>Enter the name of the database you want to create (Defaults to Graph DBMS)</li>
          <li>Enter 123456 as the password for the database (This MUST be set to this value)</li>
          <li>Save the database connection</li>
          <li>Start the database and wait for it to be prepared</li>
          <li>Once your database is ready, click on the "Start" button associated with it</li>
          <li>Once your database has been started, you are now ready to register!</li>
        </ol>
        <p>Registering prior to setting up Neo4j will cause registration to not work. If you encounter problems, 
          please ensure Neo4j Desktop is installed, and that you are accessing this web page through HTTP (inscure). 
          You do not need to worry about the connection being insecure, as all data stays within your computer, you're 
          basically downloading an app when you go to this webpage, and everything else happens within your computer </p>
        {/* {!saved ? (<div className={"PasswordSet"}>
        <TextField
            onChange={this.setPassword}
            name="passwordConfirm"
            id="outlined-basic"
            type="password"
            label="Database Password"
            variant="outlined"
          />
          <Button variant="contained" onClick={this.savePassword}>Submit</Button>
        </div>) : <h4>Password Saved!✅</h4>} */}
      </div>
    );
  }
}

export default HowTo;
