import React, { useState } from 'react'

import styles from './App.scss'

const createMatrix = (width = 9, height = 9) => Array(height).fill(null).map(_ => Array(width).fill(null))

const setMatrixValue = (matrix, x, y, v) =>
  matrix.map((row, rowIndex) => y === rowIndex ? setArrayValue(row, x, v) : [...row])

const setArrayValue = (array, position, value) => [...array.slice(0, position), value, ...array.slice(position + 1)]

export const App = () => {
  const [board, setBoard] = useState(createMatrix())

  return (
    <section className={styles.app}>
      <header>Sudoku Score: 0</header>
      <main><Board board={board} onClick={console.log} /></main>
      <footer>Sudoku by <a target="_blank" href="https://tarokun.io">tarokun</a></footer>
    </section>
  )
}

const Board = ({ board, onClick, onKeyPress }) => (
  <div className={styles.board}>
    { board.map((row, rowIndex) => row.map((value, valueIndex) =>
      <Cell key={rowIndex * 9 + valueIndex} value={value} onClick={_ => onClick(rowIndex, valueIndex)} />
    )) }
  </div>
)

const Cell = ({ value, onClick, onKeyPress }) => (
  <div className={styles.cell} onClick={onClick} onKeyPress={onKeyPress}>
    { value }
  </div>
)
