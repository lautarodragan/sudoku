import classnames from 'classnames'
import React, { useState, useEffect } from 'react'

import styles from './App.scss'

const createMatrix = (width = 9, height = 9) => Array(height).fill(null).map(_ => Array(width).fill(null))

const setMatrixValue = (matrix, x, y, v) =>
  matrix.map((row, rowIndex) => y === rowIndex ? setArrayValue(row, x, v) : [...row])

const setArrayValue = (array, position, value) => [...array.slice(0, position), value, ...array.slice(position + 1)]

export const App = () => {
  const [board, setBoard] = useState(createMatrix())
  const [selectedCell, setSelectedCell] = useState(null)

  const onKeyPress = (event) => {
    setBoard(setMatrixValue(board, selectedCell.x, selectedCell.y, event.key))
  }

  useEffect(() => {
    document.addEventListener('keypress', onKeyPress)
    return () => document.removeEventListener('keypress', onKeyPress)
  }, [selectedCell])

  return (
    <section className={styles.app}>
      <header>Sudoku Score: 0</header>
      <main><Board board={board} onClick={setSelectedCell} selectedCell={selectedCell} /></main>
      <footer>Sudoku by <a target="_blank" href="https://tarokun.io">tarokun</a></footer>
    </section>
  )
}

const Board = ({ board, onClick, selectedCell }) => (
  <div className={styles.board}>
    { board.map((row, y) => row.map((value, x) =>
      <Cell
        key={y * 9 + x}
        value={value}
        onClick={_ => onClick({ x, y })}
        isSelected={selectedCell && selectedCell.x === x && selectedCell.y === y}
      />
    )) }
  </div>
)

const Cell = ({ value, onClick, isSelected }) => (
  <div className={classnames(styles.cell, { [styles.selected]: isSelected })} onClick={onClick}>
    { value }
  </div>
)
