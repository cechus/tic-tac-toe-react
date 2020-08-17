import React from "react";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
      </header>
      <Game />
    </div>
  );
}

const clone = (object) => JSON.parse(JSON.stringify(object));
function generateGrid(rows, columns, mapper) {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
}

const newTicTacToe = () => generateGrid(3, 3, () => null);

const NEXT_TURN = {
  O: "X",
  X: "O",
};
const getInitialState = () => ({
  grid: newTicTacToe(),
  status: 'inProgress',
  turn: "X",
});

const isThree = (a, b, c) => {
  if (!a || !b || !c) return false
  return a === b && b === c
}

const isWon = (grid) => {
  const [norOeste, norte, norEste, oeste, centro, este, surOeste, sur, surEste] = grid;
  return (
    isThree(norOeste, norte, norEste) ||
    isThree(oeste, centro, este) ||
    isThree(surOeste, sur, surEste) ||
    isThree(norOeste, oeste, surOeste) ||
    isThree(norte, centro, sur) ||
    isThree(norEste, este, surEste) ||
    isThree(norOeste, centro, surEste) ||
    isThree(norEste, centro, surOeste)
  );
};
const checkForDraw = (grid) => {
  return !isWon(grid) && grid.filter(Boolean).length === grid.length
}
const reducer = (state, action) => {
  if (state.status === 'success' && action.type !== 'RESET') {
    return state;
  }
  switch (action.type) {
    case "RESET":
      return getInitialState();
    case "CLICK":
      const { x, y } = action.payload;
      const { grid, turn } = state;
      if (grid[y][x]) {
        return state;
      }
      const nextState = clone(state);
      nextState.grid[y][x] = turn;
      if (isWon(nextState.grid.flat())) {
        nextState.status = 'success'
        return nextState;
      }
      if (checkForDraw(nextState.grid.flat())) {
        return getInitialState()
      }
      nextState.turn = NEXT_TURN[turn];
      return nextState;
    default:
      return state;
  }
};

// const grid = [
//   [null, null, null],
//   [null, null, null],
//   [null, null, null]
// ]

function Game() {
  const [state, dispatch] = React.useReducer(reducer, getInitialState());

  const { grid, turn, status } = state;
  const handlerClick = (x, y) => {
    dispatch({ type: "CLICK", payload: { x, y } });
  };
  const reset = () => {
    dispatch({ type: "RESET" });
  };
  return (
    <div style={{display: 'inline-block'}}>
      <div style={{display: 'flex', justifyContent:'space-between'}}>
        <div>Next Turn: { turn }</div>
        <div>{ status === 'success' ? `${turn} Won` : status }</div>
        <button onClick={reset} type="button">
          Reset
        </button>
      </div>
      <Grid grid={grid} handlerClick={handlerClick} />
    </div>
  );
}

function Grid({ handlerClick, grid }) {
  return (
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          background: "#444",
          display: "grid",
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 10,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((value, colIdx) => (
            <Cell
              key={`${colIdx}-${rowIdx}`}
              onClick={() => handlerClick(colIdx, rowIdx)}
              value={value}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Cell({ onClick, value }) {
  return (
    <div style={{ backgroundColor: "#fff", width: 100, height: 100 }}>
      <button
        onClick={onClick}
        type="button"
        style={{ width: "100%", height: "100%" }}
      >
        {value}
      </button>
    </div>
  );
}
