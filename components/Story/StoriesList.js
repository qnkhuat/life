import { useState } from "react";
import { formatDate } from '../../lib/util';
import * as constants from "../../constants";
import IconButton from "@material-ui/core/IconButton";
import Backdrop from '@material-ui/core/Backdrop';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import Upsert from './upsert';


function Story({ story, storyId }){

  const [open, setOpen] = useState(false);
  const [storyState, setStoryState] = useState(story);
 
  function handleOpen() {setOpen(true)};
  function handleClose() {setOpen(false)};
  
  function handleOnComplete(id, story) {
    setStoryState(story); 
    handleClose()
  };


  return (
    <div className="rounded m-4 relative">
      <h1>{storyState.title}</h1>
      {storyState.content&& <h3>{storyState.content}</h3>}
      <h1>{formatDate(storyState.date, constants.DATE_FORMAT)}</h1>
      {storyState.imageUrls.length > 0 && 
      <img 
        alt={storyId}
        src={storyState.imageUrls[0]}/>
      }
      <div className="edit-button">
        <IconButton 
          onClick={handleOpen} 
          aria-label="edit" color="primary" 
          className="absolute top-0 right-0 bg-black bg-opacity-50 text-white w-6 h-6 mt-1 mr-1">
          <EditIcon fontSize="small"></EditIcon>
        </IconButton>

        <Modal
          BackdropComponent={Backdrop}
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-auto" >
            <Upsert story={storyState} storyId={storyId} onComplete={handleOnComplete}/>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default function StoriesList({ stories, ascending=false }) {
  const orderedStoryIds = Object.keys(stories).sort((a, b) => { 
    if(ascending) return (new Date(stories[a].date)) - (new Date(stories[b].date));
    else return (new Date(stories[b].date)) - (new Date(stories[a].date));
  })
  return (
    <>
      {orderedStoryIds && orderedStoryIds.map((id) => (
        <Story key={id} story={stories[id]} storyId={id} />
      ))}
    </>
  );
}
