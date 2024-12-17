const board = document.getElementById("left-panel");
const startBtn = document.getElementById("start");
const reloadBtn = document.getElementById("more");
const selectStartBtn = document.getElementById("selectStart");
const selectStopBtn = document.getElementById("selectStop");
const selectObsticlesBtn = document.getElementById("selectObsticles");
const removeMarkBtn = document.getElementById("removeMark");
const createBoardBtn = document.getElementById("submit");
const info = document.getElementById("info");
const heightInput = document.getElementById("height");
const widthInput = document.getElementById("width");

let height = null;
let width = null;

$('button').prop('disabled', true);
createBoardBtn.disabled = false;

import { setArray,A_Star,showPath,arr,path } from "./logic.js"

export let array = null;

$(startBtn).on("click", function(event) {
    if (!AnyStartPoint() && !AnyEndPoint()) {
        info.innerHTML = ''
        $(board).off();
        selectObsticlesBtn.disabled = true;
        removeMarkBtn.disabled = true;
        startBtn.disabled = true;
        createArray();
        array = JSON.stringify(array);
        localStorage.setItem("arr", array);
        setArray();
        if(!A_Star()) {
            info.innerHTML = "brak ścieżki"
            return;
        }
 
        changeArray(path);
        graficShow(path);
    }
     
    else {
        info.innerHTML = "nie zaznaczyles destynacji";
    }
});

$(reloadBtn).on("click", () => { location.reload(); });
$(selectStartBtn).on("click", MarkStart);
$(selectStopBtn).on("click", MarkStop);
$(selectObsticlesBtn).on("click", selectObsticles);
$(removeMarkBtn).on("click", removeMark);
$(createBoardBtn).on("click", function(event) {
    event.preventDefault();
    const valid = /^(100|[2-9]|\d{2})$/;
    if(!valid.test(document.getElementById("height").value) || !valid.test(document.getElementById("width").value))
    {
        info.innerHTML = "Podaj parametry w zakresie 2-100"
        return;
    }
    $('button').prop('disabled', false);
    createBoardBtn.disabled = true;
    height = document.getElementById("height").value;
    width = document.getElementById("width").value;
    info.innerHTML = '';
    createBoard();    
});


export function expFunc(value){
    return value
}

function AnyStartPoint() {
    if (board.querySelector(".start") == null) {
        return true;
    } else {
        selectStartBtn.disabled = true;
        return false;
    }
}

function AnyEndPoint() {
    if (board.querySelector(".stop") == null) {
        return true;
    } else {
        selectStopBtn.disabled = true;
        return false;
    }
}

export function createBoard() {

    for (let x = 0; x < height; x++) {
        for (let i = 0; i < width; i++) {
            const newDiv = document.createElement('div');
            newDiv.classList.add("box");
            board.appendChild(newDiv);
        }

        let emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty");
        board.appendChild(emptyDiv);
    }
}

function selectObsticles() {
    $(board).off();

    $(board).on("click", function(event) {
        if (event.target.className == "box") {
            event.target.classList.add("new");
            event.target.classList.remove("box");
        }
    });
}

function MarkStart() {
    $(board).off();

    $(board).on("click", function(event) {
        if (AnyStartPoint()) {
            if (event.target.className == "box") {
                event.target.classList.add("start");
                event.target.classList.remove("box");
            }
        }
    });
}

function MarkStop() {
    $(board).off();

    $(board).on("click", function(event) {
        if (AnyEndPoint()) {
            if (event.target.className == "box") {
                event.target.classList.add("stop");
                event.target.classList.remove("box");
            }
        }
    });
}

function removeMark() {
    $(board).off();
    $(board).on("click", function(event) {
        if (event.target.className == "new" && event.target.id != "left-panel") {
            let defaultClass = event.target.className;
            event.target.classList.add("box");
            event.target.classList.remove(defaultClass);
        } else if (event.target.className == "start") {
            let defaultClass = event.target.className;
            event.target.classList.add("box");
            event.target.classList.remove(defaultClass);
            selectStartBtn.disabled = false;
        } else if (event.target.className == "stop") {
            let defaultClass = event.target.className;
            event.target.classList.add("box");
            event.target.classList.remove(defaultClass);
            selectStopBtn.disabled = false;
        }
    });
}

function createArray() {
    let tab = [];
    let arr = [];
    let columns = document.querySelectorAll("#left-panel > div");

    columns.forEach((div) => {
        if (tab.length < width) {
            if (div.className != "empty") {
                if (div.className == "start") {
                    tab.push("S");
                } else if (div.className == "stop") {
                    tab.push("E");
                } else if (div.className == "box") {
                    tab.push(".");
                } else {
                    tab.push("x");
                }
            }
        } else {
            arr.push(tab);
            tab = [];
            if (div.className !== "empty") {
                if (div.className == "start") {
                    tab.push("S");
                } else if (div.className == "stop") {
                    tab.push("E");
                } else if (div.className == "box") {
                    tab.push(".");
                } else {
                    tab.push("x");
                }
            }
        }
        array = arr
        return arr
    });
}

function changeArray(path) {
    for (let i = 0; i < arr.length; i++) {
        for (let z = 0; z < arr[i].length; z++) {
            if (path.some((item) => item[0] == i && item[1] == z)) arr[i][z] = "P";
        }
    }
}

function graficShow(path) {
    let allDiv = document.querySelectorAll(".box, .new, .start, .stop, .path");
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let z = 0; z < arr[i].length; z++) {
            if (arr[i][z] === "P" && !allDiv[counter].classList.contains("start") && !allDiv[counter].classList.contains("stop")) {
                allDiv[counter].classList.add("path");
                allDiv[counter].classList.remove("box");
            }
            counter++;
        }
    }
    if (path.length == 2) {
        info.innerHTML = "Punkty znajdują się obok siebie";
    }
}
