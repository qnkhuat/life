import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import dayjs from "dayjs";
import * as constants from "../constants";

export default class Tile extends React.Component {
  constructor(props){
    super(props);
    this.data = props.events;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.type = props.type || "default";
    this.title = props.title;
    this.imageurl = props.imageurl;
    this.state = {
    }
  }

  eventToDiv(e){
    return (
      <div className="border-2 p-2 text-base w-full max-h-96 overflow-x-hidden overflow-y-scroll no-scrollbar">
        <p className="text-center text-bold text-xl">{e.title}</p>
        {e.imageUrls && e.imageUrls.length > 0 && e.imageUrls.map((url) => <img className="w-full" src={url}/>)}
        {e.videoUrls && e.videoUrls.length > 0 && e.videoUrls.map((url) => <video soruce={url}/>)}
      </div>
    )
  }

  render() {
    var toolTip;
    const tile = <div 
      className={`transform hover:scale-150 
      hover:bg-${constants.EVENT2COLOR[this.type]}-600 bg-${constants.EVENT2COLOR[this.type]}-300 
      hover:z-10 z-0 relative
      w-5 h-4 
      box-border m-0.5`}
    ></div>;
    if (this.data.length > 0) {
      toolTip = 
        <Tooltip arrow 
          enterDelay={0}
          leaveDelay={0}
          placement="top"
          title={
            <React.Fragment>
              {this.data.length > 0 && this.data.map((e) => <div>{this.eventToDiv(e)}</div>)}
            </React.Fragment>
          }
          className="text-red-400"
        >
          {tile}
        </Tooltip>
    } else {
      toolTip = tile

    }
    return (
      <React.Fragment>
        {toolTip}
      </React.Fragment>
    )
  }
}

