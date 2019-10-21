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

  checkWinRow(){
    for (let row of this.state.board) {
      let previous;
      let counter = 0;
      for (let cell of row) {
        if (cell === "-") {
          break;
        }
        if (previous && cell !== previous) {
          break;
        }
        counter++;
        if(counter === 3){
          alert(this.state.turn + " has a winner row!")
          return true;
        }
        previous = cell;
      }
    }
  }

  render() {

    const getClick = (x,y) => {
      // store and re-render:
      let boardCopy = this.state.board.slice();
      boardCopy[y][x] = this.state.turn;
      if(this.state.turn === "x"){
        this.setState({turn: "o"});
      } else {
        this.setState({turn: "x"});
      }
      this.setState({board: boardCopy}, () => this.render());

      this.checkWinRow()
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
