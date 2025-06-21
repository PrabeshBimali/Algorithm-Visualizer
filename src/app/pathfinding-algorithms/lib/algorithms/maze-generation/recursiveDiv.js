function chooseOrientation(width, height) {
    if (width > height) return "V";
    if (height > width) return "H";

    return Math.random() > 0.5 ? "H" : "V";
}


function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateMazeRecursiveDiv(minRow, minCol, maxRow, maxCol) {
    const walls = []

    const passageCols = []
    const passageRows = []
    divide(minRow, maxRow, minCol, maxCol, chooseOrientation(maxRow, maxCol), walls, passageCols, passageRows);
    const filteredWalls = clearWalls(walls, passageCols, passageRows)
    return filteredWalls;
}

function divide(minRow, maxRow, minCol, maxCol, orientation, walls, passageCols, passageRows) {

    const height = maxCol - minCol;
    const width = maxRow - minRow;
    const horizontal = orientation === "H";

    if (height < 1 || width < 1) {
        return
    }

    const wallRow = horizontal ? randomNumber(minRow+1, maxRow-1) : -1;
    const wallCol = horizontal ? -1 : randomNumber(minCol+1, maxCol-1);

    const passageCol = horizontal ? randomNumber(minCol+1, maxCol-1) : -1
    const passageRow = horizontal ? -1 : randomNumber(minRow+1, maxRow-1)

    if (horizontal) {

        passageCols.push([wallRow, passageCol])
        for (let col = minCol; col <= maxCol; col++) {
            if (col === passageCol) continue
            walls.push([wallRow, col])
        }

        divide(minRow, wallRow-1, minCol, maxCol, chooseOrientation(maxCol-minCol, wallRow-minRow), walls, passageCols, passageRows);
        divide(wallRow+1, maxRow, minCol, maxCol, chooseOrientation(maxCol-minCol, maxRow-wallRow), walls, passageCols, passageRows);

    } else {

        passageRows.push([passageRow, wallCol])
        for (let row = minRow; row <= maxRow; row++) {
            if (row === passageRow) continue
            walls.push([row, wallCol])
        }

        divide(minRow, maxRow, minCol, wallCol-1, chooseOrientation(wallCol-minCol, maxRow-minRow), walls, passageCols, passageRows);
        divide(minRow, maxRow, wallCol+1, maxCol, chooseOrientation(maxCol-wallCol, maxRow-minRow), walls, passageCols, passageRows);
    }
}

function clearWalls(walls, passageCols, passageRows) {
    const filteredWalls = []
    for (let i = 0; i < walls.length; i++) {
        const isBlocker = passageCols.some((element) => { 
            if ((walls[i][0] === element[0]+1) || (walls[i][0] === element[0]-1) && walls[i][1] === element[1]) {
                console.log("Removed wall: ", walls[i])
                console.log("Element: ", element)
            }
            return ((walls[i][0] === element[0]+1 || walls[i][0] === element[0]-1) && walls[i][1] === element[1]);
        })
        const isBlocker2 = passageRows.some((element) => ((walls[i][1] === element[1]+1 || walls[i][1] === element[1]-1) && walls[i][0] === element[0]))
        if(!isBlocker && !isBlocker2) {
            filteredWalls.push(walls[i])
        }
    }
    //console.log("PR: ", passageRows)
    //console.log("PC: ", passageCols)
    //console.log("Walls: ",  walls)
    console.log("filtered: ", filteredWalls)
    
    return filteredWalls;
}