
import React, { Component } from 'react';
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
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import ModalBoolean from "../ModalBoolean/ModalBoolean";
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
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "TopBar",
      auth: false,
      anchorEl: null,
      open: false,
      userLoginShow:false,
      userRegistrationShow:false
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
  }

  render() {
    let auth = this.checkAuth();
    return (
      <div className={this.state.classList}>
        <UserLogin
          open={this.state.userLoginShow}
          onClose={() => {
            this.setState({ userLoginShow: false });
          }}
        />
        <UserRegistration
          open={this.state.userRegistrationShow}
          onClose={() => {
            this.setState({ userRegistrationShow: false });
          }}
        />
        <AppBar position="static">
          <Toolbar>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" >
                iAm
          </Typography>
            </div>
            {auth && (
              <div>
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

export default TopBar;
