import React, {useRef} from 'react';
import Tile from "./Tile";
import * as constants from "./constants";
import { v4 as uuidv4 } from "uuid";

import Div100vh, { use100vh } from "react-div-100vh";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { formatMultilineText } from "../../lib/util";

import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import Avatar from '@material-ui/core/Avatar';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

dayjs.extend(customParseFormat);

const roundDate = (date) => date.hour(0).minute(0).second(0).millisecond(0);
const formatDate = (date) => roundDate(dayjs(date));
const DATE_RANGE_FORMAT = "DD/MM/YYYY";


class EventDisplayer extends React.Component {
  constructor( props ){
    super(props);
    this.events = props.events;
    this.onEditEvent = props.onEditEvent;
    this.state = {
      openModal: false,
      currentEvent: {},
      currentEventId: null
    };
  }
  handleCloseModal(){
    this.setState({openModal:false});
    setTimeout(() => {
      document.body.style.overflow="auto";
    }, 100);

  }

  next(eventId){
    console.log("next ", eventId);
  }
  prev(eventId){
    console.log("next ", eventId);
  }

  show(eventId) {
    for (let e of this.events){ // events is sorted ascending by date
      if (e.id == eventId){
        this.setState({
          openModal:true,
          currentEventId: e.id,
          currentEvent: e.event,
        })
        return;
      }
    }
    console.error(`Event with id ${eventId} not found.`);
  }

  render () {
    if (Object.keys(this.state.currentEvent).length == 0) return <></>;
    const eventInfo = this.state.currentEvent;
    const eventId = this.state.currentEventId;

    const isText = eventInfo.title.length > 0;
    const isMedia = eventInfo.imageUrls.length > 0;
    const media = <div className={`bg-black`}>
      {isMedia && eventInfo.imageUrls.length > 0 && <img 
        alt={eventInfo.date.format(DATE_RANGE_FORMAT)}
        style={{height:"40vh"}}
        className={`object-contain m-auto`}
        src={eventInfo.imageUrls[0]}/>}
      <hr></hr>
    </div>

      // text
      const text = <div 
        className={`tooltip-text bg-white px-5 py-5 text-black text-left `}>
        <p className="text-lg font-bold overflow-ellipsis">{eventInfo.title}</p>
        {isText && eventInfo.content && <p className="text-base mb-2">{formatMultilineText(eventInfo.content)}</p>}
        <hr/>
        <p className="text-sm text-gray-500">{eventInfo.date.format(DATE_RANGE_FORMAT)} - {Math.floor(eventInfo.ageSince)} Years old</p>
      </div>


    return (
      <div className={`${this.state.openModal ? "" : "hidden"} fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-full z-20 bg-black bg-opacity-40`}>
        <Div100vh className="bg-black bg-opacity-5 flex overflow-scroll outline-none">
          <div id="modal-icon">
            <IconButton
              onClick={this.handleCloseModal.bind(this)}
              className="bg-black bg-opacity-50 text-white outline-none absolute top-1 right-2 w-6 h-6"
              aria-label="edit" color="primary">
              <CloseIcon fontSize="small"></CloseIcon>
            </IconButton>
            <IconButton 
              onClick={() => this.onEditEvent(eventId)} 
              aria-label="edit" color="primary" 
              className="outline-none absolute top-8 right-2 bg-black bg-opacity-50 text-white w-6 h-6">
              <EditIcon fontSize="small"></EditIcon>
            </IconButton>
          </div>

          <div id="modal-content" 
            className="w-full bg-white m-auto"
          >
            {isMedia && media}
            {isText && text}
          </div>
        </Div100vh>
      </div>
    )
  }

}

function Layout ({ events, birthday, numCols, numRows, modalRef, displayMode="month" }) {
  const today = roundDate(dayjs());

  function eventsLookup(startDate, endDate){
    var results = [];
    var start = false; 
    for (let e of events) { // events is default sorted ascending
      if (e.event.date >= startDate) start = true;
      if (e.event.date > endDate) break;
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

    const onClickHandler = ["default", "disable"].includes(tileType) && modalRef.current ? () => {} : () => modalRef.current.show(matchedEvents[0].id);

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
          <div key={`row-index-${r}`} className="w-4 m-tile sm:m-sm-tile text-xs sm:text-xl text-right absolute -left-board sm:-left-sm-board">{r%5==0 ? r : ""}</div>
          {numCols > 0 && Array.from(Array(numCols).keys()).map((c) => 
            getTile(r, c)
          )}
        </div>
      </div>
      )}
    </div>

  )
}
function Board({events, birthday, maxAge, onEditEvent}) {

  const displayerRef = useRef(null);
  const today = roundDate(dayjs());
  birthday = formatDate(birthday);
  // sort the events 
  events[uuidv4()] = {
    publish:true,
    date: today,
    type: "today",
    title: "Today",
    imageUrls: [],
    videoUrls: [],
  };

  const numRows = 25,
    numCols = 12;

  birthday = formatDate(birthday);
  Object.keys(events).forEach((storyId) => {
    const e = events[storyId]
    e.date = formatDate(e.date);
    e.ageSince = (e.date - birthday) / ( 1000 * 60 * 60 * 24 * 365 );
  })


  var eventsList = [];
  Object.keys(events).forEach((id) => {
    eventsList.push({id:id, event: events[id]})
  })
  eventsList.sort((a, b) => a.event.date - b.event.date );// ascending

  return(
    <>
      <EventDisplayer events={eventsList} ref={displayerRef} onEditEvent={onEditEvent}/>
      <Layout events={eventsList} numCols={numCols} numRows={numRows} birthday={birthday} modalRef={displayerRef}/>
    </>
  )

}

export default Board;
