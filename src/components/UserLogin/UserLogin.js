import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, TextField, Snackbar } from "@material-ui/core";
import api from "../../services/api.js";
import utils from "../../services/utils.js";
import "./UserLogin.css";
import ModalBoolean from "../../components/ModalBoolean/ModalBoolean";
import InquiryModel from "../../models/GraphModel";

class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classList: "UserLogin",
      email: "",
      password: "",
      open: this.props.open,
      snackbarOpen: false,
      pending: false
    };
    //  this.toggleSnackbar = this.toggleSnackbar.bind(this);
  }
  clickSubmit = () => {
    let { email, password } = this.state;
    let submissionReady = email !== "" && password !== "";
    if (submissionReady) {
      this.loginUser();
    } else {
      this.toggleSnackbar();
    }
  };
  loginUser = () => {
    // console.log("Ready for submission");
    let { email, password } = this.state;
    let userProperties = {
      email: email,
      password: password
    };
    this.setState({pending: true});
    api.login(email,password).then(res => {
      // console.log(res);
      if (res.success) {
        let user = InquiryModel.getExistingModelClass("User",res.user.identity.toNumber(),res.user.properties)
        api.saveDashboard(email);
       // user.login();
        this.onClose();
      } else {
        this.setState({pending: false});
        this.toggleSnackbar();
      }
    });
  };
  handleChange = evt => {
    let value = evt.target.value;
    let key = evt.target.name;
    this.setState({
      [key]: value
    });
  };
  checkForEnterKey = evt => {
    if (evt.key == "Enter") {
      this.clickSubmit();
    }
  };
  toggleSnackbar = () => {
    this.setState({
      snackbarOpen: !this.state.snackbarOpen
    });
  };
  onClose = val => {
    // console.log("user close");
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
        title={"Login"}
      >
        <div className={"UserLogin"}>
          <form noValidate autoComplete="off">
            <TextField
              onChange={this.handleChange}
              onKeyPress={this.checkForEnterKey}
              name="email"
              id="outlined-basic"
              type="email"
              label="Email"
              variant="outlined"
            />
            <TextField
              onChange={this.handleChange}
              onKeyPress={this.checkForEnterKey}
              name="password"
              id="outlined-basic"
              type="password"
              label="Password"
              variant="outlined"
            />
            <Button onClick={this.clickSubmit} variant="contained">
              Login
            </Button>
          </form>
          {this.state.snackbarOpen ? (
            <Snackbar
              anchorOrigin={{
                vertical: "center",
                horizontal: "center"
              }}
              open={this.state.snackbarOpen}
              autoHideDuration={6000}
              onClose={this.toggleSnackbar}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={
                <span id="message-id">
                  Please enter a correct user name and password.
                </span>
              }
            />
          ) : (
            null
          )}
          {this.state.pending === true ? utils.loading() : null}
        </div>
      </ModalBoolean>
    );
  }
}

export default withRouter(UserLogin);
