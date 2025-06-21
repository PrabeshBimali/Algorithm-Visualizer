function getPaths(cell, maxLength, invalidCells) {
    const availablePaths = [];
    const [x, y] = cell;

    const isInvalid = (x, y) =>
        invalidCells.some(([ix, iy]) => ix === x && iy === y);

    if(x - 1 >= 0 && !isInvalid(x-1, y) ) availablePaths.push([x-1, y]);
    if(x + 1 <= maxLength && !isInvalid(x+1, y) ) availablePaths.push([x+1, y]);
    if(y - 1 >= 0 && !isInvalid(x, y-1) ) availablePaths.push([x, y-1]);
    if(y + 1 <= maxLength && !isInvalid(x, y+1) ) availablePaths.push([x, y+1]);

    return availablePaths
}

function compareCells(cell, end) {
    return (cell[0] === end[0] && cell[1] === end[1]);
}

function isCellInPath(cell, path) {
    for (const element of path) {
        if(element[0] === cell[0] && element[1] === cell[1]) {
            return true;
        }
    }

    return false
}

function isCellInQueue(cell, path) {
     for (const element of path) {
        if(element[0] === cell[0] && element[1] === cell[1]) {
            return true;
        }
    }

    return false
}

function cellKey(cell) {
    const [x, y] = cell
    return `${x},${y}`
}

export function generatePathBFS(start, end, mazeSize, invalidPaths = []) {
    const queue = []
    const visited = []
    const parentMap = new Map()
    queue.push(start)

    while (queue.length > 0) {
        const currentCell = queue.shift()
        visited.push(currentCell)
        if (compareCells(currentCell, end)) {
            // get shortest path by mapping backwards
            let current = currentCell
            const shortestPath = []
            while(current) {
                shortestPath.unshift(current)
                current = parentMap.get(cellKey(current))
            }
            return [shortestPath, visited]
        }

        const availablePaths = getPaths(currentCell, mazeSize, invalidPaths);

        for (const element of availablePaths) {
            if(!isCellInPath(element, visited) && !isCellInQueue(element, queue)) {
                parentMap.set(cellKey(element), currentCell)
                queue.push(element)
            }
        }
    }

    return [[], visited]
}

export function generatePathDFS(start, end, mazeSize, invalidPaths=[]) {
    const stack = []
       const visited = []
       const parentMap = new Map()
       stack.push(start)        
       while (stack.length > 0) {
           const currentCell = stack.pop()
           visited.push(currentCell)
           if (compareCells(currentCell, end)) {
               // get shortest path by mapping backwards
               let current = currentCell
               const shortestPath = []
               while(current) {
                   shortestPath.unshift(current)
                   current = parentMap.get(cellKey(current))
               }
               return [shortestPath, visited]
           }        
           const availablePaths = getPaths(currentCell, mazeSize, invalidPaths);        
           for (const element of availablePaths) {
               if(!isCellInPath(element, visited) && !isCellInQueue(element, stack)) {
                   parentMap.set(cellKey(element), currentCell)
                   stack.push(element)
               }
           }
       }        
       
    return [[], visited]
}