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

  const initiation = () => {
    for (let i = 0; i < widthArray; i++) {
      cellules[i] = []
      for (let j = 0; j < heightArray; j++) {
        cellules[i][j] = 0
      }
    }

    setCellules([...cellules])
    // Supprimer tout ce qu'il y a après indexHistorique dans le tableau historiqueCellules
    // historiqueCellules.current.splice(indexHistorique.current + 1)
    // historiqueCellules.current.push([...cellules])
    // indexHistorique.current = historiqueCellules.current.length - 1
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
    // historiqueCellules.current.splice(indexHistorique.current + 1)
    // historiqueCellules.current.push([...newCellules])
    // indexHistorique.current = historiqueCellules.current.length - 1
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
    if (historiqueCellules.current.length === 0) {
      historiqueCellules.current.push([...cellules])
    }

    console.log('evolutionGlobal')

    setCellules((prevCellules) => {
      const newCellules: number[][] = []

      for (let i = 0; i < widthArray; i++) {
        newCellules[i] = []
        for (let j = 0; j < heightArray; j++) {
          newCellules[i][j] = evolutionCell(prevCellules, i, j)
        }
      }

      console.log('salut : ', historiqueCellules.current.length)

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

    // historiqueCellules.current.splice(indexHistorique.current + 1)
    // historiqueCellules.current.push([...cellules])
    // indexHistorique.current = historiqueCellules.current.length - 1
    // console.log('taille : ', historiqueCellules.current.length)
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

  const arriere = () => {
    console.log('historiqueCellules : ', historiqueCellules)
    console.log('indexHistorique : ', indexHistorique.current)
    if (indexHistorique.current > 0) {
      console.log('cible : ', indexHistorique.current - 1)
      setCellules([...historiqueCellules.current[indexHistorique.current - 1]])
      indexHistorique.current--
    }
  }

  const avant = () => {
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
        <div className={`flex flex-col space-y-1 m-5`}>
          {cellules.map((ligne, i) => (
            <div className={`flex space-x-1`} key={i}>
              {ligne.map((cellule, j) => (
                <div
                  key={j}
                  style={{ width: `${sizeCell}px`, height: `${sizeCell}px` }}
                  onClick={() => {
                    cellules[i][j] = cellules[i][j] === 0 ? 1 : 0
                    setCellules([...cellules])
                  }}
                  className={`border-2 border-black ${
                    cellule === 0 ? 'bg-white' : 'bg-black'
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
            onClick={() => avant()}
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
            onClick={() => arriere()}
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

        <h2 className="text-2xl font-bold">Configuration</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <span className="mx-1">Vitesse :</span>
            <input
              type="range"
              min="100"
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
              min="10"
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
