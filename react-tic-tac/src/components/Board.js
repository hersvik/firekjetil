import React from 'react';

class Board extends React.Component {

  constructor(){
    super();
    this.state = {
      board: [
        [0,0,0],
        [0,0,0],
        [0,0,0]
      ]
    }
  }

  getCells(row) {
    return row.map(cell => {
        return <div className="tic_cell">
          {cell}
        </div>
      }
    )
  }
  
  render() {
    let rows = this.state.board.map(row => {
      return <div className="tic_row">
        {this.getCells(row)}
      </div>
    });
    return (
          <div>{rows}</div>
    );
  }

}

export default Board;
