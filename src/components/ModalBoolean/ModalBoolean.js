import React, { Component } from "react";
import "./ModalBoolean.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

// Class Based React Component
class ModalBoolean extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classList: "ModalBoolean",
      open: false,
      onClose: props.onClose
    };
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = value => {
    // console.log("Handling Close");
    this.state.onClose(value);
    this.setState({
      open: false
    });
  };

  componentDidUpdate() {
    if (this.props.open !== this.state.open) {
      this.setState({
        open: this.props.open
      });
    }
  }

  componentWillUnmount() {}

  render() {
    let actions = (
      <DialogActions>
        <Button
          onClick={() => {
            this.handleClose(false);
            this.props.onCancel();
          }}
          color="primary"
        >
          {this.props.cancelText}
        </Button>
        <Button
          onClick={() => {
            this.handleClose(true);
            this.props.onConfirm();
          }}
          color="primary"
        >
          {this.props.confirmText}
        </Button>
      </DialogActions>
    );

    return (
      <div className={"ModalBoolean"}>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="xl"
        >
          <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>{this.props.children}</DialogContent>
          {this.props.hideActions ? <div /> : actions}
        </Dialog>
      </div>
    );
  }
}
ModalBoolean.defaultProps = {
  cancelText: "Cancel",
  confirmText: "Confirm",
  title: "Do Stuff",
  hideActions: false,
  open: false,
  onConfirm: () => // console.log("Confirmed!"),
  onCancel: () => // console.log("Cancelled!")
};

export default ModalBoolean;
