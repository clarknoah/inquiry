import React, { Component } from "react";
import "./UserRegistration.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import { withRouter } from "react-router-dom";
import api from "../../services/api";
import utils from "../../services/utils.js";
import { Link } from "react-router-dom";
import ModalBoolean from "../../components/ModalBoolean/ModalBoolean";
import user from "../../services/user";
import InquiryModel from "../../models/GraphModel";
// Class Based React Component

class UserRegistration extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "UserRegistration",
      firstName: "",
      lastName: "",
      username: "",
      date: "2000-01-01",
      email: "",
      password: "",
      passwordConfirm:"",
      agreement:false,
      open: this.props.open
    };
  }

  clickSubmit = () => {
    let { firstName, lastName, date, email, password, passwordConfirm, agreement } = this.state;
    let submissionReady =
      firstName !== "" &&
      lastName !== "" &&
      date !== "" &&
      email !== "" &&
      password !== "" &&
      password.length > 5 && 
      password === passwordConfirm;
    if (submissionReady) {
      this.submitNewUser();
    }else{
      alert("Ensure your password is at least 6 characters, all fields are filled out, and you agree to our Terms of Service and Privacy Policy");
    }
  };

  submitNewUser = () => {
    console.log("Ready for submission");
    let { firstName, lastName, date, email, password, username } = this.state;
    let userProperties = {
      firstName: firstName,
      lastName: lastName,
      birthDate: date,
      email: email,
      password: password
    };
    console.log(userProperties);
    try{
      api.registerUser(userProperties).then(res => {
        console.log(res);
        if(res.success){
          let user = InquiryModel.getExistingModelClass("User",res.user.identity.toNumber(),res.user.properties)
          user.login();
          this.onClose();
        }else{
          console.log(res);
        }
      });
    }catch(err){
      console.log(err);
    }

  };

  handleChange = evt => {
    let value = evt.target.value;
    let key = evt.target.name;
    this.setState({
      [key]: value
    });
  };

  onClose = val => {
    console.log("user close");
    this.setState(
      {
        open: false
      },
      () => {
        this.props.onClose();
      }
    );
  };

  componentDidUpdate(props) {
    console.log("UserRegistration Update", this.state.open, this.props.open);
    if (this.state.open !== this.props.open) {
      this.setState({
        open: this.props.open
      });
    }
  }

  render() {
    return (
      <ModalBoolean
        onClose={this.onClose}
        open={this.state.open}
        hideActions={true}
        title={"Sign Up!"}
      >
        <link
          href="https://fonts.googleapis.com/css?family=Reem+Kufi&display=swap"
          rel="stylesheet"
        />
        <h1> User Registration</h1>

        <form noValidate autoComplete="off" className={this.state.classList}>
          <TextField
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleChange}
            label="First Name"
            variant="outlined"
          />

          <TextField
            onChange={this.handleChange}
            name="lastName"
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
          />

          <TextField
            onChange={this.handleChange}
            name="email"
            id="outlined-basic"
            type="email"
            label="Email"
            variant="outlined"
          />

          <TextField
            onChange={this.handleChange}
            name="password"
            id="outlined-basic"
            type="password"
            label="Password"
            variant="outlined"
          />
          <TextField
            onChange={this.handleChange}
            name="passwordConfirm"
            id="outlined-basic"
            type="password"
            label="Confirm Password"
            variant="outlined"
          />

          <TextField
            onChange={this.handleChange}
            name="date"
            id="datetime-local"
            label="Birth Date"
            type="date"
            defaultValue="2000-01-01"
            InputLabelProps={{
              shrink: true
            }}
          />

          <Button onClick={this.clickSubmit} variant="contained">
            Submit
          </Button>
        </form>
      </ModalBoolean>
    );
  }
}

export default withRouter(UserRegistration);
