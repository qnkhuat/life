import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

import * as constants from "../constants";


const TILE_WIDTH  = "400px";
const TILE_HEIGHT = "300px";

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
      open:false,
      clickOpen:false,
      hoverOpen:false,
    }
  }

  eventToDiv(e){
    return (
      <div 
        className="text-base rounded">
        <div className="tooltip-media"
        >
          {e.imageUrls && e.imageUrls.length > 0 && e.imageUrls.map((url) => <img 
            alt={e.date.format(DATE_RANGE_FORMAT)}
            style={{width: TILE_WIDTH, height: TILE_HEIGHT}}
            className="object-contain" src={url}/>)}
        </div>
        <div 
          className="tooltip-text bg-white px-5 py-5 text-black text-left">
          <p className="text-xl text-bold overflow-ellipsis">{e.title}</p>
          {e.content && <p className="text-base">{e.content}</p>}
          <hr/>
          <p className="text-sm text-gray-500">{e.date.format(DATE_RANGE_FORMAT)} - {Math.floor(e.ageSince)} Years old</p>
        </div>
      </div>
    )
  }

  handleOnClick(){
    console.log("click ne");
    const openState = this.state.open;
    if (this.state.hoverOpen){
      this.setState({
        open:true,
        clickOpen:true,
        hoverOpen:false
      })
    } else{
      this.setState({
        open: !openState,
        clickOpen: !openState
      });
    }

  }

  handleOnMouseOver(){
    if (!this.state.open && !this.state.clickOpen) this.setState({open:true, hoverOpen:true});
  }

  handleOnMouseLeave(){
    if (this.state.open && !this.state.clickOpen) this.setState({open:false, hoverOpen:false});
  }

  render() {
    var toolTip, tileDiv;
    tileDiv = <div 
        onClick={this.handleOnClick.bind(this)}
        onMouseOver={this.handleOnMouseOver.bind(this)}
        onMouseLeave={this.handleOnMouseLeave.bind(this)}
        className={`transform hover:scale-125 
      hover:bg-${constants.EVENT2COLOR[this.type]}-500 bg-${constants.EVENT2COLOR[this.type]}-300 
      hover:z-10 z-0 relative
      text-xs text-center
      w-5 h-4 
      box-border m-0.5`}
    >{constants.EVENT2ICON[this.type]}</div>;

    
    const tooltipClassName = "shadow-xl border-2 border border-gray-300 rounded bg-black";

    if (this.data.length > 0) {
      const tilesContent = this.data.map((e) => <div className="text-slide">{this.eventToDiv(e)}</div>);

      var tooltipTitle;
      if (this.data.length === 1) {
        tooltipTitle = <div className={tooltipClassName}>{tilesContent}</div>;
      } else {
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
          tilesContent
        </Carousel>
      }

      toolTip = <CustomTooltip
        open={this.state.open}
        placement="top"
        disableInteractive={!this.state.open}
        title={tooltipTitle}
      >
        {tileDiv}
      </CustomTooltip>;
    } else {
      toolTip = tileDiv;
    }
    return (
      <React.Fragment>
        {toolTip}
      </React.Fragment>
    )
  }
}

