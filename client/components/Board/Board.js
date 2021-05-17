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

function EventDisplayer ({ events, eventId, onEditEvent, setEventId, editable}) {

  var event = null;
  const [ currentEventIndex, setCurrentEventIndex ] = useState(null);
  for (var i = 0; i < events.length; i ++) {
    if (events[i].id == eventId){
      event = events[i].event;
      if (currentEventIndex == null) setCurrentEventIndex(i);
      break;
    }
  }

  function handleJumpEvent(prev=false) {
    let nextEventId = null;
    let foundCurrentOne = false;
    for (var i = 0; i < events.length; i++){
      if (prev) var index = (events.length - 1) - i;
      else index = i;
      if ( !foundCurrentOne ){
        if (events[index].id == eventId) foundCurrentOne = true; // next loop will be the next event t show
      } else {
        nextEventId = events[index].id;
        setCurrentEventIndex(index);
        break;
      }
    };
    setEventId(nextEventId); // if the nextEventId is null the displayer will be closed
    if (nextEventId == null)  {
      setCurrentEventIndex(null);
    }
  }

  function handleCloseDisplayer() {
    // the trigger of this component to display is the value of eventId . 
    // It's set by setEventId, A hook shared by both EventDisplayer and Layout
    // This complication is to reduce the number of re-renders on the board
    setEventId(null);
    setCurrentEventIndex(null);
  }

  function handleKeyUp(e) {
    switch (e.keyCode){
      case 27: // esc
      case 40: // down
        console.log("down");
        handleCloseDisplayer();
        break;
      case 37: // left
        console.log("left");
        handleJumpEvent(true);
        break;
      case 39: // right
        console.log("right");
        handleJumpEvent();
        break;
    }
  }
  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [eventId]);


  const swipeHandlers= useSwipeable({ 
    //onSwipedDown: handleCloseDisplayer,
    //onSwipedUp: handleCloseDisplayer,
    onSwipedRight: () => handleJumpEvent(true),
    onSwipedLeft: () => handleJumpEvent(false),
  })


  if (!eventId || !event) return (<></>);


  const isText = event.title.length > 0;
  const isMedia = event.imageUrls.length > 0;
  const media = <div className={`bg-black h-1/2`}>
    {isMedia && event.imageUrls.length > 0 && 
    <img 
      alt={event.date.format(DATE_RANGE_FORMAT)}
      style={{height:"100%"}}
      className={`object-contain m-auto`}
      src={event.imageUrls[0]}/>}
    <hr></hr>
  </div>


    // text
    const text = <div 
      className={`bg-white px-10 py-5 text-black text-left ${isMedia ? "min-h-1/2" : ""}`}>
      <p className="text-lg font-bold overflow-ellipsis">{event.title}</p>
      {isText && event.content && <p className="text-base mb-2">{formatMultilineText(event.content)}</p>}
      <hr/>
      <p className={`text-sm text-gray-500 ${isMedia ? "pb-6" : ""}`}>{event.date.format(DATE_RANGE_FORMAT)} - {Math.floor(event.ageSince)} Years old</p>
    </div>

    return (
      <div  {...swipeHandlers}
        className={` fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-full z-20 h-full bg-black`}>
        <div id="modal-wrapper" 
          className="bg-white flex overflow-scroll outline-none h-full justify-start">
          <div id="modal-icon">
            <IconButton
              onClick={handleCloseDisplayer}
              className="bg-black bg-opacity-40 text-white outline-none absolute top-2 right-1 w-6 h-6 z-40"
              aria-label="edit" color="primary">
              <CloseIcon fontSize="small"></CloseIcon>
            </IconButton>
            {editable && 
            <IconButton 
              onClick={() => onEditEvent(eventId)} 
              aria-label="edit" color="primary" 
              className="outline-none absolute top-2 left-1 bg-black bg-opacity-40 text-white w-6 h-6 z-40">
              <EditIcon fontSize="small"></EditIcon>
            </IconButton>
            }
          </div>

          <div id="modal-content" 
            className="w-full bg-black m-auto h-full flex flex-col justify-center md:w-desktop"
          >
            {isMedia && media}
            {isText && text}

            <MobileStepper
              className="fixed bottom-0 left-0 w-full bg-black justify-center"
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
                  className="bg-black bg-opacity-40 text-white outline-none fixed top-1/2 transform -translate-y-1/2  right-1 w-6 h-6 z-40"
                  aria-label="edit" color="primary">
                  <KeyboardArrowRight />
                </IconButton>

              }
              backButton={
                <IconButton
                  onClick={() => handleJumpEvent(true)}
                  className="bg-black bg-opacity-40 text-white outline-none fixed top-1/2 transform -translate-y-1/2  left-1 w-6 h-6 z-40"
                  aria-label="edit" color="primary">
                  <KeyboardArrowLeft />
                </IconButton>
              }
            />
          </div>
        </div>
      </div>
    )
}

const Layout = React.memo(function LayoutComponent ({ events, birthday, numCols, numRows, modalRef, displayMode="month", setEventId }) {
  const today = roundDate(dayjs());

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

    const onClickHandler = (matchedEvents.length > 0 && !["default", "disable"].includes(tileType)) 
      ?  () => {
        setEventId(matchedEvents[0].id);
      } : () => {};

    return (<div 
      key={`${r},${c}`}
      onClick={onClickHandler}
      className={`w-tile sm:w-sm-tile h-tile sm:h-sm-tile m-tile sm:m-sm-tile
      transform hover:scale-125 
      hover:bg-${constants.EVENTMAPPING[tileType].color}-500 bg-${constants.EVENTMAPPING[tileType].color}-300 
      hover:z-10 z-0 relative
      text-xs text-center
      sm:text-xl bg-black
    `}>
      {constants.EVENTMAPPING[tileType]['icon']}
    </div>)
  }

  return (
    <div className="relative flex flex-col">
      {numRows > 0 && Array.from(Array(numRows + 1).keys()).map((r) =>
      <div key={`row-wrapper-${r}`} className="flex justify-center">
        <div key={`row-${r}`} className="justify-start items-center relative flex flex-row">
          <div key={`row-index-${r}`} className="w-4 m-tile sm:m-sm-tile text-xs sm:text-xl text-right absolute -left-board sm:-left-sm-board">{r % 5 == 0 ? r : ""}</div>
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
  const [ storyId, setEventId ] = useState(null);
  const [ updated, setUpdated ] = useState(false);
  const [eventsList, setEventsList ] = useState([]);
  const [birthdayState, setBirthday] = useState(formatDate(birthday));
  // sort the events 

  birthday = formatDate(birthday);
  const numRows = maxAge,
    numCols = 12;

  useEffect(() => {
    if (!updated){
      Object.keys(events).forEach((storyId) => {
        const e = events[storyId]
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
      <EventDisplayer eventId={storyId} events={eventsList} editable={editable} onEditEvent={onEditEvent}  setEventId={setEventId}/>
      <Layout events={eventsList} numCols={numCols} numRows={numRows} birthday={birthday} setEventId={setEventId}/>
    </>
  )
}

export default Board;
