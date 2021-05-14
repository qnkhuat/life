import React from 'react';
import Tile from "./Tile";
import * as constants from "./constants";
import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const roundDate = (date) => date.hour(0).minute(0).second(0).millisecond(0);
const formatDate = (date) => roundDate(dayjs(date));

class Board extends React.Component {
  constructor(props){
    super(props);
    this.today = roundDate(dayjs());
    this.events = props.events;
    this.onEditEvent = props.onEditEvent;
    this.events[uuidv4()] = {
      publish:true,
      date: this.today,
      type: "today",
      title: "Today",
      imageUrls: [],
      videoUrls: [],
    };

    this.birthday = formatDate(props.birthday);
    Object.keys(this.events).forEach((storyId) => {
      const e = this.events[storyId]
      e.date = formatDate(e.date);
      e.ageSince = (e.date - this.birthday) / ( 1000 * 60 * 60 * 24 * 365 );
    })

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
    var events = {};
    Object.keys(this.events).forEach((storyId) => {
      const e = this.events[storyId];
      if (startDate <= e.date && e.date < endDate && e.publish) events[storyId] = e;
    });
    return events;
  }

  getTile(r, c){
    const startDate = this.birthday.add((r * this.state.numCols) + c ,this.state.displayMode),
      endDate = startDate.add(1, this.state.displayMode),
      events = this.eventsLookup(startDate, endDate),
      tileTitle = events.length > 0 ? events[0].title : null;
        
    var tileType = Object.keys(events).length > 0 ? Object.entries(events)[0][1].type : null;
    if (!tileType) tileType = startDate < this.today ? "default" : "disable"; 

    return (
      <div key={`item-${r}-${c}`}>
        <Tile key={`tile-${r}-${c}`} 
          startDate={startDate}
          endDate={endDate}
          type={tileType}
          events={events}
          onEditEvent={this.onEditEvent}
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
