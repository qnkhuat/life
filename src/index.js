import React from 'react';
import ReactDOM from 'react-dom';
import Board, {Tile} from './components/board';
import './index.css'; // Tailwind


function App() {
  return (
    <Board/>
  )
}

ReactDOM.render(<App/>, 
  document.getElementById('root'));
