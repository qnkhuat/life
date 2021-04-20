import React from 'react';
import ReactDOM from 'react-dom';
import Board, {Tile} from './components/board';
import './index.css'; // Tailwind
import tempData from './tempData.json'

function App() {
  return (
    <Board data={tempData}/>
  )
}

ReactDOM.render(<App/>, 
  document.getElementById('root'));
