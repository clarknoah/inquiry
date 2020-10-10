import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Link, Switch} from 'react-router-dom';
import InquiryForm from "./components/InquiryForm/InquiryForm";
import BottomBar from "./components/BottomBar/BottomBar";
import HomePage from "./pages/HomePage/HomePage";
import InsightsHome from "./pages/InsightsHome/InsightsHome";
import ThoughtJournal from "./pages/ThoughtJournal/ThoughtJournal";
import ThoughtLogger from "./pages/ThoughtLogger/ThoughtLogger";
import PracticesHome from "./pages/PracticesHome/PracticesHome";

function App() {
  return (
    <div className="App">
      <main>
      <header>
        <h1>Inquiry</h1>
        <Link exact to="/inquiry" render={()=>{
          return <div/>
        }}>Link</Link>
      </header>
      <Switch>
      <Route path="/journal" render={
        routerProps=>{
          return <ThoughtJournal {...routerProps}/>
        }
      }/>
      <Route path="/practices" render={
        routerProps=>{
          return <PracticesHome {...routerProps}/>
        }
      }/>
      <Route path="/logger" render={
        routerProps=>{
          return <ThoughtLogger {...routerProps}/>
        }
      }/>
      <Route path="/inquiry" render={
        routerProps=>{
          return <InquiryForm {...routerProps}/>
        }
      }/>
      <Route path="/insights" render={
        routerProps=>{
          return <InsightsHome {...routerProps}/>
        }
      }/>
      <Route path="/" render={
        routerProps=>{
          return <HomePage {...routerProps}/>
        }
      }/>
      </Switch>
      </main>
      <BottomBar/>
    </div>
  );
}

export default App;
