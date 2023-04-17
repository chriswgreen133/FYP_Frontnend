import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import Popup from 'reactjs-popup';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import FilterListIcon from '@material-ui/icons/FilterList';
import marker from '../../logo.png'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { TextField, InputBase, Button, MenuItem, Select, DialogContent, Dialog, DialogTitle, DialogActions } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Widget from "../../components/Widget/Widget";
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import useStyles from "./styles";
import ProfilePreview from './profilePreview'
import axios from "../../Util/axios"
import * as geolib from 'geolib';
import AuthService from "../../services/auth.service";

let newData = {
  filters: ""
}

export default function Maps(props) {

  let [searchValue, setSearchValue] = useState("");
  var [searchResults, setSearchResults] = useState();
  var [allSchools, setAllSchools] = useState()
  var [selectedBool, setSelectedBool] = useState(false)
  var [reloadProfile, setReloadProfile] = useState(false)

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseReset = () => {
    setOpen(false);
  };

  const user = AuthService.getCurrentUser()

  var classes = useStyles();

  let handleSend = () => {
    newData.search = searchValue
    postSearch()
  }

  // const getAllUsers = useCallback(async (bool) => {
  //   async function fetchData() {
  //     let request;
  //     console.log("inside get all schools")
  //     request = await axios.get("http://localhost:8080/searchSchool/search/")
  //     console.log("request")
  //     setAllSchools(request.data)
  //     return request.data;
  //   }
  //   //And here you call it
  //   fetchData()
  // }, [])

  // useEffect(() => {
  //   getAllUsers()
  //   //getItems().then(data => setItems(data));
  // }, []);

  const postSearch = useCallback(async () => {
    async function fetchData() {
      let request;
      console.log("NewData")
      console.log(newData)
      request = await axios.post("http://localhost:8080/user_management/searchUser/" + newData.search)
      console.log("request")
      console.log(request)
      
      let finalArr = []
      request.data.map((userObj)=>{
        if(userObj._id != user._id){
          finalArr.push(userObj)
        }else{
          console.log("Else")
        }
      })
      setSearchResults(finalArr)
      // setSearchResults(request.data)
      //window.location.reload()
      return request.data;
    }
    fetchData()
  }, [])

  let displayResults
  let selectedUserValue
  let displayProfile

  if (searchResults != undefined) {
    console.log("inside displayresults")
    displayResults = searchResults.map((i) => {
      return (
        <div key={i._id} class={classes.result} onClick={() => {
          AuthService.setSelectedUser({ userID: i._id })
          console.log(i._id)
          setReloadProfile(true)
          // selectedUserValue = i._id
          // setSelectedBool(false)
          setSelectedBool(!selectedBool)

          // displayProfile = <div><ProfilePreview
          // //selectedUser={{userID:selectedUserValue}}
          // />
          // </div> 

          setReloadProfile(false)
          // setSelectedBool(true)
          // setSelectedBool(true)
        }}>
          <img style={{ height: '50px', width: '50px', borderRadius: '50%', marginRight: '10px', marginBottom: '3px' }} src={i.profilePic} />
          <div>
            <p>{i.username}</p>
          </div>
        </div>
      )
    })
  } else {
    console.log("nothing")
  }

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item md={4}>
          <Widget title="User Search" disableWidgetMenu>
            <div className={classes.searchfield}>
              <InputBase className={classes.search} placeholder='Search here...' onChange={e => setSearchValue(e.target.value)}></InputBase>

              {/* <FilterListIcon class={classes.icon} onClick={handleClickOpen} /> */}
              {/* <SearchIcon fontSize='large' class={classes.icon} /> */}
              <Button onClick={() => handleSend()} style={{ height: '30px' }}> <SearchIcon fontSize='large' class={classes.icon} /></Button>
              {/* <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Filters</DialogTitle>
                <DialogActions>
                  <Button onClick={handleCloseReset} color="primary">
                    Reset
                  </Button>
                  <Button onClick={handleClose} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog> */}
            </div>

            <div >
              {
                displayResults
              }
            </div>
          </Widget>
        </Grid>
        <Grid item md={7}>
          <Widget title="Profile Preview" disableWidgetMenu>
            <div>{selectedBool ? <ProfilePreview history={props.history}
            //selectedUser={{userID:selectedUserValue}}
            /> : <Typography variant="h5">No User selected...</Typography>}
            </div>
          </Widget>
        </Grid>
      </Grid>

    </div>

  );
}
