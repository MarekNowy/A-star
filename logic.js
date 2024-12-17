let height = null;
let width = null;
let start = [];
let stop = [];
let openList = [];
let closeList = [];
export let path = [];
export let arr = null;


export function setArray() {
    arr = localStorage.getItem("arr");
    arr = JSON.parse(arr);
    height = arr.length;
    width = arr[0].length;
}

function searchDestinacions() {
    for (let i = 0; i < arr.length; i++) {
        for (let z = 0; z < arr[i].length; z++) {
            if (arr[i][z] == "S") start = [i, z];
            if (arr[i][z] == "E") stop = [i, z];
        }
    }

    closeList.push({
        location: start,
        fCost: 0 + hCost(start),
        gCost: 0,
        hCost: hCost(start)
    });

    PossibleWay(start);
}

function gCost(currentPosition) {
    let element = closeList.find((item) =>
        item.location == currentPosition
    );
    return element.gCost + 1;
}

function hCost(currentPosition) {
    let stopOddX = currentPosition[0] - stop[0];
    let stopOddY = currentPosition[1] - stop[1];
    return Math.sqrt(stopOddX * stopOddX + stopOddY * stopOddY);
}

function notInCloseList(loc) {
    return !closeList.some(item =>
        item.location[0] === loc.location[0] && item.location[1] === loc.location[1]
    );
}

function notInOpenList(loc) {
    return !openList.some(item =>
        item.location[0] === loc.location[0] && item.location[1] === loc.location[1]
    );
}

function PossibleWay(location) {
    const up = location[0] - 1;
    const down = location[0] + 1;
    const left = location[1] - 1;
    const right = location[1] + 1;

    const upperLocation = {
        location: [up, location[1]],
        fCost: gCost(location) + hCost([up, location[1]]),
        gCost: gCost(location),
        hCost: hCost([up, location[1]]),
        parent: location
    };

    const bottomLocation = {
        location: [down, location[1]],
        fCost: gCost(location) + hCost([down, location[1]]),
        gCost: gCost(location),
        hCost: hCost([down, location[1]]),
        parent: location
    };

    const leftLocation = {
        location: [location[0], left],
        fCost: gCost(location) + hCost([location[0], left]),
        gCost: gCost(location),
        hCost: hCost([location[0], left]),
        parent: location
    };

    const rightLocation = {
        location: [location[0], right],
        fCost: gCost(location) + hCost([location[0], right]),
        gCost: gCost(location),
        hCost: hCost([location[0], right]),
        parent: location
    };

    if (up >= 0 && arr[up][location[1]] != "x" && notInCloseList(upperLocation) && notInOpenList(upperLocation)) {
        openList.push(upperLocation);
    }

    if (down < height && arr[down][location[1]] != "x" && notInCloseList(bottomLocation) && notInOpenList(bottomLocation)) {
        openList.push(bottomLocation);
    }

    if (left >= 0 && arr[location[0]][left] != "x" && notInCloseList(leftLocation) && notInOpenList(leftLocation)) {
        openList.push(leftLocation);
    }

    if (right < width && arr[location[0]][right] != "x" && notInCloseList(rightLocation) && notInOpenList(rightLocation)) {
        openList.push(rightLocation);
    }
}

function neighbours() {
    let sameFcost = [];
    const lowestFcost = openList.reduce((a, e) => a.fCost < e.fCost ? a : e);
    sameFcost = openList.filter((item) => item.fCost == lowestFcost.fCost);
    sameFcost = sameFcost.reduce((a, e) => a.hCost < e.hCost ? a : e);
    closeList.push(sameFcost);
    openList = openList.filter(item => item !== sameFcost);
    PossibleWay(sameFcost.location);
}

export function showPath() {
    let current = closeList.find(item => item.location[0] === stop[0] && item.location[1] === stop[1]);

    while (current.location != start) {
        path.push(current.location);
        current = closeList.find(item =>
            item.location == current.parent
        );
    }
    path.push(start);
    return path.reverse();
}

export function A_Star() {
    searchDestinacions();
    while (!closeList.some((item) => item.location[0] === stop[0] && item.location[1] === stop[1])) {
        neighbours();
        if (openList.length == 0 && !closeList.some((item) => item.location[0] == stop[0] && item.location[1] == stop[1])) {
            return false;
        }
    }
    
    showPath();
    return true;
    
}
