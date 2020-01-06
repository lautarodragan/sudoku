import classnames from 'classnames'
import React, { useState, useEffect } from 'react'

import styles from './App.scss'

const createMatrix = (width = 9, height = 9) => Array(height).fill(null).map(_ => Array(width).fill(null))

const setMatrixValue = (matrix, x, y, v) =>
  matrix.map((row, rowIndex) => y === rowIndex ? setArrayValue(row, x, v) : [...row])

const setArrayValue = (array, position, value) => [...array.slice(0, position), value, ...array.slice(position + 1)]

const possibleValues = Array(9).fill(null).map((_, i) => i + 1)

const pickValue = _ => _.value

const getRowFromList = (list, point) => list.filter(_ => _.y === point.y)

const getColumnFromList = (list, point) => list.filter(_ => _.x === point.x)

const getRegionFromList = (list, point) => list.filter(({ x, y }) =>
  x >= Math.floor(point.x / 3) * 3 &&
  x < Math.floor(point.x / 3) * 3 + 3 &&
  y >= Math.floor(point.y / 3) * 3 &&
  y < Math.floor(point.y / 3) * 3 + 3
)

const getAvailableValuesFromList = (list, point) => {
  const row = getRowFromList(list, point)
  const column = getColumnFromList(list, point)
  const region = getRegionFromList(list, point)
  const usedValues = [...row, ...column, ...region].map(pickValue)
  return possibleValues.filter(v => !usedValues.includes(v))
}

const getNextPoint = ({ x, y }) => x < 8 ? { x: x + 1, y } : { x: 0, y: y + 1 }

const getNextPointFromList = list => !list.length ? { x: 0, y: 0 } : getNextPoint(list[list.length - 1])

const listToMatrix = list => {
  const matrix = createMatrix()

  for (const { x, y, value } of list)
    matrix[y][x] = value

  return matrix
}

// See https://bost.ocks.org/mike/shuffle/
const shuffleArray = array => {
  const shuffledArray = [...array]

  for (let m = shuffledArray.length; m--; m >= 0) {
    const i = Math.floor(Math.random() * m)
    const t = shuffledArray[m]
    shuffledArray[m] = shuffledArray[i]
    shuffledArray[i] = t
  }

  return shuffledArray
}

const createRandomSudokuRecursive = () => {
  let recursiveCalls = 0

  console.time('recursiveSudoku')

  const recursive = (list = []) => {
    recursiveCalls++

    if (list.length > 80)
      return list

    const nextPoint = getNextPointFromList(list)
    const availableValues = getAvailableValuesFromList(list, nextPoint)

    if (!availableValues.length)
      return null

    for (const availableValue of shuffleArray(availableValues)) {
      const x = recursive([...list, { ...nextPoint, value: availableValue }])
      if (x)
        return x
    }

    return null
  }

  const points = recursive()

  console.log('finished!', recursiveCalls, points.length)
  console.timeEnd('recursiveSudoku')

  return listToMatrix(points)
}

const createBoardWithEmptyCells = (solved) => {
  if (!solved)
    return solved

  const matrix = createMatrix()
  const hiddenCells = 30

  for (let y = 0; y < 9; y++)
    for (let x = 0; x < 9; x++)
      matrix[y][x] = Math.random() > .5 ? solved[y][x] : null

  return matrix
}

export const App = () => {
  const [solvedBoard, setSolvedBoard] = useState()
  const [board, setBoard] = useState()
  const [selectedCell, setSelectedCell] = useState(null)

  const onKeyPress = (event) => {
    const { x, y } = selectedCell
    if (!isNaN(event.key) && event.key !== ' ' && event.key !== '0' && board[y][x] !== solvedBoard[y][x]) {
      setBoard(setMatrixValue(board, x, y, parseInt(event.key)))
    }
  }

  const onKeyDown = event => {
    const { x, y } = selectedCell
    if (event.key === 'Delete')
      setBoard(setMatrixValue(board, x, y, null))
    if (event.key === ' ')
      console.log(solvedBoard[y][x])
  }

  useEffect(() => {
    document.addEventListener('keypress', onKeyPress)
    return () => document.removeEventListener('keypress', onKeyPress)
  }, [selectedCell, board, solvedBoard])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedCell])

  useEffect(() => setSolvedBoard(createRandomSudokuRecursive()), [])
  useEffect(() => setBoard(createBoardWithEmptyCells(solvedBoard)), [solvedBoard])

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
    { board && board.map((row, y) => row.map((value, x) =>
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
