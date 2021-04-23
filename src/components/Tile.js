import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import OutsideDetector from "./OutsideDetector";

import * as constants from "../constants";

const POPUP_WIDTH  = "400px";
const POPUP_HEIGHT = "300px";


const CustomTooltip = withStyles({
  tooltip: {
    maxWidth: POPUP_WIDTH,
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
    this.tileHeight = props.height || constants.TILE['height'];
    this.tileWidth = props.width || constants.TILE['width'];
    this.tileMargin = props.margin || constants.TILE['margin'];
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
          {e.imageUrls && e.imageUrls.length > 0 && e.imageUrls.map((url, i) => <img 
            key={i}
            alt={e.date.format(DATE_RANGE_FORMAT)}
            style={{width: POPUP_WIDTH, height: POPUP_HEIGHT}}
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

  handleOnClickAway(){
    this.setState({open:false,
      hoverOpen:false,
      clickOpen:false});
  }

  render() {
    var toolTip, tileDiv;
    tileDiv = <div 
      style={{
        width: this.tileWidth,
        height: this.tileHeight,
        margin:this.tileMargin,
      }}
        onClick={this.handleOnClick.bind(this)}
        onMouseOver={this.handleOnMouseOver.bind(this)}
        onMouseLeave={this.handleOnMouseLeave.bind(this)}
        className={`transform hover:scale-125 
      hover:bg-${constants.EVENT2COLOR[this.type]}-500 bg-${constants.EVENT2COLOR[this.type]}-300 
      hover:z-10 z-0 relative
      text-xs text-center
      box-border`}
    >{constants.EVENT2ICON[this.type]}</div>;

    if (this.state.open) tileDiv = <div><OutsideDetector
      onClickAway={this.handleOnClickAway.bind(this)}
      >{tileDiv}</OutsideDetector></div>;

    
    const tooltipClassName = "shadow-xl border-2 border border-gray-300 rounded bg-black";

    if (this.data.length > 0) {
      const tilesContent = this.data.map((e, i) => <div key={i} className="text-slide">{this.eventToDiv(e)}</div>);

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

