import React from 'react';
import * as constants from "../constants"

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

dayjs.extend(customParseFormat);

function formatData(data){
  const formatDate = (date) => dayjs(date, constants.dateFormat);
  data.events.forEach(e => e.date = formatDate(e.date));
  data.birthday = formatDate(data.birthday);
  return data;
}


export class Tile extends React.Component {
  constructor(props){
    super(props);
    this.data = props.events;
    this.type = props.type || "default";
    this.title = props.title;
    this.imageurl = props.imageurl;
    this.state = {
    }
  }

  eventToDiv(e){

  }
  render() {
    var toolTip;
    const tile = <div className={`w-3 h-2 bg-${constants.EVENT2COLOR[this.type]}-400 m-1 rounded`}
      ></div>;
    if (this.type == 'default') {
      toolTip = tile
    } else {
      toolTip = <div>
            <Tooltip arrow 
              disableHoverListener={this.title==null}
              leaveDelay={0}
              placement="top"
              open={this.state.open}
              title={
                <React.Fragment>
                  {this.title && 
                  <p className={`text-${constants.EVENT2COLOR[this.type]}-400 text-xl`}>{this.title || "No message"}</p>}
                  {this.imageurl && 
                    <img src={this.imageurl}/>}
                </React.Fragment>
              }
              className="text-red-400"
            >
              {tile}
            </Tooltip>
          </div>
    }
    return (
      <div>{toolTip}</div>
    )
  }
}

export default class Board extends React.Component {
  constructor(props){
    super(props);
    const data = formatData(props.data);

    this.today = new Date();
    data.events.push({
      date: this.today,
      type: "today",
      title: "Today",
    })
    this.data = data;
    this.state = {
      displayMode: 'month', // week | month
      numRows: this.data.maxAge,
      numCols: 12, 
    }
  }

  eventsLookup(startDate, endDate){
    let events = this.data.events.filter((e) => startDate <= e.date && e.date < endDate);
    return events;
  }

  getTile(r, c){
    const 
      startDate = this.data.birthday.add((r * this.state.numCols) + c ,this.state.displayMode),
      endDate = startDate.add(1, this.state.displayMode),
      events = this.eventsLookup(startDate, endDate),
      tileTitle = events.length > 0 ? events[0].title : null;

    var tileType = events.length > 0 ? events[0].type : null;
      if (tileType == null){
        tileType = startDate < this.today ? "default" : "disable"; 
      }

    return (
      <Grid item key={`tile-${r}-${c}`}>
        <Tile key={`${r}-${c}`} 
          type={tileType}
          title={tileTitle}
          events={events}
        />
      </Grid>
    )
  }

  getEvent(row){
  }

  render(){
    this.getTile(0, 0);
    return (
      <div>
        <Grid container spacing={3}>
          {this.state.numRows > 0 && Array.from(Array(this.state.numRows + 1).keys()).map((r) =>
          <Grid key={`row-${r}`} container className="justify-center items-end">
            <Grid item className="w-6 text-sm text-center">{r % 5 == 0 ? r : " "}</Grid>
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
