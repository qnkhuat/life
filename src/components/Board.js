import React from 'react';
import Tile from "./Tile";
import * as constants from "../constants";

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Grid from '@material-ui/core/Grid';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";



dayjs.extend(customParseFormat);

function formatData(data){
  const formatDate = (date) => dayjs(date, constants.dateFormat);
  data.birthday = formatDate(data.birthday);
  data.events.forEach(e => {
    e.date = formatDate(e.date);
    e.ageSince = (e.date - data.birthday)/ ( 1000 * 60 *60 *24 * 365);
  });
  return data;
}

export default class Board extends React.Component {
  constructor(props){
    super(props);
    this.today = dayjs();
    props.data.events.push({
      date: this.today,
      type: "today",
      title: "Today",
      imageUrls: [],
      videoUrls: [],
    })
    const data = formatData(props.data);
    this.data = data;
    this.state = {
      numRows: this.data.maxAge,
      displayMode: 'month', // week | month
      numCols: 12, 
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
    const changeModeBasedOnWidth = (width) => {
      if (window.innerWidth < constants.MODE_BREAKPOINT && this.state.displayMode !== "month"){
        this.changeDisplayMode("month");
      } else if (window.innerWidth >= constants.MODE_BREAKPOINT && this.state.displayMode !== "week") {
        this.changeDisplayMode("week");
      }
    }

    changeModeBasedOnWidth(window.innerWidth); // execute one after mount

    window.addEventListener("resize", () => {
      changeModeBasedOnWidth(window.innerWidth);
    });
  }

  eventsLookup(startDate, endDate){
    let events = this.data.events.filter((e) => startDate <= e.date && e.date < endDate);
    return events;
  }

  getTile(r, c){
    const startDate = this.data.birthday.add((r * this.state.numCols) + c ,this.state.displayMode),
      endDate = startDate.add(1, this.state.displayMode),
      events = this.eventsLookup(startDate, endDate),
      tileTitle = events.length > 0 ? events[0].title : null;

    var tileType = events.length > 0 ? events[0].type : null;
    if (tileType == null) tileType = startDate < this.today ? "default" : "disable"; 

    return (
      <Grid item key={`item-${r}-${c}`}>
        <Tile key={`tile-${r}-${c}`} 
          startDate={startDate}
          endDate={endDate}
          type={tileType}
          events={events}
          width={constants.TILE['width']}
          height={constants.TILE['height']}
          margin={constants.TILE['margin']}
        />
      </Grid>
    )
  }

  render(){
    return (
      <div>
        <Grid container className="disable-cursor-none">
          {this.state.numRows > 0 && Array.from(Array(this.state.numRows + 1).keys()).map((r) =>
          <Grid key={`row-${r}`} container className="justify-center items-end relative">
            <Grid item key={`row-idnex-${r}`} className="w-6 text-sm text-center">{r % 5 === 0 ? r : " "}</Grid>
            {this.state.numCols > 0 && Array.from(Array(this.state.numCols).keys()).map((c) => 
              this.getTile(r, c)
            )}
          </Grid>
          )}
        </Grid>
      </div>
    )
  }
  
}

