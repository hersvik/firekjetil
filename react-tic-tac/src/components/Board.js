import React from 'react';
import Row from './Row';

class Board extends React.Component {

  constructor(){
    super();
    this.state = {
      board: [
        [11,12,13],
        [21,22,23],
        [31,32,33]
      ]
    }
  }

  render() {
    let rows = this.state.board.map((row, i) => {
      console.log("iii", i)
      return <Row key={i} row={row} />
    });
    return (
          <div>{rows}</div>
    );
  }

}

export default Board;
