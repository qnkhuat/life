import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import OutsideDetector from "./OutsideDetector";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';

import * as constants from "./constants";

const CustomTooltip = withStyles({
  tooltip: {
    maxWidth: "100% !important",
    padding: "0px",
    maxHeight: "100%",
  }
})(Tooltip);

const formatText = (text) => {
  return text.split('\n').map(function(item, key) {
    return (
      <span key={key}>
        {item}
        <br/>
      </span>
    )
  })
}

const DATE_RANGE_FORMAT = "DD/MM/YYYY";

const centerTooltipModifier = {
  name: 'computeStyles',
  enabled: true,
  fn({state}) {
    state.styles.popper = {
      ...state.styles.popper,
      position: 'fixed',
      left: 0,
      top: 0,
      right: 0,
      bottom:0,
      background: "rgb(0 0 0 / 53%)",
      transform: 'none',
      "max-width":"100%",
      display: "flex",
      "justify-content":"center",
      "align-items":"center",
      "overflow": "hidden",
    }
    return state
  },
};

const preventOverflow = {
  name: 'flip',
  enabled:true,
  options: {
    fallbackPlacements: ['bottom', 'left', 'right'], // orders matter
  },
}

class Tile extends React.Component {
  constructor(props){
    super(props);
    this.events = props.events; // only get the first one
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.type = props.type || "default";
    if (!this.type in constants.EVENTMAPPING) this.type = "default";
    this.isMobile = props.isMobile == undefined ? true : props.isMobile;
    this.state = {
      open:false,
      clickOpen:false,
      hoverOpen:false,
      tooltipModifiers:[preventOverflow]
    }
  }

  eventToDiv(e){
    const closeButton = <IconButton 
      onClick={this.handleOnClickAway.bind(this)} aria-label="close" color="primary" 
      className="absolute top-0 right-0 bg-black bg-opacity-50 text-white w-6 h-6 mt-1 mr-1"
    >
      <CloseIcon fontSize="small"/>
    </IconButton>

    // media
    const isMedia = e.imageUrls.length > 0;
    const isText = e.title.length > 0;
    const media = <div className={`tooltip-media ${isMedia ? "max-h-tooltip-media" : "max-h-tooltip"}`}>
      {isMedia && e.imageUrls.length > 0 && <img 
        alt={e.date.format(DATE_RANGE_FORMAT)}
        className={`object-contain m-auto ${isText ? "max-h-tooltip-media" : "max-h-tooltip"}`}
        src={e.imageUrls[0]}/>}
    </div>

    // text
    const text = <div 
        className={`tooltip-text bg-white px-5 py-5 text-black text-left ${isMedia ? "max-h-tooltip-text" : "max-h-tooltip"} overflow-x-hidden overflow-y-auto`}>
        <p className="text-lg font-bold overflow-ellipsis">{e.title}</p>
        {isText && e.content && <p className="text-base mb-2">{formatText(e.content)}</p>}
        <hr/>
        <p className="text-sm text-gray-500">{e.date.format(DATE_RANGE_FORMAT)} - {Math.floor(e.ageSince)} Years old</p>
      </div>

      return (
        <div 
          className="tile-content relative w-full">
          {isMedia && media}
          {isText && text}
          {closeButton}
        </div>
      )
  }

  handleOnClick(){
    const isOpen = this.state.open;
    if (this.state.hoverOpen){ // hover then click
      this.setState({
        open:true,
        clickOpen:true,
        hoverOpen:false,
        tooltipModifiers: this.isMobile ? [centerTooltipModifier] : []
      })
    } else {
      this.setState({
        open: !isOpen,
        clickOpen: !isOpen,
        tooltipModifiers: isOpen ? [preventOverflow] :  [preventOverflow, this.isMobile && centerTooltipModifier],
      });
    }
  }

  handleOnMouseEnter(){
    if (!this.state.open && !this.state.clickOpen && !this.isMobile) this.openTimeoutId = setTimeout(() => {this.setState({hoverOpen:true, open:true})}, 100);
  }

  handleOnMouseLeave(){
    if (this.openTimeoutId) { // handle the bug mouse double trigger for mouse enterring 
      clearTimeout(this.openTimeoutId)
      this.openTimeoutId = undefined;
    }
    if (this.state.open && !this.state.clickOpen && !this.isMobile) this.setState({open:false, hoverOpen:false, lastLeave: new Date()});
  }

  handleOnClickAway(){
    this.setState({
      open:false,
      hoverOpen:false,
      clickOpen:false,
      tooltipModifiers: [preventOverflow]
    });
  }

  render() {
    var toolTip;
    const toolDivClassName = `transform hover:scale-125 
      hover:bg-${constants.EVENTMAPPING[this.type].color}-500 bg-${constants.EVENTMAPPING[this.type].color}-300 
      hover:z-10 z-0 relative
      text-xs text-center
      sm:text-xl
      w-tile sm:w-sm-tile h-tile sm:h-sm-tile m-tile sm:m-sm-tile
      box-border`;

    if (this.events.length > 0) { // interactive tile
      const tileDiv = <div 
        onClick={this.handleOnClick.bind(this)}
        onMouseEnter={this.handleOnMouseEnter.bind(this)}
        onMouseLeave={this.handleOnMouseLeave.bind(this)}
        className={toolDivClassName}
      >{constants.EVENTMAPPING[this.type]['icon']}</div>;

      var tooltipContent = this.events.map((e, _) => <React.Fragment>{this.eventToDiv(e)}</React.Fragment>);

      const tooltipClassName = "tooltip-wrapper shadow-xl border-2 border border-gray-300 rounded bg-black max-h-tooltip w-tooltip sm:w-sm-tooltip";

      var tooltipWrapper;
      //if (this.events.length === 1) { // no need carousel for this
      tooltipWrapper = <div className={tooltipClassName}>{tooltipContent}</div>;
      //} else {
      //    tooltipWrapper = <Carousel
      //      className={tooltipClassName}
      //      isLoop={false}
      //      hasMediaButton={false}
      //      isMaximized={false}
      //      hasIndexBoard={false}
      //      hasSizeButton={false}
      //      hasDotButtons='bottom'
      //      hasThumbnails={false}
      //      shouldSwipeOnMouse={true} // for selecting text
      //      shouldMinimizeOnSwipeDown={false} // for vertical overflow scrolling
      //      style={{userSelect: 'text'}}>
      //      {tooltipContent}
      //    </Carousel>
      //}

      // wrap to detect when user click out of content to hide
      if (this.state.open){ 
        tooltipWrapper = <OutsideDetector onClickAway={this.handleOnClickAway.bind(this)}>{tooltipWrapper}</OutsideDetector>;
      }

      toolTip = <CustomTooltip
        placement="top"
        disableInteractive={!this.state.open}
        title={tooltipWrapper}
        open={this.state.open}
        PopperProps={{
          modifiers: this.state.tooltipModifiers,
          keepMounted:false,
          disablePortal:true,
        }}
        enterDelay={10000}
      >
        {tileDiv}
      </CustomTooltip>;
    } else { // simple div no effect
      toolTip = <div className={toolDivClassName}>{constants.EVENTMAPPING[this.type]['icon']}</div>
    }

    return (
      <React.Fragment>
        {toolTip}
      </React.Fragment>
    )
  }
}

export default Tile;
