
import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import "./TopBar.css";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import UserLogin from "../UserLogin/UserLogin";
import UserRegistration from "../UserRegistration/UserRegistration";
// Class Based React Component


let userField = {
  backgroundColor: "white",
  borderRadius: "20px",
  padding: "0 5px",
}

class TopBar extends Component {
  constructor(props) {
    super(props);
    // console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "TopBar",
      auth: false,
      anchorEl: null,
      open: false,
      userLoginShow:false,
      userRegistrationShow:false,
      connected:true
    };
  }


  checkAuth=()=>{
    if(localStorage.getItem("activeUser_id")!==null){
      return true
    }else{
      return false
    }
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false
    })
  }

  handleMenu = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
      open: true
    })
  }

  login = () => {

  }

  logout=()=>{
    localStorage.clear();
    this.handleClose();
    this.props.update();
    this.props.history.push("/");
  }

  render() {
    let auth = this.checkAuth();
    let connected = this.state.connected;
    //let
    return (
      <div className={this.state.classList}>
        <UserLogin
          open={this.state.userLoginShow}
          onClose={() => {
            // console.log('hello world');
            this.setState({ userLoginShow: false },this.props.update);
          }}
        />
        <UserRegistration
          open={this.state.userRegistrationShow}
          onClose={() => {

            this.setState({ userRegistrationShow: false }, this.props.update);
          }}
        />
        <AppBar position="static">
          <Toolbar>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
          <img src="./images/iAmLogo.svg" className="iAm-logo"/>
          <Link to="/" style={{textDecoration:"none", color:"inherit"}}>
              <Typography variant="h6" >
                iAm (Version 0.0.1)
          </Typography>
          </Link>
            </div>
            {!connected && (
              <div>
                App is not connected to database, please turn it on!
              </div>
            )}
            {auth && (
              <div style={{display:"flex",alignItems:"center"}}>
                <Typography>{localStorage.getItem("activeUser_firstName")}</Typography>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={this.state.open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
            {!auth && (
              <div>
              <Button color="inherit" onClick={()=>this.setState({userLoginShow:true})}>Login</Button>
              <Button color="inherit" onClick={()=>this.setState({userRegistrationShow:true})}>Register</Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(TopBar);
;
