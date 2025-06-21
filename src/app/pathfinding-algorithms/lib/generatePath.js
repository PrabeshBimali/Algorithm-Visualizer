import { generatePathBFS, generatePathDFS } from "./algorithms/pathfindingalgo";

export function generatePath(start, end, mazeSize, invalidCells, algorithm) {
    if(algorithm === "bfs") {
        return generatePathBFS(start, end, mazeSize, invalidCells)
    } 
    
    if (algorithm === "dfs") {
        return generatePathDFS(start, end, mazeSize, invalidCells)
    }
}