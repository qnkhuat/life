import { useState } from "react";
import { formatDate } from '../../lib/util';
import { useAuth } from '../../lib/firebase/auth';
import * as constants from "../../constants";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Backdrop from '@material-ui/core/Backdrop';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import Upsert from './Upsert';
import axios from "axios";
import urljoin from "url-join";


function Story({ story, storyId }){

  const { user } = useAuth();
  const [deleted, setDeleted] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [storyState, setStoryState] = useState(story);

  function handleOnEditComplete(id, story) {
    setStoryState(story); 
    setOpenEdit(false);
  };

  function handleDeleteStory(storyId){
    const stories_req = axios.delete(urljoin(process.env.BASE_URL, `/api/user/${user.id}/story/${storyId}`)).then((res) => {
      setOpenDelete(false);
      setDeleted(true);
    }).catch((error) => console.error("Failed to delete story", error));
  };

  return (
    <div className={`rounded m-4 relative ${deleted && "hidden"}`}>
      <h1>{storyState.title}</h1>
      {storyState.content&& <h3>{storyState.content}</h3>}
      <h1>{formatDate(storyState.date, constants.DATE_FORMAT)}</h1>
      {storyState.imageUrls.length > 0 && 
      <img 
        alt={storyId}
        src={storyState.imageUrls[0]}/>
      }

      <div className="delete-button">
        <IconButton 
          onClick={() => setOpenDelete(true)} 
          aria-label="edit" color="primary" 
          className="absolute top-10 right-0 bg-black bg-opacity-50 text-white w-6 h-6 mt-1 mr-1">
          <DeleteIcon fontSize="small"></DeleteIcon>
        </IconButton>

        <Modal
          BackdropComponent={Backdrop}
          open={openDelete}
          onClose={() => setOpenDelete(false)} 
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-auto" >
            <div className="bg-white text-black">
              <h3>Are you at the surest state of your life?</h3>
              <Button onClick={() => handleDeleteStory(storyId)}>Yes</Button>
              <Button onClick={() => setOpenDelete(false)}>No</Button>
            </div>
          </div>
        </Modal>
      </div>


      <div className="edit-button">
        <IconButton 
          onClick={() => setOpenEdit(true)} 
          aria-label="edit" color="primary" 
          className="absolute top-0 right-0 bg-black bg-opacity-50 text-white w-6 h-6 mt-1 mr-1">
          <EditIcon fontSize="small"></EditIcon>
        </IconButton>

        <Modal
          BackdropComponent={Backdrop}
          open={openEdit}
          onClose={() => setOpenEdit(false)} 
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-auto" >
            <Upsert story={storyState} storyId={storyId} onComplete={handleOnEditComplete}/>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default function StoriesList({ stories, ascending=false }) {
  const orderedStoryIds = Object.keys(stories).sort((a, b) => { 
    if (ascending) return (new Date(stories[a].date)) - (new Date(stories[b].date));
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
