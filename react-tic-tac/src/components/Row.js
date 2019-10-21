import React from 'react';

function Row(props) {

  const getCells = function(row) {
    return row.map(cell => {
        return <div className="tic_cell">
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
