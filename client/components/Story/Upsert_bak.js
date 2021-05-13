// A form to both add and edit Story
import { useState } from "react";
import { useAuth  } from "../../lib/firebase/auth";
import { formatDate } from "../../lib/util";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FirebaseUpload from "../FirebaseUpload";
import Switch from '@material-ui/core/Switch';
import * as constants from "../Board/constants";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from "axios";
import urljoin from "url-join";


export default function Upsert({ storyId, story, onComplete }){
  // exists(storyId) ? update : insert
  const storyTypes = {};
  Object.keys(constants.EVENTMAPPING).
    filter((key) => constants.EVENTMAPPING[key]['icon']).
    map((type, index) => {
      storyTypes[type] = `${type} - ${constants.EVENTMAPPING[type]['icon']}`;
    })

  const { user } = useAuth();
  const [ title, setTitle ] = useState(story?.title || null);
  const [ content, setContent ] = useState(story?.content|| null);
  const [ date, setDate ] = useState(formatDate(story?.date, "YYYY-MM-DD")|| new Date());
  const [ imageUrls, setImageUrls ] = useState(story?.imageUrls || []);
  //const [ imageAbsoluteUrl, setImageUrls ] = useState(story?.imageUrls || []);
  const [ publish, setPublish ] = useState(story?.publish || true);
  const [ type, setType ] = useState(story?.type || Object.keys(storyTypes)[0]);


  // ImageUrls is for DB to store since it only store image path on Google Storage
  // imageDisplayUrls is a full url of uploaded image, we return it so client can preview
  const [ imageDisplayUrls, setImageDisplayUrls ] = useState(story?.imageUrls || []);


  function handleUploadComplete(path, url) {
    setImageUrls([path]);
    setImageDisplayUrls([url]);
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
        console.error("Error updating story: ", error);
      })
    } else { // insert
      axios.post(urljoin(process.env.API_URL, `/api/user/${user.id}/story`), payload).then(( res ) => {
        if (res.status == 200) {
          let storyId = res.data.id;
          payload['imageUrls'] = imageDisplayUrls;
          if (onComplete) onComplete(storyId, payload);
        }
      }).catch(( error ) => {
        console.error("Error adding story: ", error);
      })
    }
  }

  return (

    <form id="form-story" noValidate autoComplete="off" className="flex flex-col bg-white w-full m-auto">
      <TextField id="story-title" 
        label="Title" 
        variant="outlined" 
        onChange={(e) => setTitle(e.target.value)}
        defaultValue={title}
        required
      />

      <TextField id="story-content" 
        label="Content" 
        multiline
        defaultValue={content}
        variant="outlined" 
        onChange={(e) => setContent(e.target.value)}
        required/>

      <TextField id="story-date" 
        onChange={(e) => setDate(e.target.value)}
        label="Date" 
        variant="outlined" 
        type="date"
        defaultValue={date}
        InputLabelProps={{shrink: true}}
        required/>

      <FormControl>
        <Select
          labelId="story-type"
          id="story-type"
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {Object.keys(storyTypes).map((type) => <MenuItem key={type} value={type}>{storyTypes[type]}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControlLabel id="story-publish" control={<Switch defaultChecked color="primary" onChange={(e) => setPublish(e.target.checked)}/>} label="Label" />

      <FirebaseUpload id="story-image" prefix={user.id} className="bg-black" onComplete={handleUploadComplete}/>
      {(imageUrls.length > 0 || imageDisplayUrls.length > 0) && <img src={imageDisplayUrls[0] || imageUrls}/>}

      <Button id="story-submit" variant="outlined" color="primary" onClick={handleUpsertStory}>
        Submit
      </Button>
    </form>
  )

}
