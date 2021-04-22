import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';
import './index.css'; // Tailwind

function App(data) {
  return (
    <div className="my-16">
      <Board data={data.data}/>
    </div>
  )
}

fetch("tempData.json")
.then((r) => r.json())
.then((data) =>{
    ReactDOM.render(<App data={data}/>, document.getElementById('root'));
})

