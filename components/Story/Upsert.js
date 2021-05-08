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
import dayjs from "dayjs";


export default function Upsert({ storyId, story, username, onComplete }){
  // exists(storyId) ? update : insert
  const { user } = useAuth();
  const [ title, setTitle ] = useState(story?.title || null);
  const [ content, setContent ] = useState(story?.content|| null);
  const [ date, setDate ] = useState(formatDate(story?.date, "YYYY-MM-DD")|| new Date());
  const [ imageUrls, setImageUrls ] = useState(story?.imageUrls || []);
  const [ publish, setPublish ] = useState(story?.publish || true);
  const [ type, setType ] = useState(story?.type || true);


  const storyTypes = {};
  Object.keys(constants.EVENTMAPPING).filter((key) => constants.EVENTMAPPING[key]['icon']).
    map((type, index) => {
      storyTypes[type] = `${type} - ${constants.EVENTMAPPING[type]['icon']}`;
    })

  function upsertStory(){
    let payload = {
      title,
      content,
      date,
      imageUrls: imageUrls,
      publish,
      type
    }

    if (storyId) {
      axios.patch(`/api/user/${user.username}/story/${storyId}`, payload).then(( res ) => {
        if (res.status == 200) {
          if (onComplete) onComplete(storyId, payload);
        }
      }).catch(( error ) => {
        console.error("Error updating story: ", error);
      })
    } else {
      axios.post(`/api/user/${user.username}/story`, payload).then(( res ) => {
        if (res.status == 200) {
          const storyid = res.data['id'];
          if (onComplete) onComplete(storyId, payload);
        }
      }).catch(( error ) => {
        console.error("Error adding story: ", error);
      })
    }
  }

  return (

    <form id="form-story" noValidate autoComplete="off" className="flex flex-col mt-40 bg-white w-96">
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
          value={Object.keys(storyTypes)[0]}
          onChange={(e) => setType(e.target.value)}
        >
          {Object.keys(storyTypes).map((type) => <MenuItem key={type} value={type}>{storyTypes[type]}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControlLabel id="story-publish" control={<Switch defaultChecked onChange={setPublish}/>} label="Label" />

      <FirebaseUpload id="story-image" prefix={user.username} className="bg-black" onComplete={(path, url) => setImageUrls([path])}/>

      <Button id="story-submit" variant="outlined" color="primary" onClick={upsertStory}>
        Submit
      </Button>
    </form>
  )

}
