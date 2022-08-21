import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Link, Switch } from "react-router-dom";
import InquiryForm from "./components/InquiryForm/InquiryForm";
import BottomBar from "./components/BottomBar/BottomBar";
import HomePage from "./pages/HomePage/HomePage";
import InsightsHome from "./pages/InsightsHome/InsightsHome";
import ThoughtJournal from "./pages/ThoughtJournal/ThoughtJournal";
import ThoughtLogger from "./pages/ThoughtLogger/ThoughtLogger";
import PracticesHome from "./pages/PracticesHome/PracticesHome";
import ThoughtTracker from "./pages/trackers/ThoughtTracker/ThoughtTracker";
import EmotionTracker from "./pages/trackers/EmotionTracker/ThoughtTracker";
import HedonicTracker from "./pages/trackers/HedonicTracker/ThoughtTracker";
import StLogger from "./pages/ThoughtLogger/StLogger/StLogger";
import StpLogger from "./pages/ThoughtLogger/StpLogger/StLogger";
import SteLogger from "./pages/ThoughtLogger/SteLogger/SteLogger";
import StefLogger from "./pages/ThoughtLogger/StefLogger/StefLogger";
import TeLogger from "./pages/ThoughtLogger/TeLogger/TeLogger";
import TpLogger from "./pages/ThoughtLogger/TpLogger/TpLogger";
import TefLogger from "./pages/ThoughtLogger/TefLogger/TefLogger";
import TfLogger from "./pages/ThoughtLogger/TfLogger/TfLogger";
import TopBar from "./components/TopBar/TopBar";
import ThoughtTimeseries from "./components/ThoughtTimeseries/ThoughtTimeseries";
import ThoughtTrackerTimeseries from "./components/ThoughtTrackerTimeseries/ThoughtTrackerTimeseries";
import {utils} from "stillness-utils";

class App extends React.Component {
  constructor(props) {
    super(props);


    // Default CSS class to apply to the Component

    this.state = {
      classList: "UserRegistration",
      loggedIn: this.getLoggedInStatus()
    };
  }

  getLoggedInStatus=()=>{
    return localStorage.getItem("activeUser_json")!== null && localStorage.getItem("activeUser_json") !== undefined;
  }

  updateUserStatus=()=>{

    if (this.state.loggedIn !== true && this.getLoggedInStatus()) {

      this.setState({
        loggedIn: true
      })
    } else if (this.state.loggedIn === true && !this.getLoggedInStatus()) {

      this.setState({
        loggedIn: false
      })
    }
  }

  render() {

    return (
      <div className="App">
        <main>
          <TopBar update={this.updateUserStatus}/>

          {this.state.loggedIn ? <Switch>
            <Route
              path="/journal"
              render={(routerProps) => {
                return <ThoughtJournal {...routerProps} />;
              }}
            />
            <Route
              path="/trackers/thought"
              render={(routerProps) => {
                return <ThoughtTracker {...routerProps} />;
              }}
            />
            <Route
              path="/trackers/emotion"
              render={(routerProps) => {
                return <EmotionTracker {...routerProps} />;
              }}
            />
            <Route
              path="/trackers/hedonic"
              render={(routerProps) => {
                return <HedonicTracker {...routerProps} />;
              }}
            />
            <Route
              path="/logger/thought"
              render={(routerProps) => {
                return <ThoughtLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/stimulusAndThought"
              render={(routerProps) => {
                return <StLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/stimulusAndThoughtAndPart"
              render={(routerProps) => {
                return <StpLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/stimulusAndThoughtAndEmotion"
              render={(routerProps) => {
                return <SteLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/stimulusAndThoughtAndEmotionAndPart"
              render={(routerProps) => {
                return <SteLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/stimulusAndThoughtAndEmotionAndConcept"
              render={(routerProps) => {
                return <StefLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/thoughtAndEmotionAndConcept"
              render={(routerProps) => {
                return <TefLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/thoughtAndEmotion"
              render={(routerProps) => {
                return <TeLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/thoughtAndPart"
              render={(routerProps) => {
                return <TpLogger {...routerProps} />;
              }}
            />
            <Route
              path="/logger/emotionAndForm"
              render={(routerProps) => {
                return <TfLogger {...routerProps} />;
              }}
            />
            <Route
              path="/inquiry"
              render={(routerProps) => {
                return <InquiryForm {...routerProps} />;
              }}
            />
            <Route
              exact
              path="/insights/thoughtTrackerTimeseries"
              render={(routerProps) => {
                return <ThoughtTrackerTimeseries {...routerProps} />;
              }}
            />
            <Route
            exact
              path="/insights/thoughtTimeseries"
              render={(routerProps) => {
                return <ThoughtTimeseries {...routerProps} />;
              }}
            />
            <Route
              path="/"
              render={(routerProps) => {
                return <HomePage {...routerProps} />;
              }}
            />
          </Switch> :
            <div>Please Login</div>
          }
        </main>
        <BottomBar />
      </div>
    );
  }
}

export default App;
