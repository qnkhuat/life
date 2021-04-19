import React from 'react';
import ReactDOM from 'react-dom';
import {SketchField, Tools} from 'react-sketch';
import {
  ControlledMenu,
  MenuItem,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import './index.css';
const fabric = require("fabric").fabric;



// ****** Utilities ******
function capitalize(str) {
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
}

function next(db, key){ // next key of the dict
  const keyList = Object.keys(db);
  var keyIndex = keyList.indexOf(key);
  if (keyIndex === -1) return;
  return keyIndex < (keyList.length - 1) ? keyList[keyIndex + 1] : keyList[0];
}

function prev(db, key){ // prev key of the dict
  const keyList = Object.keys(db);
  var keyIndex = keyList.indexOf(key);
  if (keyIndex === -1) return;
  return keyIndex === 0 ? keyList[keyList.length - 1] : keyList[keyIndex-1];
}


function isInBoundingBox(x, y, bx1, by1, bx2, by2){
  // (bx1, by1) is top left
  // (bx2, by2) is bottom right
  if (bx1 <= x && x <= bx2 && by1 <= y && y <= by2){
    return true;
  }
  return false;
}

// ****** Main Components ******

class ExtendedSketchField extends SketchField {

  addTextCustom = (text, options={}) => {
    let canvas = this._fc;
    
    // Remove emtpy objects
    for (const o of canvas.getObjects()){
      if (o.text === "" && o.constructor === fabric.IText) canvas.remove(o);
    }

    let iText = new fabric.IText(text, options);
    let opts = {
      left: options.x + canvas.vptCoords.tl.x,
      top: options.y + canvas.vptCoords.tl.y,
    };
    Object.assign(options, opts);
    iText.set({
      left: options.left,
      top: options.top,
    });

    // Select the existed when click on one
    for (const o of canvas.getObjects()){
      if(o.constructor !== fabric.IText) continue;
      if (isInBoundingBox(opts.left, opts.top, o.aCoords.tl.x, o.aCoords.tl.y, o.aCoords.br.x, o.aCoords.br.y)){
        o.enterEditing();
        canvas.setActiveObject(o);
        return;
      }
    }
    canvas.add(iText);
    const objects = canvas.getObjects();
    const object = objects[objects.length - 1];
    object.enterEditing();
    canvas.setActiveObject(object);
  };
};


class Paper extends React.Component {
  constructor(props) {
    super(props);
    this.menuTimeoutId = null; // keep track of timeout to close menu
    this.notiTimeoutId= null; // keep track of timeout to close menu
    this.state = {
      selectedMode: 'text',
      menuOpen: false,
      intact: true,
      tool: Tools.Pan,
      toolLineWidth: 3,
      toolColor: "black",
      noti: "",
    };
    this.options = {
      selector: {label: '🤚', tool:Tools.Select, lineWidth:5, color:'black'},
      square: {label: '🟥', tool:Tools.Rectangle, lineWidth:5, color:'black'},
      circle: {label: '⭕️', tool:Tools.Circle, lineWidth:5, color:'black'},
      line: {label: '📏', tool:Tools.Line, lineWidth:5, color:'black'},
      eraser: {label: '🧽', tool:Tools.Pencil, lineWidth:60, color:'white'},
      pencil: {label: '✏️', tool:Tools.Pencil, lineWidth:5, color:'black'},
      text: {label: '🔤', tool:Tools.Pan, lineWidth: null, color:null},
      move: {label: '📍', tool:Tools.Pan, lineWidth: null, color:null},
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleOnKeyDown.bind(this));
  }

  setMode(mode) {
    const option = this.options[mode];
    this.setState({
      selectedMode: mode,
      tool: option.tool,
      toolColor: option.color,
      toolLineWidth: option.lineWidth,
    })
    this.setNoti(capitalize(mode));
  }

  setNoti(message) {
    this.setState({
      noti:message,
    });
    if (this.notiTimeoutId !== null) clearTimeout(this.notiTimeoutId);
    this.notiTimeoutId = setTimeout(() => {
      this.setState({noti:""});
    }, 1000);
  }

  handleOnModeChange(e) {
    this.setMode(e.value);
    this.setState({menuOpen:false});
  }

  handleOnMouseOver() { // for phone only
    this.setState({menuOpen:true});
  }

  handleOnMouseLeave() {
    this.setState({menuOpen:false});
  }

  handleOnSketchChange() {
    if (this.state.intact){
      this.setState({intact:false})
    }
  }

  handleOnKeyDown(e){
    if (e.metaKey || e.ctrlKey) {
      var hit = false;
      if (e.key === 'z') {
        hit = true;
        e.preventDefault();
        this.setMode(prev(this.options, this.state.selectedMode));
      }
      if (e.key === 'x') {
        hit = true;
        this.setMode(next(this.options, this.state.selectedMode));
      }

      if(!hit) return; // exit if not any desiable key is pressed
      if (!this.state.menuOpen) this.setState({menuOpen:true});
      if (this.menuTimeoutId != null) clearTimeout(this.menuTimeoutId);
      this.menuTimeoutId = setTimeout(() => {
        if (this.state.menuOpen) this.setState({menuOpen:false});
      }, 1000);
    }
  }

  handleOnMouseDown(e){
    if(this.state.selectedMode !== 'text') return;
    const x = e.clientX,
      y = e.clientY;
    this._sketch.addTextCustom("", {x:x, y:y});
  }

  render() {
    const intro = <div className="w-full center fixed z-50 text-center animate-pulse">
      <p className="text-2xl text-gray-500 font-bold">If they give you ruled paper<br></br>write the other way.</p>
      <i className="text-gray-400">- Juan Ramón Jiménez</i>
    </div>
      const noti = <div className="center top-1/4 fixed z-50 text-center">
        <p className = "text-red-400 font-bold text-3xl">{this.state.noti}</p>
        <p className = "text-gray-400 text-xl font-bold">Press cmd/ctrl + z/x to change tool.</p>
      </div>

      const menuRef = React.createRef();

    return (
      <div id="wrapper" className="bg-transparent" tabIndex="0">
        {this.state.intact === true && intro}
        {this.state.noti !== "" && noti}
        <div id="menu" className='fixed z-50 bottom-6 right-6'
          onMouseLeave={this.handleOnMouseLeave.bind(this)}
          onMouseOver={this.handleOnMouseOver.bind(this)}
        >
          <div>

            {<button 
              className='text-2xl md:text-3xl rounded-full w-12 md:w-16 h-12 md:h-16 text-center bg-pink-300 focus:outline-none'
              ref={menuRef} 
            >{this.options[this.state.selectedMode]['label']}</button>}
            <ControlledMenu
              className='bg-transparent shadow-none min-w-0 text-center'
              anchorRef={menuRef}
              direction='top'
              isOpen={this.state.menuOpen}
              onClick={this.handleOnModeChange.bind(this)}
            >
              {this.options.length !== 0 && Object.keys(this.options).map((key, index) =>
              <MenuItem value={key} key={key} 
                className={`p-0 rounded-full mt-2 ${key === this.state.selectedMode ? 'bg-pink-300' : 'bg-green-300 hover:bg-blue-300' } h-12 md:h-16`}>
                <p className="w-12 md:w-16 text-2xl md:text-3xl inline-block text-center">{this.options[key]['label']}</p>
              </MenuItem>
              )}
            </ControlledMenu>
          </div>
        </div>

        <div id="paper" 
          className="absolute w-screen h-screen top-0 left-0 overflow-auto">
          <div id="sketch" 
            className={`bg-transparent w-full h-full  absolute ${this.state.selectedMode === "text" ? "cursor-text" : "cursor-auto"}`}
            onMouseDown={this.handleOnMouseDown.bind(this)}
          >
            <ExtendedSketchField
              width='100%'
              height='100%'
              ref={(c) => (this._sketch = c)}
              tool={this.state.tool}
              lineColor={this.state.toolColor}
              lineWidth={this.state.toolLineWidth}
              onChange={this.handleOnSketchChange.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  render(){
    return (
      <Paper/>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

