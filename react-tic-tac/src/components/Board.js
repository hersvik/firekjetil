import React from 'react';
import Row from './Row';

class Board extends React.Component {

  constructor(){
    super();
    
    this.state = {
      board: [
        ["-","-","-"],
        ["-","-","-"],
        ["-","-","-"]
      ],
      turn: "x"
    }
  }

  render() {

    const getClick = (x,y) => {
      let boardCopy = this.state.board.slice();
      boardCopy[y][x] = this.state.turn;
      if(this.state.turn === "x"){
        this.setState({turn: "o"});
      } else {
        this.setState({turn: "x"});
      }
      this.setState({board: boardCopy}, () => this.render());
    }

    let rows = this.state.board.map((row, i) => {
      console.log("iii", i)
      return <Row key={i} y={i} row={row} sendClick={getClick} />
    });

    return (
          <div>
            {rows}
            Next turn: {this.state.turn}
          </div>
    );
  }

}

export default Board;
