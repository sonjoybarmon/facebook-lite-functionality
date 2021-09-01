import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import "./App.css";
import setAuthToken from "./utils/setAuthToken";
import { logoutUser, setCurrentUser } from "./redux/actions/authAction";
import store from "./redux/store/store";
import { clearCurrentProfile } from "./redux/actions/profileAction";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/common/PrivateRoute";

// check for token validation
if (localStorage.token) {
  // set auth token header auth
  setAuthToken(localStorage.token);
  // decode token and get user info and exp
  const decoded = jwt_decode(localStorage.token);
  // setUser and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // logout user
    store.dispatch(logoutUser());
    // Todo : clear current profile
    store.dispatch(clearCurrentProfile());
    // redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
