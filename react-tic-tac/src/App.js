import React from 'react';
import './App.css';
import Board from './components/Board'

class App extends React.Component {

  constructor(){
    super();
  }

  render() {
    return (
      <div className="App">
        <Board />
      </div>
    );
  }

}

export default App;
