"use client"
import { useEffect, useRef, useState } from 'react';
import { generatePath } from './lib/generatePath';
import { generateMaze } from './lib/generateMaze';

export default function PathfindingAlgorithms() {
    const [GRID, setGRID] = useState(5);
    const [cells, setCells] = useState([])
    
    // These states are sent a argument
    const [start, setStart] = useState([])
    const [end, setEnd] = useState([])
    const [invalidCells, setInvalidCells] = useState([])
    const [algorithm, setAlgorithm] = useState("dfs")
    const [mazeAlgorithm, setMazeAlgorithm] = useState("recursive-division")
    const stopAnimation = useRef(false)

    function createGrid(grid) {
        const cells = []
        for(let i = 0; i < grid; i++) {
            for(let j = 0; j < grid; j++) {
                let cell = {}
                cell.x = i;
                cell.y = j;
                cell.isWall = false;
                cell.isPath = false;
                cell.isVisited = false;
                //hardcoded values for now
                cell.isStart = (i === 0 && j === 0) ? true : false;
                cell.isEnd = (i === grid-1 && j === grid-1) ? true : false;
                setStart([0, 0])
                setEnd([grid-1, grid-1])
                cell.str = `(${i},${j})`
                cells.push(cell)
            }
        }

        return cells;
    }

    useEffect(() => {
        setCells(createGrid(GRID))
    }, [])
    

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    
    function handleCellClick(cell, index) {
        const newCells = [...cells]
        newCells[index].isWall = true
        setCells(newCells)

        const newInvalidCells  = [...invalidCells]
        newInvalidCells.push([cell.x, cell.y])
        setInvalidCells(newInvalidCells)
        //console.log(invalidCells)
    }

    function reset() {
        setStart([])
        setEnd([])
        setInvalidCells([])
        setCells(createGrid(GRID))
    }

    async function startAnimation() {
        stopAnimation.current = false
        const [ shortestPath, visitedPath ] = generatePath(start, end, GRID-1, invalidCells, algorithm)

        for (const element of visitedPath) {
            if(stopAnimation.current) {
                return
            }

            const index = element[0] * GRID + element[1]
            const newCells = [...cells]
            newCells[index].isVisited = true;
            setCells(newCells)
            await sleep(100)
        }
        
        await sleep(1000)

        for (const element of shortestPath) {
            if(stopAnimation.current) {
                return
            }
            // caluculate index in Array cells state from cell position
            const index = element[0] * GRID + element[1]
            const newCells = [...cells];
            newCells[index].isPath = true;
            setCells(newCells)
            await sleep(100)
        }
    }

    async function startMazeGeneration() {

        stopAnimation.current = false

        if (mazeAlgorithm === "recursive-division") {
            
            const wallsGenerated = generateMaze(0, 0, GRID-1, GRID-1, mazeAlgorithm)
            const newInvalidCells = [...invalidCells]

            for(const element of wallsGenerated) {
                if(stopAnimation.current) {
                    return
                }
                const index = element[0] * GRID + element[1]
                const newCells = [...cells];
                newCells[index].isWall = true;
                setCells(newCells)
                newInvalidCells.push(element)
                await sleep(100)
            }

            setInvalidCells(newInvalidCells)
        } else if (mazeAlgorithm === "prims") {

            const passage = generateMaze(0, 0, GRID-1, GRID-1, mazeAlgorithm)
            let newInvalidCells = [...invalidCells]
            console.log("Passage: ", passage)

            const newCells = cells.map((cell) => {
                cell.isWall = true;
                return cell
            })

            setCells(newCells)

            for (const element of passage) {
                if(stopAnimation.current) {
                    return
                }

                const index = element[0] * GRID + element[1]
                const newCells = [...cells];
                newCells[index].isWall = false;
                setCells(newCells)
                await sleep(100)

            }

            newInvalidCells = cells.
                                filter(cell => (cell.isWall && !(cell.x === 0 && cell.y === 0) && !(cell.x === GRID-1 && cell.y === GRID - 1))).
                                map(cell => [cell.x, cell.y])

            setInvalidCells(newInvalidCells)
            console.log(newInvalidCells)
        }
    }

    function handleAlgorithmChange(e) {
        setAlgorithm(e.target.value);
    }

    function handleMazeAlgorithmChange(e) {
        setMazeAlgorithm(e.target.value);
    }

    function handleMazeSize(e) {
        const newSize = Number(e.target.value)
        setGRID(newSize)
        setCells(createGrid(newSize))
    }

    return (
        <>  
            <div className='mt-5 flex justify-center'>
                <div className='flex flex-col md:flex-row gap-3 text-gray-500'>
                    <div className='flex flex-row justify-center items-center gap-3'>
                        <label className='font-semibold'>
                            Choose Algorithm:
                        </label>
                        <select value={algorithm} onChange={handleAlgorithmChange} className='bg-gray-700 text-amber-50 p-2 rounded-sm'>
                            <option value="bfs">BFS</option>
                            <option value="dfs">DFS</option>
                        </select>
                    </div>
                    <div className='flex justify-center items-center gap-3'>
                        <label className='font-semibold'>
                            Maze Generator:
                        </label>
                        <select value={mazeAlgorithm} onChange={handleMazeAlgorithmChange} className='bg-gray-700 text-amber-50 p-2 rounded-sm'>
                            <option value="recursive-division">Recursive Div</option>
                            <option value="prims">Prim's</option>
                        </select>
                    </div>
                    <div className='flex justify-center items-center gap-3'>
                        <label className='font-semibold'>
                            Maze Size:
                        </label>
                        <select value={GRID} onChange={handleMazeSize} className='bg-gray-700 text-amber-50 p-2 rounded-sm'>
                            <option value="5">5 x 5</option>
                            <option value="10">10 x 10</option>
                            <option value="25">25 x 25</option>
                            <option value="40">40 x 40</option>
                            <option value="50">50 x 50</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className=' text-amber-50 flex flex-col items-center justify-center'>
                /* grid-cols is hardcoded for now */
                <div className={`grid bg-gray-600 
                                ${GRID === 5 ? "grid-cols-5" : GRID === 10 ? "grid-cols-10" : GRID === 25 ? "grid-cols-25" : GRID === 40 ? "grid-cols-40" : "grid-cols-50"}`}>
                    {cells.map((cell, index) => {
                        return <div
                                    onClick={(e) => {
                                        e.preventDefault()
                                        return handleCellClick(cell, index)
                                    }} 
                                    key={`(${cell.x},${cell.y})`}
                                    className={`flex justify-center items-center border-1 border-gray-600 hover:bg-gray-500 cursor-pointer 
                                        ${cell.isStart ? "bg-red-500" : cell.isEnd ? "bg-green-500" : cell.isPath ? "bg-blue-400" : cell.isVisited ? "bg-orange-500" : cell.isWall ? "bg-gray-900": "bg-gray-400"}
                                        ${GRID === 5 ? "h-10 w-10" : GRID === 10 ? "h-7 w-7" : GRID === 25 ? "h-5 w-5" : GRID === 40 ? "h-3 w-3": "h-3 w-3"}`}>
                                </div>
                    })}
                </div> 
                <div className='flex gap-3 mt-3'>
                    <button className='bg-gray-600 text-amber-50 p-2 rounded-sm font-semibold cursor-pointer hover:bg-gray-500' onClick={reset}>Reset</button>
                    <button className='bg-blue-600 text-amber-50 p-2 rounded-sm font-semibold cursor-pointer hover:bg-blue-500' onClick={startAnimation}>Start</button>
                    <button className='bg-gray-900 text-amber-50 p-2 rounded-sm font-semibold cursor-pointer hover:bg-gray-800' onClick={startMazeGeneration}>Generate Maze</button>
                    <button className='bg-red-600 text-amber-50 p-2 rounded-sm font-semibold cursor-pointer hover:bg-red-500' onClick={() => stopAnimation.current = true}>Stop</button>
                </div>
            </div>
        </>
    )
}