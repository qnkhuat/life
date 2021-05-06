import { isMobile } from 'react-device-detect';
import React from 'react';
import Tile from "./Tile";
import * as constants from "./constants";

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const roundDate = (date) => date.hour(0).minute(0).second(0).millisecond(0);
const formatDate = (date) => roundDate(dayjs(date));

class Board extends React.Component {
  constructor(props){
    super(props);
    this.today = roundDate(dayjs());

    props.events.push({
      publish:true,
      date: this.today,
      type: "today",
      title: "Today",
      imageUrls: [],
      videoUrls: [],
    })

    this.birthday = formatDate(props.birthday);
    props.events.forEach(e => {
      e.date = formatDate(e.date);
      e.ageSince = (e.date - this.birthday) / ( 1000 * 60 * 60 * 24 * 365 );
    });

    // TODO this events should be an object
    this.events = props.events;
    this.autoResize = props.autoResize || false;
    this.state = {
      numRows: props.maxAge,
      displayMode: props.displayMode || 'month', // week | month
      numCols: props.displayMode== "week" ? 52 : 12, 
    }
  }

  changeDisplayMode(mode){
    const numCols = mode === "month" ? 12 : 52;
    this.setState({
      numCols: numCols,
      displayMode: mode,
    });
  }

  componentDidMount() {
    if (!this.autoResize) return;
    const changeModeBasedOnWidth = (width) => {
      if (window.innerWidth < constants.MODE_BREAKPOINT && this.state.displayMode !== "month"){
        this.changeDisplayMode("month");
      } else if (window.innerWidth >= constants.MODE_BREAKPOINT && this.state.displayMode !== "week") {
        this.changeDisplayMode("week");
      }
    }

    changeModeBasedOnWidth(window.innerWidth); // execute once after mount

    window.addEventListener("resize", () => {
      changeModeBasedOnWidth(window.innerWidth);
    });
  }

  eventsLookup(startDate, endDate){
    var events = this.events.filter((e) => startDate <= e.date && e.date < endDate && e.publish);
    if (events.length > 0){
      console.log(startDate, endDate);
      console.log(events);
    }
    
    return events;
  }

  getTile(r, c){
    const startDate = this.birthday.add((r * this.state.numCols) + c ,this.state.displayMode),
      endDate = startDate.add(1, this.state.displayMode),
      events = this.eventsLookup(startDate, endDate),
      tileTitle = events.length > 0 ? events[0].title : null;
        
    var tileType = events.length > 0 ? events[0].type : null;
    if (tileType == null) tileType = startDate < this.today ? "default" : "disable"; 

    return (
      <div key={`item-${r}-${c}`}>
        <Tile key={`tile-${r}-${c}`} 
          startDate={startDate}
          endDate={endDate}
          type={tileType}
          events={events}
          isMobile={isMobile}
        />
      </div>
    )
  }

  render(){
    return (
      <div id="board" className="relative flex flex-col">
        {this.state.numRows > 0 && Array.from(Array(this.state.numRows + 1).keys()).map((r) =>
        <div key={`row-wrapper-${r}`} className="flex justify-center">
          <div key={`row-${r}`} className="justify-start items-center relative flex flex-row">
            <div key={`row-index-${r}`} className="w-4 m-tile sm:m-sm-tile text-xs sm:text-xl text-right absolute -left-board sm:-left-sm-board">{r % 5 === 0 ? r : " "} </div>
            {this.state.numCols > 0 && Array.from(Array(this.state.numCols).keys()).map((c) => 
              this.getTile(r, c)
            )}
          </div>
        </div>
        )}
      </div>
    )
  }
}

export default Board;
