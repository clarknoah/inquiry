import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Link} from 'react-router-dom';
import InquiryForm from "./components/InquiryForm/InquiryForm";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Inquiry</h1>
        <Link exact to="/inquiry" render={()=>{
          return <div/>
        }}>Link</Link>
      </header>
      <main>
      <Route path="" render={
        routerProps=>{
          return <InquiryForm {...routerProps}/>
        }
      }/>
      </main>
      <footer>hi</footer>
    </div>
  );
}

export default App;
