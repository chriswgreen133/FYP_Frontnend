import React from "react";
import { HashRouter, Route, Switch, Redirect, Router, BrowserRouter } from "react-router-dom";
import { CometChat } from "@cometchat-pro/chat";
// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
//import Login from "../pages/login/Login";
import Login from '../pages/NewLogin/Login'
import userProfile from '../pages/UserProfile/UserProfile'

// context
import { useUserState } from "../context/UserContext";
import Dashboard from "../pages/dashboard/Dashboard";
import ProfilePage from "../pages/profilePage/profilePage"
import uploadImage from '../pages/uploadImage/upload'

import AuthService from "../services/auth.service"

import superAdminlogin from '../pages/SuperAdmin/login/Login'
import SuperAdmin from './LayoutSuperAdmin'
import SuperAdminDashboard from '../pages/SuperAdmin/Dashboard'

import Faq from '../pages/faq/Feedback'

export default function App() {
  // global
  var { isAuthenticated } = useUserState();
  let url1 = '/user_management/login';
  let url2 = '/user_management/signup';

  const user = AuthService.getCurrentUser()
  console.log(user)

  var { isAuthenticated } = useUserState();
  const appID = "23705698cec0a72a";
  const region = "eu";
  const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
  CometChat.init(appID, appSetting).then(
    () => {
      console.log("Initialization completed successfully");
      // You can now call login function.
    },
    error => {
      console.log("Initialization failed with error:", error);
      // Check the reason for error and take appropriate action.
    }
  );

  if (user != null) {

    const authKey = "b6890e4cb642e245405fe3317205997481daca78";
    const uid = user._id;

    CometChat.login(uid, authKey).then(
      user => {
        console.log("Login Successful:", { user });
      },
      error => {
        console.log("Login failed with exception:", { error });
      }
    );
  }


  return (
    <HashRouter>
      <Switch>
        <Route path="/profilePage" render={(props) => (
          <ProfilePage {...props} />
        )} />
        <Route exact path="/uploadImage" component={uploadImage} />
        {/* <Route exact path="/" component={Landing} /> */}
        {/* <Route exact path="/" render={(props) => (
          <Landing {...props} fetchUrl1={url1} fetchUrl2={url2} />
        )} /> */}
        {/* <Route exact path="/landing" component={Landing} /> */}
        <Route exact path="/" render={(props) => (
          <Login {...props} fetchUrl1={url1} fetchUrl2={url2} />
        )} />
        {/* <Route exact path="/login" render={(props) => (
          <Login {...props} fetchUrl1={url1} fetchUrl2={url2} />
        )} /> */}
        <Route path="/app/dashboard" component={Dashboard} />
        <Route path="/app" component={Layout} />
        <Route path="/userProfile" component={userProfile} />

        <Route exact path="/superAdmin" component={superAdminlogin} />
        <Route path="/superAdminDashboard" component={SuperAdmin} />
        <Route path="/superAdminDashboard/dashboard" component={SuperAdminDashboard} />
        {/* <Route path="/superAdminLayout/superAdminDashboard" component={SuperAdminDashboard} /> */}

        {/* <PublicRoute path="/login" render={(props) => (
          <Login {...props} fetchUrl={url1} fetchUrl2={url2} />
        )} /> */}
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
