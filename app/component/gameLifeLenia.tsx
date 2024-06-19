'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Collapse, Expand, Pause, Play } from './icons'

const GameLifeLenia = () => {
  const [widthArray, setWidthArray] = useState<number>(20)
  const [heightArray, setHeightArray] = useState<number>(20)
  const [sizeCell, setSizeCell] = useState<number>(20)

  const [cellules, setCellules] = useState<number[][]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  const [speed, setSpeed] = useState<number>(250)
  const [open, setOpen] = useState<boolean>(false)

  const initiation = () => {
    const newCellules: number[][] = []
    for (let i = 0; i < widthArray; i++) {
      newCellules[i] = []
      for (let j = 0; j < heightArray; j++) {
        newCellules[i][j] = 0
      }
    }
    setCellules([...newCellules])
  }

  const newSeed = () => {
    const newCellules: number[][] = []
    for (let i = 0; i < widthArray; i++) {
      newCellules[i] = []
      for (let j = 0; j < heightArray; j++) {
        newCellules[i][j] = Math.random()
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

  const growthRate = (sum: number): number => {
    const mu = 0.5 // moyenne 3.0
    const sigma = 0.15 // écart-type 1.0
    return Math.exp(-Math.pow(sum - mu, 2) / (2 * Math.pow(sigma, 2))) - 0.5
  }

  // Cette fonction calcule la nouvelle valeur de la cellule en fonction de la moyenne des valeurs des cellules voisines
  const evolutionCellContinu = (array: number[][], i: number, j: number) => {
    let cellLiving: boolean = array[i][j] > 0
    let totalWeight = 0
    let totalValue = 0

    // Définir un rayon pour le filtrage en anneau
    const radius = 1.5
    const step = 0.5

    for (let dx = -radius; dx <= radius; dx += step) {
      for (let dy = -radius; dy <= radius; dy += step) {
        if (dx * dx + dy * dy <= radius * radius) {
          const neighborX = moduloWidth(Math.floor(i + dx))
          const neighborY = moduloHeight(Math.floor(j + dy))
          // console.log('neighborX : ', neighborX)
          // console.log('neighborY : ', neighborY)
          const weight = 1 - Math.sqrt(dx * dx + dy * dy) / radius
          totalWeight += weight
          totalValue += array[neighborX][neighborY] * weight
        }
      }
    }

    const averageValue = totalValue / totalWeight
    const growth = growthRate(averageValue)

    // Limiter les valeurs des cellules entre 0 et 1
    return Math.max(0, Math.min(1, array[i][j] + growth))
  }

  const evolutionGlobal = () => {
    setCellules((prevCellules) => {
      const newCellules: number[][] = []

      for (let i = 0; i < widthArray; i++) {
        newCellules[i] = []
        for (let j = 0; j < heightArray; j++) {
          newCellules[i][j] = evolutionCellContinu(prevCellules, i, j)
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
    <div className="flex h-full">
      {/* Grille de jeu */}
      <div className="flex-grow">
        <h1 className="text-4xl font-bold">Jeu de la vie (Lenia)</h1>
        <div className={`flex flex-col space-y-1 m-5`}>
          {cellules.map((ligne, i) => (
            <div className={`flex space-x-1`} key={i}>
              {ligne.map((cellule, j) => (
                <div
                  key={j}
                  style={{
                    width: `${sizeCell}px`,
                    height: `${sizeCell}px`,
                    backgroundColor: `rgba(0, 0, 0, ${cellule})`,
                  }}
                  className="border-2 border-black"
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

        <h2 className="text-2xl font-bold">Configuration (Lenia)</h2>
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

export default GameLifeLenia
