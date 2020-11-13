
import React, {Component} from 'react';
import "./ModalLink.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
// Class Based React Component
class ModalLink extends Component{
  constructor(props){
    super(props);
    console.log(props);


        this.state = {
          classList: "ModalLink",
          open: false,
          onClose:props.onClose
        };
      }

      handleClickOpen = () => {
        this.getCategories();
        this.setState({
          open: true
        });
      };

      handleClose = (value) => {
        // this.setState({
        //   open: false,
        //   newCategory:false
        // },()=>{
        //   this.state.onClose(value);
        // });
      };

      takeAction = ()=>{

      }


      // Runs after Component is loaded in the broswer
      componentDidMount(){}


      // Runs after a component has been updated
      componentDidUpdate(){
        if (this.props.open !== this.state.open){
          this.setState({
            open: this.props.open
          })
        }
      }

  render(){
    return(
      <div className={'ModalLink'}>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            {this.props.children}
          </DialogContent>
          <DialogActions>
            <Link to={this.props.to}><Button color="primary">
              {this.props.text}
            </Button></Link>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
ModalLink.defaultProps = {
  title:'',
  to:"/",
  text:"Go to Home"
}

export default ModalLink;
