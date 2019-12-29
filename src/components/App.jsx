import classnames from 'classnames'
import React, { useState, useEffect } from 'react'

import styles from './App.scss'

const createMatrix = (width = 9, height = 9) => Array(height).fill(null).map(_ => Array(width).fill(null))

const setMatrixValue = (matrix, x, y, v) =>
  matrix.map((row, rowIndex) => y === rowIndex ? setArrayValue(row, x, v) : [...row])

const setArrayValue = (array, position, value) => [...array.slice(0, position), value, ...array.slice(position + 1)]

const isNotNull = v => v !== null

const getMatrixColumn = (matrix, x) => Array(matrix.length).fill(null).map((_, index) => matrix[index][x])

const getSubMatrix = (matrix, x, y) =>  createMatrix(3, 3)
  .map((row, yy) =>
    row.map((column, xx) => matrix[Math.floor(y / 3) * 3 + yy][Math.floor(x / 3) * 3 + xx])
  )

const possibleValues = Array(9).fill(null).map((_, i) => i + 1)

const getAvailableValues = (matrix, x, y) => {
  const row = matrix[y]
  const column = getMatrixColumn(matrix, x)
  const subMatrix = getSubMatrix(matrix, x, y)
  const usedValuesRow = row.filter(isNotNull)
  const usedValuesColumn = column.filter(isNotNull)
  const usedValuesSubMatrix = subMatrix.flat().filter(isNotNull)
  const usedValues = [...usedValuesRow, ...usedValuesColumn, ...usedValuesSubMatrix]
  return possibleValues.filter(v => !usedValues.includes(v))
}

const createRandomSudoku = () => {
  const matrix = createMatrix()
  for (let x = 0; x < 9; x++)
    for (let y = 0; y < 9; y ++)
      matrix[y][x] = getAvailableValues(matrix, x, y)[0]
  return matrix
}

export const App = () => {
  const [board, setBoard] = useState(createRandomSudoku())
  const [selectedCell, setSelectedCell] = useState(null)

  const onKeyPress = (event) => {
    if (!isNaN(event.key) && event.key !== '0')
    setBoard(setMatrixValue(board, selectedCell.x, selectedCell.y, parseInt(event.key)))
  }

  useEffect(() => {
    document.addEventListener('keypress', onKeyPress)
    return () => document.removeEventListener('keypress', onKeyPress)
  }, [selectedCell])

  return (
    <section className={styles.app}>
      <header>Sudoku Score: 0</header>
      <Board board={board} onClick={setSelectedCell} selectedCell={selectedCell} />
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
