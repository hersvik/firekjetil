import React from 'react';

function Row(props) {
  function handleClick(e) {
    let x = e.target.getAttribute("x");
    let y = e.target.getAttribute("y")
    props.sendClick(x, y)
  }
  const getCells = function(row) {
    return row.map((cell, j) => {
        return <div x={j} y={props.y} className="tic_cell" onClick={handleClick}>
          {cell}
        </div>
      }
    )
  }

  return (
    <div className="tic_row">
        {getCells(props.row)}
    </div>
  );
}

export default Row;
