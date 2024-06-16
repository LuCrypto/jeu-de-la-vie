'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Pause, Play } from './icons'

const GameLife = () => {
  const sizeArray: number = 20

  const [cellules, setCellules] = useState<number[][]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const [speed, setSpeed] = useState(250)

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

    setCellules([...newCellules])
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
    setCellules((prevCellules) => {
      const newCellules: number[][] = []

      for (let i = 0; i < sizeArray; i++) {
        newCellules[i] = []
        for (let j = 0; j < sizeArray; j++) {
          newCellules[i][j] = evolutionCell(prevCellules, i, j)
        }
      }

      return newCellules
    })
  }

  const run = () => {
    intervalRef.current = setInterval(() => {
      evolutionGlobal()
    }, speed)
    setIsRunning(true)
  }

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
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
      <div className="flex justify-between gap-2">
        <div>
          <button
            className="btn btn-primary text-white"
            onClick={() => {
              if (!isRunning) {
                evolutionGlobal()
                run()
              } else {
                pause()
              }
            }}
          >
            <span>Evolution</span>
            {!isRunning ? <Play /> : <Pause />}
          </button>
          <div className="flex flex-col">
            <input
              type="range"
              min="100"
              max="1000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span>Speed : {speed} ms</span>
          </div>
        </div>

        <div>
          <button className="btn" onClick={() => evolutionGlobal()}>
            One Step
          </button>
          <button className="btn" onClick={() => newSeed()}>
            New seed
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameLife
