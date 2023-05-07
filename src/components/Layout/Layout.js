import React from "react";
import { Route, Switch, Redirect, withRouter, } from "react-router-dom";
import { Box, IconButton, Link } from '@material-ui/core';
import Icon from '@mdi/react';
//icons
import { mdiFacebook as FacebookIcon, mdiTwitter as TwitterIcon, mdiGithub as GithubIcon, } from '@mdi/js'
// styles
import useStyles from "./styles";
// components
import Header from "../Header";
import Sidebar from "../Sidebar";
// pages
import Dashboard from "../../pages/dashboard";
import Home from "../../pages/home/Home";
import Footer from '../Footer/footer'
import Faq from '../../pages/faq/Feedback'
import Friends from '../../pages/friends/friends'
import Chat from '../../pages/Chat/chat'
// import LiveAvailable from "../../pages/Live/LiveAvailable";
import LiveAvailable from "../../pages/audio/audio";
import GrammerAnalysis from "../../pages/grammer/grammer";


function Layout(props) {
  var classes = useStyles();

  const url1 = "/dashboard/post"

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classes.content}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/home" render={(props) => (
              <Home {...props} fetchUrl={url1} />
            )} />
            <Route path="/app/home" component={Home} />
            <Route path="/app/audio" component={LiveAvailable} />
            <Route path="/app/faq" component={Faq} />
            <Route path="/app/inbox" component={Chat} />
            <Route path="/app/friends" component={Friends} />
            <Route path="/app/typography" component={Dashboard} />
            <Route path="/app/grammer" component={GrammerAnalysis} />
          </Switch>
          <Footer />
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
