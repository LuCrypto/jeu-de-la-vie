'use client'

import React, { useDebugValue, useEffect, useRef, useState } from 'react'
import { Arrow, ArrowRight, Collapse, Expand, Pause, Play } from './icons'

const GameLife = () => {
  const [widthArray, setWidthArray] = useState<number>(20)
  const [heightArray, setHeightArray] = useState<number>(20)
  const [sizeCell, setSizeCell] = useState<number>(20)

  const [cellules, setCellules] = useState<number[][]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  const [speed, setSpeed] = useState<number>(250)
  const [open, setOpen] = useState<boolean>(false)

  const historiqueCellules = useRef<number[][][]>([])
  const indexHistorique = useRef<number>(0)

  const [modeWall, setModeWall] = useState<boolean>(false)

  const [row, setRow] = useState<boolean>(false)
  const [column, setColumn] = useState<boolean>(false)

  const [borderActive, setBorderActive] = useState<boolean>(false)

  const initiation = () => {
    for (let i = 0; i < widthArray; i++) {
      cellules[i] = []
      for (let j = 0; j < heightArray; j++) {
        cellules[i][j] = 0
      }
    }

    setCellules([...cellules])
  }

  const newSeed = () => {
    let newCellules: number[][] = []

    for (let i = 0; i < widthArray; i++) {
      newCellules[i] = []
      for (let j = 0; j < heightArray; j++) {
        newCellules[i][j] = Math.floor(Math.random() * 2)
      }
    }

    setCellules([...newCellules])
  }

  const clear = () => {
    initiation()
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
      (array[moduloWidth(i - 1)][moduloHeight(j - 1)] === -1
        ? 0
        : array[moduloWidth(i - 1)][moduloHeight(j - 1)]) +
      (array[moduloWidth(i - 1)][moduloHeight(j)] === -1
        ? 0
        : array[moduloWidth(i - 1)][moduloHeight(j)]) +
      (array[moduloWidth(i - 1)][moduloHeight(j + 1)] === -1
        ? 0
        : array[moduloWidth(i - 1)][moduloHeight(j + 1)]) +
      (array[moduloWidth(i)][moduloHeight(j - 1)] === -1
        ? 0
        : array[moduloWidth(i)][moduloHeight(j - 1)]) +
      (array[moduloWidth(i)][moduloHeight(j + 1)] === -1
        ? 0
        : array[moduloWidth(i)][moduloHeight(j + 1)]) +
      (array[moduloWidth(i + 1)][moduloHeight(j - 1)] === -1
        ? 0
        : array[moduloWidth(i + 1)][moduloHeight(j - 1)]) +
      (array[moduloWidth(i + 1)][moduloHeight(j)] === -1
        ? 0
        : array[moduloWidth(i + 1)][moduloHeight(j)]) +
      (array[moduloWidth(i + 1)][moduloHeight(j + 1)] === -1
        ? 0
        : array[moduloWidth(i + 1)][moduloHeight(j + 1)])

    return somme
  }

  const evolutionCell = (array: number[][], i: number, j: number) => {
    if (array[i][j] === -1) {
      return -1
    }

    let cellLiving: boolean = false
    if (array[i][j] === 1) {
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
    if (historiqueCellules.current.length === 0) {
      historiqueCellules.current.push([...cellules])
    }

    setCellules((prevCellules) => {
      const newCellules: number[][] = []

      for (let i = 0; i < widthArray; i++) {
        newCellules[i] = []
        for (let j = 0; j < heightArray; j++) {
          newCellules[i][j] = evolutionCell(prevCellules, i, j)
        }
      }

      if (
        !historiqueCellules.current[
          historiqueCellules.current.length - 1
        ].every((row, rowIndex) =>
          row.every(
            (cell, cellIndex) => cell === newCellules[rowIndex][cellIndex]
          )
        )
      ) {
        historiqueCellules.current.splice(indexHistorique.current + 1)
        historiqueCellules.current.push([...newCellules])
        indexHistorique.current = historiqueCellules.current.length - 1
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

  const arriereHistorique = () => {
    if (indexHistorique.current > 0) {
      setCellules([...historiqueCellules.current[indexHistorique.current - 1]])
      indexHistorique.current--
    }
  }

  const avantHistorique = () => {
    if (indexHistorique.current < historiqueCellules.current.length - 1) {
      setCellules(historiqueCellules.current[indexHistorique.current + 1])
      indexHistorique.current++
    }
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
    <div className="flex h-full">
      {/* Grille de jeu */}
      <div className="flex-grow">
        <h1 className="text-4xl font-bold">Jeu de la vie</h1>
        <div className={`flex flex-col m-5`}>
          {cellules.map((ligne, i) => (
            <div className={`flex`} key={i}>
              {ligne.map((cellule, j) => (
                <div
                  key={j}
                  style={{
                    width: `${sizeCell}px`,
                    height: `${sizeCell}px`,
                    border: borderActive ? '1px solid black' : 'none',
                  }}
                  onClick={() => {
                    if (modeWall) {
                      cellules[i][j] = cellules[i][j] === -1 ? 0 : -1

                      if (row) {
                        for (let k = 0; k < widthArray; k++) {
                          cellules[i][k] = -1
                        }
                      }
                      if (column) {
                        for (let k = 0; k < heightArray; k++) {
                          cellules[k][j] = -1
                        }
                      }
                    } else if (cellules[i][j] !== -1) {
                      cellules[i][j] = cellules[i][j] === 0 ? 1 : 0
                    }
                    setCellules([...cellules])
                  }}
                  className={`${
                    cellule === 0
                      ? 'bg-white'
                      : cellule === 1
                      ? 'bg-black'
                      : 'bg-red-500'
                  }`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setOpen(!open)
        }}
        className="mb-4 p-2 bg-blue-500 text-white rounded-l-lg fixed right-0 z-10"
      >
        {open ? <Expand /> : <Collapse />}
      </button>

      {/* Panneau de configuration */}
      <div
        className={`mt-4 p-4 shadow-lg fixed right-0 top-0 bg-white ${
          !open ? 'w-1/4' : 'w-0 p-0'
        }`}
      >
        <div className="flex gap-1">
          <button
            className="btn btn-primary text-white mr-4"
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
          <button
            className="btn"
            onClick={() => avantHistorique()}
            style={{
              opacity:
                indexHistorique.current ===
                  historiqueCellules.current.length - 1 ||
                historiqueCellules.current.length === 0
                  ? 0.3
                  : 1,
            }}
            disabled={
              indexHistorique.current ===
                historiqueCellules.current.length - 1 ||
              historiqueCellules.current.length === 0
            }
          >
            <Arrow />
          </button>

          <button
            className="btn"
            onClick={() => arriereHistorique()}
            disabled={indexHistorique.current === 0}
            style={{
              opacity: indexHistorique.current === 0 ? 0.3 : 1,
            }}
          >
            <ArrowRight />
          </button>
        </div>

        <div className="flex gap-2 my-4">
          <button className="btn" onClick={() => evolutionGlobal()}>
            One Step
          </button>
          <button className="btn" onClick={() => newSeed()}>
            New seed
          </button>
          <button className="btn" onClick={() => clear()}>
            Clear
          </button>
        </div>

        <div className="form-control my-4 flex items-start gap-2">
          <label className="label cursor-pointer flex gap-2">
            <span className="label-text">Mode WALL</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={(e) => setModeWall(e.target.checked)}
            />
          </label>

          <label className="label cursor-pointer flex gap-2">
            <span className="label-text">Border</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={(e) => setBorderActive(e.target.checked)}
            />
          </label>
        </div>

        {modeWall && (
          <div className="flex flex-col gap-2">
            <label htmlFor="wall" className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wall"
                className="checkbox"
                onChange={(e) => setRow(e.target.checked)}
              />
              <span className="label-text">Row</span>
            </label>
            <label htmlFor="wall" className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wall"
                className="checkbox"
                onChange={(e) => setColumn(e.target.checked)}
              />
              <span className="label-text">Column</span>
            </label>
          </div>
        )}

        {modeWall && (
          <p className="text-sm text-gray-500 my-4">
            You can now create walls (like dead cells) by clicking on the cells
          </p>
        )}

        <h2 className="text-2xl font-bold">Configuration</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <span className="mx-1">Vitesse :</span>
            <input
              type="range"
              min="25"
              max="1000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
            />
            <span>{speed} ms</span>
          </label>

          <label className="flex items-center gap-2">
            <span className="mx-1">Largeur :</span>
            <input
              type="range"
              min="10"
              max="100"
              value={heightArray}
              onChange={(e) => setHeightArray(Number(e.target.value))}
              disabled={isRunning}
            />
            <span>{heightArray} px</span>
          </label>

          <label className="flex items-center gap-2">
            <span className="mx-1">Hauteur :</span>
            <input
              type="range"
              min="10"
              max="100"
              value={widthArray}
              onChange={(e) => setWidthArray(Number(e.target.value))}
              disabled={isRunning}
            />
            <span>{widthArray} px</span>
          </label>

          <label className="flex items-center gap-2">
            <span className="mx-1">Taille des cellules :</span>
            <input
              type="range"
              min="5"
              max="100"
              value={sizeCell}
              onChange={(e) => setSizeCell(Number(e.target.value))}
              disabled={isRunning}
            />
            <span>{sizeCell}px</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default GameLife
