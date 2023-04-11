import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputBase, MenuItem, Select, TextField } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import marker from './mapMarker.png'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FilterListIcon from '@material-ui/icons/FilterList';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import SearchIcon from '@material-ui/icons/Search';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer,useMapEvents, Popup } from 'react-leaflet';
import Widget from "../../components/Widget/Widget";
import AuthService from "../../services/auth.service";
import axios from "../../Util/axios";
import useStyles from "./styles";


const customMarker = new L.icon({
  iconUrl: require("./mapMarker.png"),
  iconSize: [25, 25],
  iconAnchor: [0, 0],
});

const markers = [
  { key: 'marker1', position: [33.647895, 73.028724], content: 'My first popup' },
  { key: 'marker2', position: [33.6879129, 73.0314367], content: 'My second popup' },
  { key: 'marker3', position: [33.652868, 73.157333], content: 'My third popup' },
  { key: 'marker3', position: [29.9248291, 70.945715], content: 'My third popup' },
  { key: 'marker3', position: [30.857321, 69.240635], content: 'My third popup' },
]
const Schools = [
  { id: '1', name: 'Army Public School, Islamabad', location: 'I-8 markaz, Islamabad' },
  { id: '2', name: 'Pak Turk International School, Islamabad', location: 'Taramri chowk, Islamabad' },
  { id: '3', name: 'Grafton School, Islamabad', location: 'Taramri chowk, Islamabad' }
]

let currentLocation = {

}

let newData = {
  filters: ""
}

