import { setArray,A_Star,showPath,arr,path } from "./logic.js";

const board = document.getElementById("left-panel");
const startBtn = document.getElementById("start");
const reloadBtn = document.getElementById("more");
const selectStartBtn = document.getElementById("selectStart");
const selectStopBtn = document.getElementById("selectStop");
const selectObsticlesBtn = document.getElementById("selectObsticles");
const removeMarkBtn = document.getElementById("removeMark");
const createBoardBtn = document.getElementById("submit");
const info = document.getElementById("info");

const HEIGHT_ID_SELECTOR = "height";
const WIDTH_ID_SELECTOR = "width";
const START_ID_SELECTOR = "start";
const STOP_ID_SELECTOR = "stop";
const BOX_ID_SELECTOR = "box";
const EMPTY_ID_SELECTOR = "empty";
const PATH_ID_SELECTOR = "path";
const NEW_ID_SELECTOR = "new";

const VALID_REGEX = /^(100|[2-9]|\d{2})$/;

let height = null;
let width = null;

$("button").prop("disabled", true);
createBoardBtn.disabled = false;

export let array = null;

$(startBtn).on("click", function(event) {
    if (!AnyStartPoint() && !AnyEndPoint()) {
        info.textContent = "";
        $(board).off();
        selectObsticlesBtn.disabled = true;
        removeMarkBtn.disabled = true;
        startBtn.disabled = true;
        createArray();
        setArray();
        if(!A_Star()) {
            info.textContent = "brak ścieżki";
            return;
        }
        changeArray(path);
        graficShow(path);
    }   else {
        info.textContent = "nie zaznaczyles destynacji";
    }
});

$(reloadBtn).on("click", function() { location.reload(); });
$(selectStartBtn).on("click", MarkStart);
$(selectStopBtn).on("click", MarkStop);
$(selectObsticlesBtn).on("click", selectObsticles);
$(removeMarkBtn).on("click", removeMark);
$(createBoardBtn).on("click", function(event) {
    event.preventDefault();
    height = document.getElementById(HEIGHT_ID_SELECTOR).value;
    width = document.getElementById(WIDTH_ID_SELECTOR).value;
   if(!VALID_REGEX.test(height) || !VALID_REGEX.test(width))
    {
        info.textContent = "Podaj parametry w zakresie 2-100";
        return;
    }
    $("button").prop("disabled", false);
    createBoardBtn.disabled = true;
    info.textContent = "";
    createBoard();
});

function changeIdToClassSelector(ids) {
    if (typeof ids === "string"){
        return "." + ids;
    } if(typeof ids === "object") {
        return ids.map((id) => `.${id}`).join(", ");
    }
}

function AnyStartPoint() {
  if (board.querySelector(changeIdToClassSelector(START_ID_SELECTOR)) == null) {
        return true;
    } else {
        selectStartBtn.disabled = true;
        return false;
    }
}

function AnyEndPoint() {
  if (board.querySelector(changeIdToClassSelector(STOP_ID_SELECTOR)) == null) {
        return true;
    } else {
        selectStopBtn.disabled = true;
        return false;
    }
}

function createBoard(){

       for (let x = 0; x < height; x++) {
        for (let i = 0; i < width; i++) {
            const newDiv = document.createElement("div");
            newDiv.classList.add(BOX_ID_SELECTOR);
            board.appendChild(newDiv);
        }

        let emptyDiv = document.createElement("div");
        emptyDiv.classList.add(EMPTY_ID_SELECTOR);
        board.appendChild(emptyDiv);
    }

}

function selectObsticles() {
    $(board).off();

    $(board).on("click", function(event) {
        if (event.target.className == BOX_ID_SELECTOR) {
            event.target.classList.add(NEW_ID_SELECTOR);
            event.target.classList.remove(BOX_ID_SELECTOR);
        }
    });
}

function MarkStart() {
    $(board).off();

    $(board).on("click", function(event) {
        if (AnyStartPoint()) {
            if (event.target.className == BOX_ID_SELECTOR) {
                event.target.classList.add(START_ID_SELECTOR);
                event.target.classList.remove(BOX_ID_SELECTOR);
            }
        }
    });
}

function MarkStop() {
    $(board).off();

    $(board).on("click", function(event) {
        if (AnyEndPoint()) {
            if (event.target.className == BOX_ID_SELECTOR) {
                event.target.classList.add(STOP_ID_SELECTOR);
                event.target.classList.remove(BOX_ID_SELECTOR);
            }
        }
    });
}

function backToDefaultClass(event) {
    let defaultClass = event.target.className;
        event.target.classList.add(BOX_ID_SELECTOR);
        event.target.classList.remove(defaultClass);
}

function removeMark() {
    $(board).off();
    $(board).on("click", function(event) {
    if (event.target.className == NEW_ID_SELECTOR && event.target.id != "left-panel") {

            backToDefaultClass(event)

        } else if (event.target.className == START_ID_SELECTOR) {

            backToDefaultClass(event)
            selectStartBtn.disabled = false;
        } else if (event.target.className == STOP_ID_SELECTOR) {

            backToDefaultClass(event)
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
            if (div.className != EMPTY_ID_SELECTOR) {
                if (div.className == START_ID_SELECTOR) {
                    tab.push("S");
                } else if (div.className == STOP_ID_SELECTOR) {
                    tab.push("E");
                } else if (div.className == BOX_ID_SELECTOR) {
                    tab.push(".");
                } else {
                    tab.push("x");
                }
            }
        } else {
            arr.push(tab);
            tab = [];
            if (div.className !== EMPTY_ID_SELECTOR) {
                if (div.className == START_ID_SELECTOR) {
                    tab.push("S");
                } else if (div.className == STOP_ID_SELECTOR) {
                    tab.push("E");
                } else if (div.className == BOX_ID_SELECTOR) {
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
    let allDiv = document.querySelectorAll(changeIdToClassSelector([BOX_ID_SELECTOR,NEW_ID_SELECTOR,START_ID_SELECTOR,STOP_ID_SELECTOR,PATH_ID_SELECTOR]))
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let z = 0; z < arr[i].length; z++) {
            let containStart = allDiv[counter].classList.contains(START_ID_SELECTOR)
            let containStop = allDiv[counter].classList.contains(STOP_ID_SELECTOR);
            if (arr[i][z] === "P" && !containStart && !containStop) {
                allDiv[counter].classList.add(PATH_ID_SELECTOR);
                allDiv[counter].classList.remove(BOX_ID_SELECTOR);
            }
            counter++;
        }
    }
    if (path.length == 2) {
        info.innerHTML = "Punkty znajdują się obok siebie";
    }
};