import { useState, useEffect } from "react";

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';

import Croppie from "croppie";
import "croppie/croppie.css";
import Compressor from 'compressorjs';
import { v4 as uuidv4 } from 'uuid';

import { storage } from "../lib/firebase/client";
import { deepClone } from "../lib/util";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function FirebaseUpload({children, className, label, accept, onStart,onError, onComplete, prefix, maxWidth=1080, compressQuality=0.8, avatar=false}) {
  const intputId = uuidv4();
  const [ modifying, setModifying ] = useState(false);
  const [ croppieInstance, setCroppieInstance ] = useState(null);

  function compressThenUpload(file) {
    new Compressor(file, {
      quality: compressQuality, 
      maxWidth: maxWidth,
      success(compressedFile) {
        const dest = `img/${prefix ? `${prefix}/` : ""}${uuidv4()}.jpeg`;
        const storageRef = ref(storage, dest);
        const task = uploadBytesResumable(storageRef, compressedFile);
        if (onStart) onStart();
        task.on('state_changed', 
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            console.error("Failed to upload: ", error);
            if (onError) onError(error);
          },() => { // upload complete
            getDownloadURL(task.snapshot.ref).then((downloadUrl) => {
              if (onComplete) {
                console.log("Uploaded successful: ", downloadUrl);
                onComplete(dest, downloadUrl);
              }
            });
          }
        );
      }
    });
  }

  function openModifyWindow(e){
    if(e.target.files && e.target.files[0]){
      setModifying(true);
      const file = e.target.files[0];
      e.target.value = ""; // reset in case the user select the same files twice so onchange can still detect
      var reader = new FileReader();
      const imageCropper = document.getElementById("image-cropper");

      if (!imageCropper) {
        console.error("#image-cropper not found");
        return;
      }

      var croppieInstanceTemp;
      if(!croppieInstance){
        croppieInstanceTemp = new Croppie(imageCropper, {
          enableExif: true,
          enableOrientation:true,
          enableResize: avatar ? false :true,
          viewport: {
            height: 250,
            width: avatar ? 250 : 280,
            type: avatar ? "circle" :'square'
          },
        });
        setCroppieInstance(croppieInstanceTemp);
      } else {
        croppieInstanceTemp = croppieInstance;
      }

      reader.onload = function (e) {
        croppieInstanceTemp.bind({
          url: e.target.result,
          zoom:0
        });
      }
      reader.readAsDataURL(file);
    } else {
      console.error("Unable to open Modify window: file not found");
    }
  }

  function upload(e){
    setModifying(false);
    croppieInstance.result({type: 'blob', size: "original", format: "jpeg"}).then(compressThenUpload).
      catch((error) => {console.error("Error uploading: ", error)});
  }

  return (
    <>
      <input
        id={intputId}
        className="hidden"
        accept={accept || "image/*"}
        type="file"
        onChange={openModifyWindow}
      />
      <Modal
        BackdropComponent={Backdrop}
        open={modifying}
        keepMounted={true}
      >
        <div id="image-cropper-wrapper" 
          className="fixed bg-white top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20 bg-border p-2 md:rounded w-full md:w-desktop h-full flex flex-col justify-center">
          <div id="image-cropper"
            className="w-full h-72 md:h-2/5"
          ></div>

          <div id="image-cropper-options" className="flex mt-12">
            <Button id="cropper-confirmed" 
              className="text-black border-black mx-auto" 
              variant="outlined" 
              onClick={upload}>
              Save
            </Button>
          </div>

          <IconButton
            onClick={() => {setModifying(false)}}
            className="bg-black bg-opacity-40 text-white outline-none absolute top-2 right-2 w-8 h-8 z-40"
            aria-label="close" color="primary">
            <CloseIcon></CloseIcon>
          </IconButton>
        </div>
      </Modal>

      <label htmlFor={intputId}>
        {children || 
        <Button variant="contained" color="primary" component="span" 
          className={className || ""}>
          {label || "Upload"}
        </Button>
        }
      </label>
    </>
  )
}

