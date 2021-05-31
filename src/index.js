import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import reducers from './reducers/reducers';
import Header from './header/header' 
import Footer from './components/footer';

const rootReducers = combineReducers({
  reducers: reducers,
});

const store = createStore(rootReducers);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <header/>
      <App />
      <Header />
     <Footer/>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
 
);
