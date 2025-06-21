import { generateMazePrims } from "./algorithms/maze-generation/prims";
import { generateMazeRecursiveDiv } from "./algorithms/maze-generation/recursiveDiv";

export function generateMaze(minRow, minCol, maxRow, maxCol, algorithm) {
    if (algorithm === "recursive-division") {
        return generateMazeRecursiveDiv(minRow, minCol, maxRow, maxCol)
    }

    if (algorithm === "prims") {
        return generateMazePrims(minRow, maxRow+1)
    }
}