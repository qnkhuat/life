// A form to both add and edit Story
import { useState } from "react";

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/core/Alert';

import { useAuth  } from "../../lib/firebase/auth";
import { formatDate } from "../../lib/util";
import CustomTextField from "../../components/TextField";
import FirebaseUpload from "../FirebaseUpload";
import * as constants from "../Board/constants";

import axios from "axios";
import urljoin from "url-join";
import Div100vh, { use100vh } from "react-div-100vh";


export default function Upsert({ storyId, story, onComplete }){
  // exists(storyId) ? update : insert
  const storyTypes = {};
  Object.keys(constants.EVENTMAPPING).
    filter((key) => constants.EVENTMAPPING[key]['icon']).
    map((type, index) => {
      storyTypes[type] = `${type} - ${constants.EVENTMAPPING[type]['icon']}`;
    })

  const height100vh = use100vh();
  const { user } = useAuth();
  const [ title, setTitle ] = useState(story?.title || null);
  const [ content, setContent ] = useState(story?.content|| null);
  const [ date, setDate ] = useState(formatDate(story?.date, "YYYY-MM-DD")|| new Date());
  const [ imageUrls, setImageUrls ] = useState(story?.imageUrls || []);
  const [ publish, setPublish ] = useState(story?.publish || true);
  const [ type, setType ] = useState(story?.type || Object.keys(storyTypes)[0]);
  const [ uploadingAvatar, setUploadingAvatar ] = useState(false);

  const [ alertOpen, setAlertOpen] = useState(false);
  const [ alert, setAlert ] = useState({
    severity: "success",
    message: "",
  });

  function handleCloseAlert() {
    setAlertOpen(false);
  }

  // ImageUrls is for DB to store since it only store image path on Google Storage
  // imageDisplayUrls is a full url of uploaded image, we return it so client can preview
  const [ imageDisplayUrls, setImageDisplayUrls ] = useState(story?.imageUrls || []);


  function handleUploadComplete(path, url) {
    setImageUrls([path]);
    setImageDisplayUrls([url]);
    setUploadingAvatar(false);
  }

  function handleUpsertStory(){
    let payload = {
      title,
      content,
      date,
      imageUrls,
      publish,
      type
    }

    if (storyId) { // update
      axios.patch(urljoin(process.env.API_URL, `/api/user/${user.id}/story/${storyId}`), payload).then(( res ) => {
        if (res.status == 200) {
          payload['imageUrls'] = imageDisplayUrls;
          if (onComplete) onComplete(storyId, payload);
        }
      }).catch(( error ) => {
        setAlert({severity: "error", message: "Please fill in all the required fields"});
        setAlertOpen(true);

        console.error("Error updating story: ", error);
      })
    } else { // insert
      axios.post(urljoin(process.env.API_URL, `/api/user/${user.id}/story`), payload).then(( res ) => {
        if (res.status == 200) {
          let storyId = res.data.id;
          payload['imageUrls'] = imageDisplayUrls;
          setAlert({severity: "success", message: "Add succeed"});
          setAlertOpen(true);
          if (onComplete) onComplete(storyId, payload);
        }
      }).catch(( error ) => {
        setAlert({severity: "error", message: "Please edit your info"});
        setAlertOpen(true);

        console.error("Error adding story: ", error);
      })
    }
  }

  return (

    <div>
      <form id="form-story" noValidate autoComplete="off" className="flex flex-col bg-white w-screen m-auto overflow-hidden"
        style={{height:height100vh ? height100vh : "100vh"}}
      >

        <div id="form-image" className="relative overflow-hidden border-b-2"
          style={{height:height100vh ? height100vh*(2/5) : "40vh"}}
        >
          <img 
            style={{height:height100vh ? height100vh*(2/5) : "40vh"}}
            className="w-full object-contain" src={imageDisplayUrls.length > 0 ? imageDisplayUrls[0] : "placeholder-image.png"}></img>

          <FirebaseUpload id="profile-avatar" 
            onComplete={handleUploadComplete}
            prefix={user ? user.id : ""} 
            onStart={() => setUploadingAvatar(true)}
            onError={(error) => {
              setUploadingAvatar(false);
              setAlert({severity: "error", message: "Failed to upload avatar, Please try again!" });
              setAlertOpen(true);
            }}
            className="bg-black w-full">
            <>
              <IconButton component="span"
                className="outline-none absolute right-2 bottom-2 bg-gray-400 bg-opacity-40 p-1 text-black"
                aria-label="Search">
                <PhotoCameraIcon fontSize="small" ></PhotoCameraIcon>
              </IconButton>
              {uploadingAvatar && <CircularProgress className="absolute" 
                style={{right: "0.4rem", bottom:"0.4rem"}} size={40} />}
            </>
          </FirebaseUpload>
        </div>

        <div id="form-info" className="flex flex-col px-2 overflow-y-scroll overflow-x-scroll pb-4"
          style={{height:height100vh ? height100vh*(3/5) : "60vh"}}
        >

          <CustomTextField id="story-title" 
            className="mt-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            label="Title" 
            variant="outlined" 
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={title}
            required
          />

          <CustomTextField id="story-content" 
            className="mt-4 border-r-0 border-l-0"
            label="Description" 
            multiline
            rows={3}
            defaultValue={content}
            variant="outlined" 
            onChange={(e) => setContent(e.target.value)}
          />


          <CustomTextField id="story-date" 
            className="mt-4"
            onChange={(e) => setDate(e.target.value)}
            label="Date" 
            variant="outlined" 
            type="date"
            defaultValue={date}
            InputLabelProps={{shrink: true}}
            required/>

          <FormControl className='mt-4'>
            <InputLabel id="form-type-label">Type</InputLabel>
            <Select
              labelId="form-type-label"
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value)}
            >

              {Object.keys(storyTypes).map((type) => <MenuItem key={type} value={type}>{storyTypes[type]}</MenuItem>)}
            </Select>
          </FormControl>


          <FormControlLabel
            control={
              <Switch 
                color="secondary" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
            }
            label="Publish"
          />

          <Button id="story-submit" variant="outlined" color="primary" className="text-black border-black" onClick={handleUpsertStory}>
            Submit
          </Button>
        </div>

      </form>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseAlert}  severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </MuiAlert>
      </Snackbar>


    </div>
  )
}
