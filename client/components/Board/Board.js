import React, { useRef, useState, useEffect } from 'react';
import * as constants from "./constants";
import { v4 as uuidv4 } from "uuid";

import Div100vh, { use100vh } from "react-div-100vh";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { formatMultilineText } from "../../lib/util";
import Loading from "../../components/Loading";

import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import Avatar from '@material-ui/core/Avatar';
import Modal from '@material-ui/core/Modal';
import Popper from '@material-ui/core/Popper';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import EditIcon from '@material-ui/icons/Edit';
import { useSwipeable } from "react-swipeable";

dayjs.extend(customParseFormat);

const roundDate = (date) => date.hour(0).minute(0).second(0).millisecond(0);

const formatDate = (date) => roundDate(dayjs(date));
const DATE_RANGE_FORMAT = "DD/MM/YYYY";

function EventDisplayer ({ events, displayInfo, onEditEvent, setDisplayInfo, editable }) {

  var event = null;
  var eventId = displayInfo?.eventId;
  var displayMode = displayInfo?.mode;
  console.log("Start: ", displayInfo);

  const [ currentEventIndex, setCurrentEventIndex ] = useState(null);
  for (var i = 0; i < events.length; i ++) {
    if (events[i].id == eventId){
      event = events[i].event;
      if (currentEventIndex == null) setCurrentEventIndex(i);
      break;
    }
  }

  function handleCloseDisplayer() {
    // the trigger of this component to display is the change in value of eventId 
    // It's set by setEventId, A hook shared by both EventDisplayer and Layout
    // This complication is to reduce the number of re-renders on the board
    setDisplayInfo(null);
    setCurrentEventIndex(null);
  }

  function handleJumpEvent(prev=false) {
    let nextEventId = null;
    let nextEventIndex = null;
    let foundCurrentOne = false;
    for (var i = 0; i < events.length; i++){
      var index = null;
      if (prev) index = (events.length - 1) - i;
      else index = i;

      if ( !foundCurrentOne ){
        if (events[index].id == eventId) foundCurrentOne = true; // next loop will be the next event t show
      } else {
        nextEventId = events[index].id;
        nextEventIndex = index;
        break;
      }
    };

    if (nextEventId != null) {
      displayInfo['eventId'] = nextEventId;
      setDisplayInfo(displayInfo); // if the nextEventId is null the displayer will be closed
      setCurrentEventIndex(nextEventIndex);
    } else {
      setCurrentEventIndex(null);
    }
  }

  
  function handleKeyUp(e) {
    switch (e.keyCode){
      case 27: // esc
      case 40: // down
        handleCloseDisplayer();
        break;
      case 37: // left
        handleJumpEvent(true);
        break;
      case 39: // right
        handleJumpEvent(false);
        break;
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [eventId, displayMode]);


  const swipeHandlers= useSwipeable({ 
    //onSwipedDown: handleCloseDisplayer,
    //onSwipedUp: handleCloseDisplayer,
    onSwipedRight: () => handleJumpEvent(true),
    onSwipedLeft: () => handleJumpEvent(false),
  })


  if (!eventId || !event) return (<></>);

  const isText = event.title.length > 0;
  const isMedia = event.imageUrls.length > 0;
  const media = <div id="modal-media" className={`bg-black`}>
    {isMedia && event.imageUrls.length > 0 && 
    <img 
      alt={event.date.format(DATE_RANGE_FORMAT)}
      className={`object-contain m-auto ${displayMode == "click" ? "h-3/5-screen" : "h-2/5-screen"}`}
      src={event.imageUrls[0]}/>}
    <hr></hr>
  </div>;


  // text
  const textHeight = displayMode == "click" ? "min-h-2/5-screen" : " hover";
  const text = <div 
    id="modal-text"
    className={`bg-white px-10 py-5 text-black text-left ${isMedia ? textHeight : ""}`}>
    <p className="text-lg font-bold overflow-ellipsis">{event.title}</p>
    <p className={`text-sm text-gray-500 ${isMedia ? "pb-2" : ""}`}>{event.date.format(DATE_RANGE_FORMAT)} - {Math.floor(event.ageSince)} Years old</p>
    {isText && <hr/>}
    {isText && event.content && <p className="text-base pb-6">{formatMultilineText(event.content)}</p>}
  </div>;

  if (displayMode == "click") {
    return (
      <Modal
        BackdropComponent={Backdrop}
        onClose={handleCloseDisplayer}
        open={event!=null} >
        <div>
          <div id="modal-wrapper" 
            {...swipeHandlers}
            className="flex bg-black md:w-desktop fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-full overflow-scroll h-full"
          >
            <div id="modal-icon">
              <IconButton
                onClick={handleCloseDisplayer}
                className="bg-black bg-opacity-40 text-white outline-none absolute top-2 right-1 w-8 h-8 z-40"
                aria-label="edit" color="primary">
                <CloseIcon></CloseIcon>
              </IconButton>
              {editable && event.type != 'today' && 
              <IconButton 
                onClick={() => onEditEvent(eventId)} 
                aria-label="edit" color="primary" 
                className="outline-none absolute top-2 left-1 bg-black bg-opacity-40 text-white w-8 h-8 z-40">
                <EditIcon></EditIcon>
              </IconButton>
              }
            </div>

            <div id="modal-content" 
              className="w-full md:w-desktop bg-white md:bg-black bg:bg-opacity-40 m-auto flex flex-col justify-center"
            >
              {isMedia && media}
              {isText && text}
            </div>
          </div>
          <div id="modal-navigation">
            <MobileStepper
              className="absolute bottom-0 left-0 w-full bg-black justify-center"
              variant="dots"
              steps={events.length}
              position="static"
              activeStep={currentEventIndex || 0 }
              sx={{ 
                maxWidth: "100%", 
                flexGrow: 1 ,
                '& .MuiMobileStepper-dot': {
                  backgroundColor: "white",
                  opacity: "40%",
                },
                '& .MuiMobileStepper-dotActive': {
                  opacity: "100%",
                }
              }}
              nextButton={
                <IconButton
                  onClick={() => handleJumpEvent(false)}
                  className="bg-black bg-opacity-40 text-white outline-none fixed top-1/2 transform -translate-y-1/2  right-1 w-8 h-8 z-40"
                  aria-label="edit" color="primary">
                  <KeyboardArrowRight />
                </IconButton>
              }
              backButton={
                <IconButton
                  onClick={() => handleJumpEvent(true)}
                  className="bg-black bg-opacity-40 text-white outline-none fixed top-1/2 transform -translate-y-1/2  left-1 w-8 h-8 z-40"
                  aria-label="edit" color="primary">
                  <KeyboardArrowLeft />
                </IconButton>
              }/>
          </div>
        </div>
      </Modal>
    )} else {
      const anchorEl = displayInfo.hoverAnchorEl;
      return (
        <Popper open={anchorEl ? true : false} anchorEl={anchorEl ? anchorEl : null}>
          <div id="modal-content" 
            className={`w-full md:w-desktop bg-white md:bg-white bg:bg-opacity-40 m-auto flex flex-col justify-center border-2 shadow-xl border-gray-300 rounded overflow-y-scroll max-h-3/5-screen`}
          >
            {isMedia && media}
            {isText && text}
          </div>
        </Popper>)
    }
}

const Layout = React.memo(function LayoutComponent ({ events, birthday, numCols, numRows, modalRef, displayMode="month", setDisplayInfo }) {
  const today = roundDate(dayjs());
  const [ clickState, setClickState ] = useState(false);

  function eventsLookup(startDate, endDate){
    var results = [];
    var start = false; 
    for (let e of events) { // events is default sorted ascending
      if (e.event.date >= startDate) start = true;
      if (e.event.date >= endDate) break;
      if (start) results.push(e);
    }
    return results;
  }

  function getTile(r, c) {
    const startDate = birthday.add((r * numCols) + c , displayMode),
      endDate = startDate.add(1, displayMode),
      matchedEvents = eventsLookup(startDate, endDate);

    var tileType = matchedEvents.length > 0 ? matchedEvents[0].event.type : null;
    if (!tileType) tileType = startDate < today ? "default" : "disable"; 

    const onClickHandler = setDisplayInfo && (matchedEvents.length > 0 && !["default", "disable"].includes(tileType)) 
      ? () => { 
        console.log("click", clickState);
        setClickState(true);
        setDisplayInfo({
          eventId: matchedEvents[0].id,
          mode:"click",
          hoverAnchorEl:null,
        });
      } : () => {};

    const onMouseEnterHandler = setDisplayInfo && (matchedEvents.length > 0 && !["default", "disable"].includes(tileType)) 
      ? (e) => { 
        console.log("enter", clickState);
        setClickState(false);
        setDisplayInfo({
          eventId: matchedEvents[0].id,
          mode:"hover",
          hoverAnchorEl: e.currentTarget,
        });
      } : () => {};

    const onMouseLeaveHandler = setDisplayInfo && (matchedEvents.length > 0 && !["default", "disable"].includes(tileType)) 
      ? () => { 
        if (!clickState)  {
          console.log("leave", clickState);
          setDisplayInfo({
            eventId: null,
            mode: null,
            hoverAnchorEl: null,
          });
        }
      } : () => {};

    return (<div 
      key={`${r},${c}`}
      onClick={onClickHandler}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      className={`w-tile sm:w-sm-tile h-tile sm:h-sm-tile m-tile sm:m-sm-tile
      transform hover:scale-125 
      hover:bg-${constants.EVENTMAPPING[tileType].color}-500 bg-${constants.EVENTMAPPING[tileType].color}-300 
      hover:z-10 z-0 relative
      text-xs text-center
      md:text-lg`}>
      {constants.EVENTMAPPING[tileType].icon}
    </div>)
  }

  return (
    <div className="relative md:overflow-y-hidden md:overflow-x-scroll md:flex md:pt-8 md:absolute md:w-9/10 md:left-0 md:left-1/2 md:transform md:-translate-x-2/4">
      {numRows > 0 && Array.from(Array(numRows + 1).keys()).map((r) =>
      <div key={`row-wrapper-${r}`} className="flex justify-center md:w-16">
        <div key={`row-${r}`} className="justify-start items-center relative flex md:flex-col">
          <div key={`row-index-${r}`} className="w-4 m-tile sm:m-sm-tile text-xs md:text-lg text-right md:text-center absolute -left-board sm:-left-sm-board md:left-0 top-0 md:-top-8 md:w-sm-tile">{r % 5 == 0 ? r : ""}</div>
          {numCols > 0 && Array.from(Array(numCols).keys()).map((c) => 
            getTile(r, c)
          )}
        </div>
      </div>
      )}
    </div>
  )
})

function Board({ events, birthday, maxAge, editable, onEditEvent }) {
  const today = roundDate(dayjs());
  const [ displayInfo, setDisplayInfo ] = useState({eventId: null, hoverAnchorEl:null, mode:null}); // mode : hover or click
  const [ updated, setUpdated ] = useState(false);
  const [ eventsList, setEventsList ] = useState([]);
  const [ birthdayState, setBirthday ] = useState(formatDate(birthday));
  // sort the events 

  birthday = formatDate(birthday);
  const numRows = maxAge,
    numCols = 12;

  useEffect(() => {
    if (!updated){
      Object.keys(events).forEach((eventId) => {
        const e = events[eventId]
        e.date = formatDate(e.date);
        e.ageSince = (e.date - birthday) / ( 1000 * 60 * 60 * 24 * 365 );
      });
      let tempEventsList = []
      Object.keys(events).forEach((id) => {
        tempEventsList.push({id:id, event: events[id]})
      })
      tempEventsList.sort((a, b) => a.event.date - b.event.date );// ascending
      setEventsList(tempEventsList);
      setUpdated(true);
    }
  });

  if (!updated) return <Loading />;

  return(
    <>
      <EventDisplayer displayInfo={displayInfo} events={eventsList} editable={editable} onEditEvent={onEditEvent} setDisplayInfo={setDisplayInfo}/>
      <Layout events={eventsList} numCols={numCols} numRows={numRows} birthday={birthday} setDisplayInfo={setDisplayInfo}/>
    </>
  )
}

export default Board;
