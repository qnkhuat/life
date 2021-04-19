import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';

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
    this.maxAge = props.maxAge;
    this.today = new Date();
    this.birthday = new Date(1998, 4 17);
  }
  render(){
    return (
      <div>
        <Tile 
          message="Here is a message" 
          color="gray" 
          imageurl="https://image.flaticon.com/icons/png/512/124/124582.png"/>
      </div>
    )
  }
}
