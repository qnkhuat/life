import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
  import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { format, parse } from 'date-fns';
import * as constants from "../constants"


function formatData(data){
  const formatDate = (date) => parse(date, constants.dateFormat, new Date());
  data.birthday = formatDate(data.birthday);
  data.events = data.events.map((e) => e.date = formatDate(e.date));
  return data;
}

export class Tile extends React.Component {
  constructor(props){
    super(props);
    this.type = props.type;
    this.color = props.color || "gray"; // Default is gray
    this.message = props.message;
    this.imageurl = props.imageurl;
  }
  render() {
    return (
      <div> 
        <Tooltip
          title={
            <React.Fragment>
              <p className="text-red-400 text-xl">{this.message || "No message"}</p>
              {this.imageurl && <img src={this.imageurl}/>}
            </React.Fragment>
          }
          className="text-red-400"
        >
          <div className={`w-4 h-4 bg-${this.color}-400`}></div>
        </Tooltip>
      </div>
    )
  }
}

export default class Board extends React.Component {
  constructor(props){
    super(props);
    const data = formatData(props.data);
    console.log(data);
    this.maxAge = data.maxAge; // Equal num per rows
    this.today = new Date();
    this.birthday = parse(data.birthday, constants.dateFormat, new Date());
    this.state = {
      displayMode: 'week', // week | month
      numRows: data.maxAge,
      numCols: 52, 
    }
  }
  render(){
    return (
      <div>
        <Grid container spacing={3}>
          {this.state.numRows > 0 && Array.from(Array(this.state.numRows).keys()).map((r) => <h3>{r}</h3>)}
        </Grid>
      </div>
    )
  }
}
