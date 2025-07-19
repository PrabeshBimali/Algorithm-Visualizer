"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SortingAlgorithms() {
  const [bars, setBars] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubblesort");
  const [NOOfBars, setNOOfBars] = useState(10)

  useEffect(() => {
    generateBars(NOOfBars);
  }, []);

  const generateBars = (bars) => {
    const newBars = Array.from({ length: bars }, (_, i) => ({
      id: i,
      height: Math.floor(Math.random() * 250) + 20,
      order: i,
      color: "bg-blue-500",
    }));
    setBars(newBars)
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function changeColor(arr, tailwindColor, positions) {
    for(const position of positions) {
      arr[position].color = tailwindColor
    }
  }

  function swapPosition(arr, positionA, positionB) {
    const tempOrder = arr[positionB].order
    arr[positionB].order = arr[positionA].order
    arr[positionA].order = tempOrder

    const temp = arr[positionB]
    arr[positionB] = arr[positionA]
    arr[positionA] = temp
  }

  async function startBubbleSort() {
    if (isSorting) return;
    setIsSorting(true);
    const arr = [...bars];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        changeColor(arr, "bg-red-500", [j, j+1])
        setBars([...arr]);
        await sleep(100);

        if (arr[j].height > arr[j+1].height) {
          swapPosition(arr, j, j+1)
          setBars([...arr]);
          await sleep(300);
        }

        changeColor(arr, "bg-blue-500", [j, j+1])
        setBars([...arr]);
      }
    }

    setIsSorting(false);
  };

  async function startInsertionSort() {
    if(isSorting) return
    setIsSorting(true)
    const arr = [...bars]

    for(let i = 1; i < arr.length; i++) {
      let j = i -1
      const key = arr[i]

      while(j >=0 && (arr[j].height > key.height)) {
        console.log(key)
        changeColor(arr, "bg-red-500", [j+1, j])
        setBars([...arr])
        await sleep(100)

        swapPosition(arr, j, j+1)
        setBars([...arr])
        await sleep(100)

        changeColor(arr, "bg-blue-500", [j, j+1])
        setBars([...arr])

        j -= 1
      }
    }
    setIsSorting(false)
  }

  async function startSelectionSort() {
    if(isSorting) return
    setIsSorting(true)
    const arr = [...bars]

    for(let i = arr.length - 1; i > 0; i--) {
      let positionOfMax = 0
      for(let j = 1; j <= i; j++) {
        if(arr[j].height > arr[positionOfMax].height) {
          positionOfMax = j
        }
      }
      changeColor(arr, "bg-red-500", [positionOfMax, i])
      setBars([...arr])
      await sleep(300)

      swapPosition(arr, positionOfMax, i)
      setBars([...arr])
      await sleep(300)

      changeColor(arr, "bg-blue-500", [positionOfMax, i])
      setBars([...arr])
    }

    setIsSorting(false)
  }
  
  function startSorting() {
    if(algorithm === "bubblesort") {

      startBubbleSort()

    } else if (algorithm === "selectionsort") {

      startSelectionSort()

    } else if(algorithm === "insertionsort") {

      startInsertionSort()
    }
  }

  function handleAlgorithmChange(e) {
    setAlgorithm(e.target.value)
  }

  async function handleNOOfBarsChange(e) {
    const newBars = Number(e.target.value)
    setNOOfBars(newBars)
    generateBars(newBars)
  }

  function resetBars() {
    generateBars(NOOfBars)
  }

  return (
    <>
      <Link href="/" className='p-3 text-xl cursor-pointer hover:text-cyan-500'>Go Back</Link>
      <div className="flex flex-col items-center p-4">
        <div className="flex gap-3">
          <div className='flex flex-row justify-center items-center gap-3 py-3'>
              <label className='font-semibold'>
                  Choose Algorithm:
              </label>
              <select value={algorithm} onChange={handleAlgorithmChange} className='bg-gray-700 text-amber-50 p-2 rounded-sm'>
                  <option value="bubblesort">Bubble Sort</option>
                  <option value="selectionsort">Selection Sort</option>
                  <option value="insertionsort">Insertion Sort</option>
              </select>
          </div>
          <div className='flex flex-row justify-center items-center gap-3 py-3'>
              <label className='font-semibold'>
                  NO. of Bars:
              </label>
              <select value={NOOfBars} onChange={handleNOOfBarsChange} className='bg-gray-700 text-amber-50 p-2 rounded-sm'>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                  <option value="60">60</option>
              </select>
          </div>
        </div>
        <div className="flex items-end gap-1 h-[300px] w-full max-w-5xl border rounded p-2 relative">
          {bars.map((bar) => (
            <div
              key={bar.id}
              className={`absolute ${bar.color} w-[10px] transition-all duration-300 ease-in-out`}
              style={{
                height: `${bar.height}px`,
                left: `${bar.order * 12}px`,
              }}
            ></div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={resetBars}
            disabled={isSorting}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={startSorting}
            disabled={isSorting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50"
          >
            Start Sort
          </button>
        </div>
      </div>
    </>
    )
}