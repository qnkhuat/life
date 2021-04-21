import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';
import './index.css'; // Tailwind
import tempData from './tempData.json'

function App() {
  return (
    <div className="my-16">
      <Board data={tempData}/>
    </div>
  )
}

ReactDOM.render(<App/>, 
  document.getElementById('root'));
