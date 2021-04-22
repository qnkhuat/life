import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles} from "@material-ui/core/styles";
import dayjs from "dayjs";

import * as constants from "../constants";

const CustomTooltip = withStyles({
  tooltip: {
    maxWidth: "500px",
    padding: "0px",
    maxHeight: "500px",
  }
})(Tooltip);

const TILE_WIDTH  = "400px";
const TILE_HEIGHT = "300px";

const DATE_RANGE_FORMAT = "DD/MM/YYYY";


export default class Tile extends React.Component {
  constructor(props){
    super(props);
    this.data = props.events;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.type = props.type || "default";
    this.state = {
    }
  }

  eventToDiv(e){
    return (
      <div 
        className="text-base rounded shadow-xl">
        <div className="tooltip-media"
        >
          {e.imageUrls && e.imageUrls.length > 0 && e.imageUrls.map((url) => <img 
          style={{width: TILE_WIDTH, height: TILE_HEIGHT}}
          className="object-contain" src={url}/>)}
        </div>
        <div 
          style={{"max-width": TILE_WIDTH, "max-height": TILE_HEIGHT}}
          className="tooltip-text bg-white px-5 py-5 text-black text-left">
          <p className="text-xl text-bold overflow-ellipsis">{e.title}</p>
          {e.content && <p className="text-base">{e.content}</p>}
          <hr/>
          <p className="text-sm text-gray-500">{e.date.format(DATE_RANGE_FORMAT)}</p>
        </div>
      </div>
    )
  }

  render() {
    var toolTip;
    const tile = <div 
      className={`transform hover:scale-125 
      hover:bg-${constants.EVENT2COLOR[this.type]}-500 bg-${constants.EVENT2COLOR[this.type]}-300 
      hover:z-10 z-0 relative
      text-xs text-center
      w-5 h-4 
      box-border m-0.5`}
    >{constants.EVENT2ICON[this.type]}</div>;
    if (this.data.length > 0) {
      toolTip = 
        <CustomTooltip
          enterDelay={0}
          leaveDelay={0}
          placement="top"
          title={
            <React.Fragment>
              {this.data.length > 0 && this.data.map((e) => <div>{this.eventToDiv(e)}</div>)}
            </React.Fragment>
          }
        >
          {tile}
        </CustomTooltip>
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

