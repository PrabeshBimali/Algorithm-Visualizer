function getAdjacentCells(cell, maxLength) {
    const [x, y] = cell
    const adjacentCells = []

    if(x - 2 >= 0 ) adjacentCells.push([x-2, y]);
    if(x + 2 < maxLength ) adjacentCells.push([x+2, y]);
    if(y - 2 >= 0 ) adjacentCells.push([x, y-2]);
    if(y + 2 < maxLength ) adjacentCells.push([x, y+2]);

    return adjacentCells
}

function isCellInArray(cell, cellArray) {
    return cellArray.some(([x, y]) => x === cell[0] && y === cell[1])
}

export function generateMazePrims(minRow, maxRow) {
    const randomRow = Math.floor(Math.random() * (maxRow))
    const randomCol = Math.floor(Math.random() * (maxRow))
   
    const start = [randomRow, randomCol];
    const frontier = []
    const visited = []
    const passage = []

    frontier.push(start);
    passage.push(start);

    while (frontier.length > 0) {
        const randomIndex = Math.floor(Math.random()*(frontier.length))
        const current = (frontier.splice(randomIndex, 1))[0]
        visited.push(current)
        passage.push(current)
        const unfilteredAdjacentCells = getAdjacentCells(current, maxRow)
        let alreadyConnected = false;

        for (const element of unfilteredAdjacentCells) {

            if(isCellInArray(element, visited) && !alreadyConnected) {
                const [cx, cy] = current;
                const [vx, vy] = element;
                passage.push([(cx+vx)/2, (cy+vy)/2])
                alreadyConnected = true;
            }

            if (!isCellInArray(element, frontier) && !isCellInArray(element, visited)) {
                frontier.push(element)
            }
        }
    }

    //console.log("P:", passage)
    return passage
}