export default function Maps(props) {

  // const [value, setValue] = React.useState('Co-Education');
  // const [value2, setValue2] = React.useState('Primary');
  // const [value3, setValue3] = React.useState('Matric/Fsc');
  let [searchValue, setSearchValue] = useState("");
  var [searchResults, setSearchResults] = useState();
  var [allSchools, setAllSchools] = useState()

  //fee={min:0,max:5}
  //distance={min:0,max:5}

  var [fee, setFee] = useState();
  var [feeMin, setFeeMin] = useState();
  var [feeMax, setFeeMax] = useState();
  var [distance, setDistance] = useState();
  // var [schoolType, setSchoolType] = useState('Co-Education');
  // var [educationLevel, setEducationLevel] = useState('Primary');
  // var [educationType, setEducationType] = useState('Matric/Fsc')
  var [schoolType, setSchoolType] = useState();
  var [educationLevel, setEducationLevel] = useState();
  var [educationType, setEducationType] = useState()
  //var [currentLocation, setCurrentLocation] = useState()
  const [open, setOpen] = React.useState(false);

  const handleCloseReset = () => {
    setFeeMin()
    setFeeMax()
    setDistance()
    setSchoolType()
    setEducationLevel()
    setEducationType()
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const user = AuthService.getCurrentUser()

  const handleChangeSearch = (event) => {
    setSearchValue(event.target.value);
    console.log(searchValue)
  };
  const handleChangeSchoolType = (event) => {
    setSchoolType(event.target.value);
    console.log(schoolType)
  };
  const handleChangeEducationLevel = (event) => {
    setEducationLevel(event.target.value);
    console.log(educationLevel)
  };
  const handleChangeEducationType = (event) => {
    setEducationType(event.target.value);
    console.log(educationType)
  };
  var classes = useStyles();
  var position = [30.3753, 69.3451]
  
  

  let handleSend = () => {
    let finalFilters = {
      //filters: filterValue,
      fee: { min: feeMin, max: feeMax },
      distance: distance,
      schoolType: schoolType,
      educationLevel: educationLevel,
      educationType: educationType,
      currentLocation: currentLocation
    }
    newData.filters = finalFilters
    console.log("search Value")
    console.log(searchValue)
    newData.search = searchValue
    console.log("NewData")
    console.log(newData)
    postSearch()
  }

  const getAllSchools = useCallback(async (bool) => {
    async function fetchData() {
      let request;
      console.log("inside get all schools")
      request = await axios.get("http://localhost:8080/searchSchool/search/")
      console.log("request")
      setAllSchools(request.data)
      return request.data;
    }
    //And here you call it
    fetchData()
  }, [])

  let getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      //setCurrentLocation({ latitude:position.coords.latitude, longitude:position.coords.longitude })
      currentLocation.latitude = position.coords.latitude
      currentLocation.longitude = position.coords.longitude
      console.log("Current Location")
      console.log(currentLocation)
    });
  }

  useEffect(() => {
    getCurrentLocation()
    getAllSchools()
    //getItems().then(data => setItems(data));
  }, []);

  const postSearch = useCallback(async () => {
    async function fetchData() {
      let request;
      console.log("NewData")
      console.log(newData)
      request = await axios.post("http://localhost:8080/searchSchool/search/" + newData.search, newData.filters)
      console.log("request")
      console.log(request)
      setSearchResults(request.data)
      //window.location.reload()
      return request.data;
    }
    fetchData()
  }, [])

  let displayResults //= () => { let displayPostsVar

  if (searchResults !== undefined) {
    console.log("inside displayresults")
    displayResults = searchResults.map((i) => {
      
      return (
        <div class={classes.result} onClick={() => {
          
          AuthService.setCurrentSchool({ schoolID: i._id })
          props.history.push("/schoolDetails");
          props.history.push({ pathname: '/schoolDetails', data: i._id })
        }}>
          <text>{i.schoolName}</text>
          <br />
          <text style={{ fontSize: '10px' }}>{i.schoolAddress}</text>
        </div>
      )
    })
  } else {
    console.log("nothing")
  }

  let displayLocation;
  let markersArray = []

  if (allSchools != undefined) {
    console.log("inside allSchool If")
    displayLocation = allSchools.map((i) => {
      console.log(i)
      let key = i._id
      let position = [Number(i.schoolCoordinates.latitude), Number(i.schoolCoordinates.longitude)]
      let content = i.schoolName
      let markers = {
        key: key,
        position: position,
        content: content
      }
      markersArray.push(markers)
    })

    console.log(markersArray)
  } else {
    console.log("allSchools Else")
  }
  const MyMarkersList = ({ markers }) => {
    const items = markers.map(({ key, ...props }) => (
      <MyPopupMarker key={key} {...props} />
      
    ))
    return <Fragment>{items}</Fragment>
  }
  
  const MyPopupMarker = ({ content, position }) => (
    <Marker position={position} icon={customMarker} >
      <Popup >
        {content}
      </Popup>
    </Marker>
  )
  const handleChangeDistance = (event) => {
    console.log("inisde handle Distance")
    setDistance(event.target.value);
    console.log(distance)
  };

  console.log("School type")
  console.log(schoolType)

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item md={4}>
          <Widget title="Search School Here" disableWidgetMenu>
            <div className={classes.searchfield}>
              <InputBase className={classes.input} placeholder='Search here...' onChange={e => setSearchValue(e.target.value)}></InputBase>

              <FilterListIcon class={classes.icon} onClick={handleClickOpen} />
              {/* <SearchIcon fontSize='large' class={classes.icon} /> */}
              <Button onClick={() => handleSend()}> <SearchIcon fontSize='large' class={classes.icon} /></Button>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Filters</DialogTitle>
                <DialogContent>
                  <div class={classes.eachF}>
                    <text style={{ fontWeight: 'bold' }}>Disatnce: </text>
                    <FormControl className={classes.formControl}>
                      <Select
                        value={distance}
                        onChange={handleChangeDistance}
                        displayEmpty
                        className={classes.selectEmpty}
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>1km</MenuItem>
                        <MenuItem value={5}>5km</MenuItem>
                        <MenuItem value={10}>10km</MenuItem>
                        <MenuItem value={50}>50km</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div class={classes.eachF}>
                    <text style={{ fontWeight: 'bold' }}>Fee: </text>
                    <TextField placeholder="Min (PKR)" class={classes.feefield} value={feeMin} onChange={e => setFeeMin(e.target.value)} />
                    <TextField placeholder="Max (PKR)" class={classes.feefield} value={feeMax} onChange={e => setFeeMax(e.target.value)} />
                  </div>

                  <div class={classes.eachF}>
                    <text style={{ fontWeight: 'bold' }}>School type: </text>
                    <RadioGroup style={{ dispaly: 'flex', flexDirection: 'row' }} aria-label="type" name="type" value={schoolType}
                      onChange={handleChangeSchoolType}>
                      <FormControlLabel value="Co-Education" control={<Radio color='inherit' />} label="Co-Education" />
                      <FormControlLabel value="Boys" control={<Radio color='inherit' />} label="Boys" />
                      <FormControlLabel value="Girls" control={<Radio color='inherit' />} label="Girls " />
                    </RadioGroup>
                  </div >
                  {/* <div class={classes.eachF}>
                    <text style={{ fontWeight: 'bold' }}>Education level: </text>
                    <RadioGroup style={{ dispaly: 'flex', flexDirection: 'row' }} aria-label="educationlevel" name="educationlevel"
                      value={educationLevel} onChange={handleChangeEducationLevel}>
                      <FormControlLabel value="Primary" control={<Radio color='inherit' />} label="Primary" />
                      <FormControlLabel value="Middle" control={<Radio color='inherit' />} label="Middle" />
                      <FormControlLabel value="Higher" control={<Radio color='inherit' />} label="Higher " />
                    </RadioGroup>
                  </div> */}
                  <div class={classes.eachF}>
                    <text style={{ fontWeight: 'bold' }}>Education type: </text>
                    <RadioGroup style={{ dispaly: 'flex', flexDirection: 'row' }} aria-label="educationtype" name="educationtype  "
                      value={educationType} onChange={handleChangeEducationType}>
                      <FormControlLabel value="Arts" control={<Radio />} label="Arts" />
                      <FormControlLabel value="Science" control={<Radio />} label="Science" />
                      <FormControlLabel value="Both" control={<Radio />} label="Both" />
                    </RadioGroup>
                  </div>


                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseReset} color="primary">
                    Reset
                  </Button>
                  <Button onClick={handleClose} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>

              
            </div>

            <div >
              {
                displayResults
              }
            </div>
          </Widget>
        </Grid>

        <Grid item md={8}>
        <text style={{ fontSize: '10px' }}>Double click to go to your current location.</text>
            <MapContainer center={position}
              zoom={6}
              className={classes.mapContainer}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MyMarkersList markers={markersArray} />
              
              <LocationMarker />
            </MapContainer>
          
        </Grid>
      </Grid>
    </div >

  );
}
function LocationMarker() {
  const [position, setPosition] = React.useState(null)
  const map = useMapEvents({
      dblclick() {
          map.locate()
      },
      locationfound(e) {
          setPosition(e.latlng)
          map.flyTo(e.latlng, 15)
      },
  })

  return position === null ? null : (
      <Marker position={position} icon={iconPerson}>
          <Popup>You are here</Popup>
      </Marker>
  )
}

const iconPerson = new L.Icon({
  iconUrl: require("./gps.png"),

  iconSize: [30, 30],

});

