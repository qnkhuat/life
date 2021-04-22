import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles} from "@material-ui/core/styles";
import dayjs from "dayjs";
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

import * as constants from "../constants";


const TILE_WIDTH  = "600px";
const TILE_HEIGHT = "450px";

const CustomTooltip = withStyles({
  tooltip: {
    maxWidth: TILE_WIDTH,
    padding: "0px",
    maxHeight: "600px",
  }
})(Tooltip);

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
        className="text-base rounded">
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

    const tooltipClassName = "shadow-xl border-2 border border-gray-300 rounded bg-black";


    if (this.data.length > 0) {
      var tooltipTitle;
      if (this.data.length == 1){
        tooltipTitle = <div className={tooltipClassName}>{this.eventToDiv(this.data[0])}</div>;
      } else{
        tooltipTitle = <Carousel
          className={tooltipClassName}
          isLoop={false}
          hasMediaButton={false}
          isMaximized={false}
          hasIndexBoard={false}
          hasSizeButton={false}
          hasDotButtons='bottom'
          hasThumbnails={false}
          shouldSwipeOnMouse={true} // for selecting text
          shouldMinimizeOnSwipeDown={false} // for vertical overflow scrolling
          style={{ userSelect: 'text' }}
        >
          {this.data.map((e) => <div className="text-slide">{this.eventToDiv(e)}</div>)}
        </Carousel>
      }


      toolTip = 
        <CustomTooltip
          enterDelay={0}
          leaveDelay={0}
          placement="top"
          title={
            <React.Fragment>
              {tooltipTitle}
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

