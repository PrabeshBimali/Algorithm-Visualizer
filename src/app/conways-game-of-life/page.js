"use client"
import { useRef, useEffect, useState } from "react";

export default function ConwaysGameOfLife() {
  const canvasRef = useRef(null)
  const ROWS = 45
  const COLS = 80
  const CELL_SIZE = 10
  const [grid, setGrid] = useState(createGrid())
  const [ticksPerSec, setTicksPerSec] = useState(0)
  const [population, setPopulation] = useState(0)

  function createGrid() {
    return Array.from({ length: ROWS }, () =>
      Array(COLS).fill(0)
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (grid[i][j]) {
          ctx.fillRect(
            j * CELL_SIZE,
            i * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          )
        }
      }
    }

    ctx.strokeStyle = "#a9a9a9"
    ctx.lineWidth = 0.5

    ctx.beginPath()

    for (let x = 0; x <= COLS; x++) {
      ctx.moveTo(x * CELL_SIZE, 0)
      ctx.lineTo(x * CELL_SIZE, ROWS * CELL_SIZE)
    }

    for (let y = 0; y <= ROWS; y++) {
      ctx.moveTo(0, y * CELL_SIZE)
      ctx.lineTo(COLS * CELL_SIZE, y * CELL_SIZE)
    }
    
    ctx.stroke()

    ctx.strokeStyle = "#696969"
    ctx.lineWidth = 1

    ctx.strokeRect(
      0.5,
      0.5,
      COLS * CELL_SIZE - 1,
      ROWS * CELL_SIZE - 1
    )

  }, [grid])

  function handleClick(e) {
    const rect = canvasRef.current.getBoundingClientRect()

    const x = Math.floor((e.clientY - rect.top) / CELL_SIZE)
    const y = Math.floor((e.clientX - rect.left) / CELL_SIZE)

    const newGrid = grid.map(row => [...row])
    newGrid[x][y] = newGrid[x][y] ? 0 : 1

    setGrid(newGrid)
  }

  function countNeighbors(grid, x, y) {
    let count = 0;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;

        if (
          nx >= 0 && nx < ROWS &&
          ny >= 0 && ny < COLS
        ) {
          count += grid[nx][ny]
        }
      }
    }

    return count;
  }

  function nextGeneration(grid) {
    return grid.map((row, i) =>
      row.map((cell, j) => {
        const neighbors = countNeighbors(grid, i, j)
      
        if (cell === 1) {
          return neighbors === 2 || neighbors === 3 ? 1 : 0
        } else {
          return neighbors === 3 ? 1 : 0
        }
      })
    )
  }

  function clearGrid() {
    setGrid(createGrid())
  }

  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setGrid(g => nextGeneration(g))
    }, 1000 - (ticksPerSec * 200));

    return () => clearInterval(interval)
  }, [running]);

  return (
    <div>
      <h1 className="text-center py-3 font-bold text-xl text-gray-600">Conway's Game of Life</h1>
      <div className="flex gap-5 justify-center">
        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            width={COLS * CELL_SIZE}
            height={ROWS * CELL_SIZE}
            onClick={handleClick}
            className="border-2 border-gray-600"
          />
          <div>
            <div className="flex items-center gap-2">
              <label>Speed: </label>
              <input type="range" min="-5" max="5" step="1" value={ticksPerSec} onChange={(e) => setTicksPerSec(e.target.value)} />
            </div>
          </div> 
          <div className="flex gap-5">
            <button 
              onClick={() => setRunning(true)}
              className="cursor-pointer bg-blue-500 py-1 px-2 hover:bg-blue-400 text-white rounded-sm"
            >
              Start
            </button> 
            <button 
              onClick={() => setRunning(false)}
              className="cursor-pointer bg-red-500 py-1 px-2 hover:bg-red-400 text-white rounded-sm"
            >
              Stop
            </button>
            <button 
              onClick={() => clearGrid()}
              className="cursor-pointer bg-gray-500 py-1 px-2 hover:bg-gray-400 text-white rounded-sm"
            >
              clear
            </button>
          </div>
        </div>
        <div>
          <p className="flex items-center">Time Elapsed: </p>
          <p className="flex items-center">Population: {population}</p> 
        </div>
      </div>
    </div>
  );
}