import { storage } from "../lib/firebase/client";
import { v4 as uuidv4 } from 'uuid';
import Button from '@material-ui/core/Button';

export default function FirebaseUpload(props) {
  const intputId = props.id || uuidv4();
  function upload(e){
    const file = e.target.files[0];
    const filename = file.name;
    const filenameSplit = filename.split(".");
    const dest = `img/${props.prefix ? `${props.prefix}-` : ""}${uuidv4()}.${filenameSplit[filenameSplit.length - 1]}`;
    const storageRef = storage.ref().child(dest);
    const task = storageRef.put(file);
    task.on('state_changed', function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
    }, function error(err) {
    },function complete() {
      if( props.setValueOnComplete ) props.setValueOnComplete(dest);
    });
  }

  return (
    <>
      <input
        id={intputId}
        className="hidden"
        accept={props.accept || "image/*"}
        type="file"
        onChange={upload}
      />
      <label htmlFor={intputId}>
        <Button variant="contained" color="primary" component="span" 
          className={props.className || ""}>
          {props.label || "Upload"}
        </Button>
      </label>
    </>
  )
}

