import React from "react";
import { useState, useCallback, useContext, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { TextField, InputBase, CircularProgress } from "@material-ui/core";

// styles
import useStyles from "./styles";
import Loading from "../../components/Loading/loading"

// components
import Post from "./post"
import Widget from "../../components/Widget/Widget";
import { storage } from "../../Util/firebase"

import axios from "../../Util/axios"
import AuthService from "../../services/auth.service";
import { v4 as uuidv4 } from 'uuid';

import Loader from '../../Util/loader/Loader';

let post = {
  userID: "",
  username: "",
  text: "",
  image: "",
  likes: {},
  time: "",
  comments: {}
}

// const user = AuthService.getCurrentUser()

export default function Home(props) {

  const user = AuthService.getCurrentUser()

  const [isLoading, setIsLoading] = useState(false);
  var [allPosts, setAllPosts] = useState()
  let [reloadHome, setReloadHome] = useState(false)

  const getPosts = useCallback(async () => {
    async function fetchData() {
      let request;
      request = await axios.get("http://localhost:8080/dashboard/Home")

      let finalArr = []
      request.data.filter((post) => {
        if (user != undefined) {
          if(user._id==post.userID){
            finalArr.push(post)
          }
          if (user.following != null || user.following != [] || user.following != undefined) {
            for (let i = 0; i < user.following.length; i++) {
              if (user.following[i].follow == true && user.following[i].userID == post.userID) {
                finalArr.push(post)
              }
            }
          }
        }
      })

      console.log("Final Array")
      console.log(finalArr)
      setAllPosts(finalArr.reverse())
      return request.data;
    }
    fetchData()
    setReloadHome(true)
  }, [])

  var classes = useStyles();

  var [textValue, setTextValue] = useState("");
  var [likesValue, setLikesValue] = useState([]);
  var [commentValue, setCommentValue] = useState([]);
  var [imgBoolean, setImageBoolean] = useState(false)

  const [imageAsFile, setImageAsFile] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState({ imgUrl: '' })
  const [progress, setProgress] = useState(0)

  const handleImageAsFile = (e) => {
    const image = e.target.files[0]

    if (image !== undefined) {
      var imageExtension = image.name.split('.').pop();
      console.log(imageExtension)

      let newImage = uuidv4() + '.' + imageExtension;
      console.log(newImage)

      setImageAsFile(image)

      setImageName(newImage)

      setImageBoolean(true)
    } else {
      setImageAsFile('')
      setImageName('')
    }
  }

  const handleFireBaseUpload = e => {
    e.preventDefault()

    setIsLoading(true);

    // async magic goes here...
    if (imageAsFile === '' && textValue == "") {

      setIsLoading(false);

      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`)
    } else if (imageAsFile === '') {
      postSubmit()
      setIsLoading(false);
    } else {
      console.log('start of upload')
      // const uploadTask = storage.ref(`/home/${imageAsFile.name}`).put(imageAsFile)
      const uploadTask = storage.ref(`/home/${imageName}`).put(imageAsFile)

      //initiates the firebase side uploading 
      uploadTask.on('state_changed',
        (snapShot) => {
          //takes a snap shot of the process as it is happening
          const progress = Math.round(
            (snapShot.bytesTransferred / snapShot.totalBytes) * 100
          );
          setProgress(progress)
          if (progress == 100) {
            setProgress(0)
          }
          console.log(snapShot)
        }, (err) => {
          //catches the errors
          console.log(err)
        }, () => {
          // gets the functions from storage refences the image storage in firebase by the children
          // gets the download url then sets the image from firebase as the value for the imgUrl key:

          // storage.ref('home').child(imageAsFile.name).getDownloadURL()
          storage.ref('home').child(imageName).getDownloadURL()
            .then(fireBaseUrl => {
              setImageAsUrl(prevObject => ({ ...prevObject, imgUrl: fireBaseUrl }))

              postSubmit(fireBaseUrl)

              setIsLoading(false);
            })
        })
    }

  }

    const postSubmit = (fireBaseUrl='') => {

    let current = new Date()
    let year = current.getFullYear().toString();
    let month = current.getMonth() + 1;
    let day = current.getDate();

    let hours = current.getHours().toString();
    let minutes = current.getMinutes();
    let seconds = current.getSeconds();

    let finalDate = year.concat("/", month, "/", day)
    let finalTime = hours.concat(":", minutes, ":", seconds)

    let timee = finalDate.concat(" ", finalTime)

    post.userID = user._id
    post.username = user.username
    post.text = textValue
    // post.image = imageAsUrl.imgUrl
    post.image = fireBaseUrl
    post.likes = likesValue
    post.time = timee
    post.comments = commentValue

    sendRequest()

    setImageAsFile('')
    setTextValue('')
    setImageName('')
  }

  const sendRequest = useCallback(async () => {

  console.log("inside useEffect")
  async function fetchData() {
    console.log('inside fetchdata')
    let request;
    console.log("inside post")
    console.log(post)
    request = await axios.post("http://localhost:8080" + props.fetchUrl, post)
    console.log("request")
    console.log(request)

    setReloadHome(true)
    return request;
  }

  fetchData()
})

  let displayPosts

  try {
    if (allPosts != undefined) {
      console.log("inside displayPost")
      displayPosts = allPosts.map((i) => {
        return <Post key={i._id} id={i._id}
          username={i.username} userID={i.userID} time={i.time} text={i.text} image={i.image} comments={i.comments} likes={i.likes} totalLikes={i.totalLikes}//onSelect={this.onSelect} 
        />
      })
    } else {
      console.log("nothing")
    }
  } catch (err) {
    console.log("error")
    console.log(err)
  }

  useEffect(() => {
    getPosts()
    setReloadHome(false)
  }, [reloadHome]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item md={8}>
          {isLoading ? (
            <Loader />
          ) : (
            <div>
          <Widget title="What's on your mind?" disableWidgetMenu>
            <form onSubmit={handleFireBaseUpload}>
              <TextField className={classes.textfield} value={textValue}
                onChange={e => setTextValue(e.target.value)} placeholder='Post here...'></TextField>
              <div className={classes.postbottom}>
                <div className={classes.postbottomL} >
                  <input
                    type="file"
                    // multiple
                    onChange={handleImageAsFile}
                  />
                </div>
                <button type='submit' className={classes.postButton}>Post</button>
              </div>
            </form>
          </Widget>
            </div>
          )}
        </Grid>
        <div style={{ width: '95%', marginLeft: '15px' }}>
          {
            allPosts == undefined ? <Loading /> : displayPosts
          }
        </div>
      </Grid>
    </>
  );
}