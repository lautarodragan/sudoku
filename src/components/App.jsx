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
  const usedValuesRow = row.map(pickValue)
  const usedValuesColumn = column.map(pickValue)
  const usedValuesRegion = region.map(pickValue)
  const usedValues = [...usedValuesRow, ...usedValuesColumn, ...usedValuesRegion]
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

    for (const availableValue of availableValues) {
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

export const App = () => {
  const [board, setBoard] = useState()
  const [selectedCell, setSelectedCell] = useState(null)

  const onKeyPress = (event) => {
    if (!isNaN(event.key) && event.key !== '0')
      setBoard(setMatrixValue(board, selectedCell.x, selectedCell.y, parseInt(event.key)))
  }

  const onKeyDown = event => {
    if (event.key === 'Delete')
      setBoard(setMatrixValue(board, selectedCell.x, selectedCell.y, null))
  }

  useEffect(() => {
    document.addEventListener('keypress', onKeyPress)
    return () => document.removeEventListener('keypress', onKeyPress)
  }, [selectedCell])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedCell])

  useEffect(() => setBoard(createRandomSudokuRecursive()), [])

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
