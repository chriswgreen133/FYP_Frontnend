import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
  Link
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import RadioGroup from "@material-ui/core/RadioGroup"
import Radio from "@material-ui/core/Radio"
import FormControlLabel from "@material-ui/core/FormControlLabel"
// styles
import useStyles from "./styles";
import AuthService from "../../services/auth.service";
import axios from "../../Util/axios"
import { CometChat } from "@cometchat-pro/chat"


// logo
// import logo from "../../logo.png";
// import google from "../../images/google.svg";

// context
import { useUserDispatch, loginUser, admin } from "../../context/UserContext";
import Widget from "../../components/Widget/Widget";

let user = {
  email: "",
  username: "",
  phoneNumber: 0,
  password: ""
}

let userLogin = {
  email: "",
  password: ""
}

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [nameValue, setNameValue] = useState("");
  var [emailValue, setEmailValue] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [phoneValue, setphoneValue] = useState();
  var [passwordValue, setPasswordValue] = useState("");
  var [typeValue, setTypeValue] = useState('')
  var [users, setUsers] = useState([])
  var [userId, setUserId] = useState('')
  var [allSchools, setAllSchools] = useState()
  let signupBool;

  const signUpSubmit = () => {
    if (emailValue === "" || nameValue === ""
      || phoneValue === 0 || passwordValue === "") {
      console.log('error, some field is empty')
      alert('error, some fields empty')
    } else {
      console.log("inside signUpSubmit")

      user.email = emailValue
      user.username = nameValue
      user.phoneNumber = phoneValue
      user.password = passwordValue

      console.log('inside signup')
      console.log(user)
      signupBool = true
      sendRequest(signupBool)
    }
  }

  const loginSubmit = () => {
    if (emailValue === "" || passwordValue === "") {
      console.log('error, some field is empty')
      alert('error, some fields empty')
    } else {

      console.log("inside loginSubmit")

      userLogin.email = emailValue
      userLogin.password = passwordValue

      console.log(userLogin)
      signupBool = false
      sendRequest(signupBool)
    }
  }

  const sendRequest = useCallback(async (bool) => {
    console.log("inside useEffect")
    async function fetchData() {
      console.log('inside fetchdata')
      console.log(bool)
      let request;

      if (bool === true) {
        console.log("inside signUp")
        AuthService.register(user).then(
          response => {
            console.log(response.data.message)

            let authKey = "eec86b7681fa64295a4ce0b9c2a157885395785f";
            var uid = response.data._id;
            var name = response.data.username;

            var user = new CometChat.User(uid);

            user.setName(name);
            console.log("Creating User in Comet chat")
            CometChat.createUser(user, authKey).then(
              user => {
                console.log("user created", user);
              }, error => {
                console.log("error", error);
              }
            )
            setActiveTabId(0)
          },
          error => {
            console.log("SignUp Error")
            alert("Wrong Email or Password")
            console.log(error)
          }
        );
      }

      else if (bool === false) {
        console.log("inside Login")
        console.log(userLogin)
        AuthService.login(userLogin).then(
          (response) => {
            var UID = response._id
            var authKey = "eec86b7681fa64295a4ce0b9c2a157885395785f";

            CometChat.login(UID, authKey).then(
              user => {
                console.log("Login Successful:", { user });
              },
              error => {
                console.log("Login failed with exception:", { error });
              }
            );
            props.history.push("/app/home");
            // window.location.reload();
          },
          error => {
            console.log(error)
            alert("Wrong Email or Password")
          }
        );
      } else {
        console.log("wrong boolean value")
      }
      console.log(request)
      return request;
    }
    //And here you call it
    fetchData()
  }, [])

  return (
    <div>
      <Grid container className={classes.container}>
        <div className={classes.formContainer}>
          <Widget disableWidgetMenu>
            <div className={classes.form}>
              <Tabs
                value={activeTabId}
                onChange={(e, id) => setActiveTabId(id)}
                indicatorColor="primary"
                textColor="primary"
                classes={{ indicator: classes.indicator, root: classes.tabs }}
                centered
              >
                <Tab label="Login" classes={{ root: classes.tab }} />
                <Tab label="New User" classes={{ root: classes.tab }} />
              </Tabs>
              {activeTabId === 0 && (
                <React.Fragment>
                  <Typography variant="h6" className={classes.greeting}>
                    Already Registered?
              </Typography>
                  <Typography variant="h2" className={classes.greeting}>
                    Login Here!
              </Typography>


                  <div className={classes.formDividerContainer}>
                    <div className={classes.formDivider} />
                    <Typography className={classes.formDividerWord}></Typography>
                    <div className={classes.formDivider} />
                  </div>
                  <Fade in={error}>
                    <Typography color="secondary" className={classes.errorMessage}>
                      Something is wrong with your login or password :(
                </Typography>
                  </Fade>
                  <TextField
                    id="email"
                    InputProps={{
                      classes: {
                        underline: classes.textFieldUnderline,
                        input: classes.textField,
                      },
                    }}
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                    margin="normal"
                    placeholder="Email Adress"
                    type="email"
                    fullWidth
                  />
                  <TextField
                    id="password"
                    InputProps={{
                      classes: {
                        underline: classes.textFieldUnderline,
                        input: classes.textField,
                      },
                    }}
                    value={passwordValue}
                    onChange={e => setPasswordValue(e.target.value)}
                    margin="normal"
                    placeholder="Password"
                    type="password"
                    fullWidth
                  />

                  <Button
                    onClick={() =>
                      loginSubmit()
                    }

                    disabled={
                      emailValue.length === 0 || passwordValue.length === 0 || typeValue === undefined
                    }
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Login
                  </Button>
                </React.Fragment>
              )}
              {activeTabId === 1 && (
                <React.Fragment>
                  <Typography variant="h6" className={classes.greeting}>
                    New to Speech Wizard?
              </Typography>
                  <Typography variant="h2" className={classes.greeting}>
                    Register Here!
              </Typography>
                  <div className={classes.formDividerContainer}>
                    <div className={classes.formDivider} />
                    <Typography className={classes.formDividerWord}></Typography>
                    <div className={classes.formDivider} />
                  </div>
                  <TextField
                    id="name"
                    InputProps={{
                      classes: {
                        underline: classes.textFieldUnderline,
                        input: classes.textField,
                      },
                    }}
                    value={nameValue}
                    onChange={e => setNameValue(e.target.value)}
                    margin="normal"
                    placeholder="Full Name"
                    type="text"
                    fullWidth
                  />
                  <TextField
                    id="email"
                    InputProps={{
                      classes: {
                        underline: classes.textFieldUnderline,
                        input: classes.textField,
                      },
                    }}
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                    margin="normal"
                    placeholder="Email Adress"
                    type="email"
                    fullWidth
                  />
                  <TextField
                    id="phone"
                    InputProps={{
                      classes: {
                        underline: classes.textFieldUnderline,
                        input: classes.textField,
                      },
                    }}
                    value={phoneValue}
                    onChange={e => setphoneValue(e.target.value)}
                    margin="normal"
                    placeholder="Phone number"
                    type="number"
                    fullWidth
                  />
                  <TextField
                    id="password"
                    InputProps={{
                      classes: {
                        underline: classes.textFieldUnderline,
                        input: classes.textField,
                      },
                    }}
                    value={passwordValue}
                    onChange={e => setPasswordValue(e.target.value)}
                    margin="normal"
                    placeholder="Password"
                    type="password"
                    fullWidth
                  />
                  <div className={classes.creatingButtonContainer}>
                    {isLoading ? (
                      <CircularProgress size={26} />
                    ) : (
                      <Button

                        onClick={() => { signUpSubmit() }}

                        disabled={
                          emailValue.length === 0 ||
                          passwordValue.length === 0 ||
                          nameValue.length === 0 ||
                          typeValue === undefined
                        }
                        size="large"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className={classes.createAccountButton}
                      >
                        Create your account
                      </Button>
                    )}
                  </div>

                </React.Fragment>
              )}
            </div>
          </Widget>
        </div>

      </Grid>
    </div>
  );
}

export default withRouter(Login);
