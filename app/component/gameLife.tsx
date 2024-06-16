'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Pause, Play } from './icons'

const GameLife = () => {
  const [widthArray, setWidthArray] = useState(20)
  const [heightArray, setHeightArray] = useState(20)
  const [sizeCell, setSizeCell] = useState(20)

  const [cellules, setCellules] = useState<number[][]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const [speed, setSpeed] = useState(250)

  const initiation = () => {
    for (let i = 0; i < widthArray; i++) {
      cellules[i] = []
      for (let j = 0; j < heightArray; j++) {
        cellules[i][j] = 0
      }
    }
  }

  const newSeed = () => {
    let newCellules: number[][] = []

    for (let i = 0; i < widthArray; i++) {
      newCellules[i] = []
      for (let j = 0; j < heightArray; j++) {
        // generate random between 0 and 1
        newCellules[i][j] = Math.floor(Math.random() * 2)
      }
    }

    setCellules([...newCellules])
  }

  const moduloWidth = (x: number) => {
    return ((x % widthArray) + widthArray) % widthArray
  }

  const moduloHeight = (y: number) => {
    return ((y % heightArray) + heightArray) % heightArray
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
      array[moduloWidth(i - 1)][moduloHeight(j - 1)] +
      array[moduloWidth(i - 1)][moduloHeight(j)] +
      array[moduloWidth(i - 1)][moduloHeight(j + 1)] +
      array[moduloWidth(i)][moduloHeight(j - 1)] +
      array[moduloWidth(i)][moduloHeight(j + 1)] +
      array[moduloWidth(i + 1)][moduloHeight(j - 1)] +
      array[moduloWidth(i + 1)][moduloHeight(j)] +
      array[moduloWidth(i + 1)][moduloHeight(j + 1)]

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

      for (let i = 0; i < widthArray; i++) {
        newCellules[i] = []
        for (let j = 0; j < heightArray; j++) {
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

  useEffect(() => {
    initiation()
    newSeed()
  }, [widthArray, heightArray])

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold">Jeu de la vie</h1>
      <div className="flex flex-col space-y-2 m-5">
        {cellules.map((ligne, i) => (
          <div className="flex space-x-2" key={i}>
            {ligne.map((cellule, j) => (
              <div
                key={j}
                style={{ width: `${sizeCell}px`, height: `${sizeCell}px` }}
                className={`border-2 border-black ${
                  cellule === 0 ? 'bg-white' : 'bg-black'
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-2 w-1/2">
        <div className="flex flex-col gap-2">
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

          <h2 className="text-2xl font-bold">Configuration</h2>

          <div className="flex flex-col gap-2">
            <input
              type="range"
              min="100"
              max="1000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
            />
            <span>Speed : {speed} ms</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <input
                type="range"
                min="10"
                max="100"
                value={widthArray}
                onChange={(e) => setWidthArray(Number(e.target.value))}
                disabled={isRunning}
              />
              <span>Width : {widthArray}</span>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="range"
                min="10"
                max="100"
                value={heightArray}
                onChange={(e) => setHeightArray(Number(e.target.value))}
                disabled={isRunning}
              />
              <span>Height : {heightArray}</span>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="range"
                min="10"
                max="100"
                value={sizeCell}
                onChange={(e) => setSizeCell(Number(e.target.value))}
                disabled={isRunning}
              />
              <span>Size cell : {sizeCell}px</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
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
