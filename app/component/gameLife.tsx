'use client'

import React, { useEffect, useState } from 'react'

const GameLife = () => {
  const sizeArray: number = 20

  const [cellules, setCellules] = useState<number[][]>([])

  const initiation = () => {
    for (let i = 0; i < sizeArray; i++) {
      cellules[i] = []
      for (let j = 0; j < sizeArray; j++) {
        cellules[i][j] = 0
      }
    }
  }

  const newSeed = () => {
    let newCellules: number[][] = []

    for (let i = 0; i < sizeArray; i++) {
      newCellules[i] = []
      for (let j = 0; j < sizeArray; j++) {
        // generate random between 0 and 1
        newCellules[i][j] = Math.floor(Math.random() * 2)
      }
    }

    setCellules(newCellules)
  }

  const moduloSize = (x: number) => {
    return ((x % sizeArray) + sizeArray) % sizeArray
  }

  const countNeighbors = (array: number[][], i: number, j: number): number => {
    // -1,-1
    // -1, 0
    // -1, 1

    // 0, -1
    // 0, 1

    // 1, -1
    // 1, 0
    // 1, 1

    let somme =
      array[moduloSize(i - 1)][moduloSize(j - 1)] +
      array[moduloSize(i - 1)][moduloSize(j)] +
      array[moduloSize(i - 1)][moduloSize(j + 1)] +
      array[moduloSize(i)][moduloSize(j - 1)] +
      array[moduloSize(i)][moduloSize(j + 1)] +
      array[moduloSize(i + 1)][moduloSize(j - 1)] +
      array[moduloSize(i + 1)][moduloSize(j)] +
      array[moduloSize(i + 1)][moduloSize(j + 1)]

    return somme
  }

  const evolutionCell = (array: number[][], i: number, j: number) => {
    let cellLiving: boolean = false
    if (array[i][j]) {
      cellLiving = true
    }

    let numberNeighbors = countNeighbors(array, i, j)

    if (cellLiving) {
      if (numberNeighbors === 2 || numberNeighbors === 3) {
        return 1
      }
    } else {
      if (numberNeighbors === 3) {
        return 1
      }
    }
    return 0
  }

  const evolutionGlobal = () => {
    const newCellules: number[][] = []

    for (let i = 0; i < sizeArray; i++) {
      newCellules[i] = []
      for (let j = 0; j < sizeArray; j++) {
        newCellules[i][j] = cellules[i][j]
      }
    }

    for (let i = 0; i < sizeArray; i++) {
      for (let j = 0; j < sizeArray; j++) {
        newCellules[i][j] = evolutionCell(cellules, i, j)
      }
    }

    setCellules(newCellules)
  }

  useEffect(() => {
    initiation()
    newSeed()
  }, [])

  return (
    <div className="flex flex-col items-center">
      <h1>Jeu de la vie</h1>
      <div className="flex flex-col space-y-2 m-5">
        {cellules.map((ligne, i) => (
          <div className="flex space-x-2" key={i}>
            {ligne.map((cellule, j) => (
              <div
                key={j}
                className={`w-5 h-5 border-2 border-black ${
                  cellule === 0 ? 'bg-white' : 'bg-black'
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-primary text-white"
          onClick={() => evolutionGlobal()}
        >
          Evolution
        </button>
        <button className="btn" onClick={() => newSeed()}>
          New seed
        </button>
      </div>
    </div>
  )
}

export default GameLife
