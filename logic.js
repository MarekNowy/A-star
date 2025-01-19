import { array } from "./grafic.js";

let height = null;
let width = null;
let start = [];
let stop = [];
let openList = [];
let closeList = [];
export let path = [];
export let arr = null;


export function setArray() {
    arr = array;
    height = arr.length;
    width = arr[0].length;
};

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

    getPossibleWay(start);
};

function gCost(currentPosition) {
    let element = closeList.find((item) =>
        item.location == currentPosition
    );
    return element.gCost + 1;
};

function hCost(currentPosition) {
    let stopOddX = currentPosition[0] - stop[0];
    let stopOddY = currentPosition[1] - stop[1];
    return Math.sqrt(stopOddX * stopOddX + stopOddY * stopOddY);
};

function notInCloseList(loc) {
    return !closeList.some(item =>
        item.location[0] === loc.location[0] && item.location[1] === loc.location[1]
    );
};

function notInOpenList(loc) {
    return !openList.some(item =>
        item.location[0] === loc.location[0] && item.location[1] === loc.location[1]
    );
};

function checkLocation(x,y,location){
if(arr[x][y]!="x" && notInCloseList(location) && notInOpenList(location)){
    return true;
} else
    return false;
};

function createOtherLocation(way, location){
   if(way == location[0] - 1 || way == location[0] + 1){

        return {
            location: [way,location[1]],
            fCost: gCost(location) + hCost([way, location[1]]),
            gCost: gCost(location),
            hCost: hCost([way, location[1]]),
            parent: location
        }}
    else {
        return {
            location: [location[0], way],
            fCost: gCost(location) + hCost([location[0], way]),
            gCost: gCost(location),
            hCost: hCost([location[0], way]),
            parent: location
        }
    }};


function getPossibleWay(location) {
    const up = location[0] - 1;
    const down = location[0] + 1;
    const left = location[1] - 1;
    const right = location[1] + 1;

    const upperLocation = createOtherLocation(up,location);

    const bottomLocation = createOtherLocation(down,location);

    const leftLocation = createOtherLocation(left,location);

    const rightLocation = createOtherLocation(right,location);

    if (up >= 0 && checkLocation(up,location[1],upperLocation)) {
        openList.push(upperLocation);
    };

    if (down < height && checkLocation(down,location[1],bottomLocation)) {
        openList.push(bottomLocation);
    };

    if (left >= 0 && checkLocation(location[0],left,leftLocation)) {
        openList.push(leftLocation);
    };

    if (right < width && checkLocation(location[0],right,rightLocation)) {
        openList.push(rightLocation);
    };
}

function getNeighbours() {
    let sameFcost = [];
    const lowestFcost = openList.reduce((a, e) => a.fCost < e.fCost ? a : e);
    sameFcost = openList.filter((item) => item.fCost == lowestFcost.fCost);
    sameFcost = sameFcost.reduce((a, e) => a.hCost < e.hCost ? a : e);
    closeList.push(sameFcost);
    openList = openList.filter(item => item !== sameFcost);
    getPossibleWay(sameFcost.location);
};

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
        getNeighbours();
        if (openList.length == 0 && !closeList.some((item) => item.location[0] == stop[0] && item.location[1] == stop[1])) {
            return false;
        }
    }
    showPath();
    return true;
};
