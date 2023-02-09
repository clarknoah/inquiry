
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  BrowserRouter as Router
} from "react-router-dom"
import * as serviceWorker from './serviceWorker';
import TagManager from 'react-gtm-module';


const tagManagerArgs = {
  gtmId: "GTM-5K2NLH4"
}
TagManager.initialize(tagManagerArgs)





ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
