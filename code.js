
const board = document.getElementById("left-panel")
const startBtn = document.getElementById("start")
const reloadBtn= document.getElementById("more")
const selectDestinationsBtn = document.getElementById("selectDestinations")
const selectObsticlesBtn = document.getElementById("selectObsticles")
const removeMarkBtn = document.getElementById("removeMark")
const createBoardBtn = document.getElementById("submit")

$(startBtn).on("click", startA)
$(reloadBtn).on("click", () => {location.reload()})
$(selectDestinationsBtn).on("click",selectDestinations)
$(selectObsticlesBtn).on("click", selectObsticles)
$(removeMarkBtn).on("click",removeMark)
$(createBoardBtn).on("click",function(event) {event.preventDefault(); createBoard()})


let height = null;
let width = null;

function createBoard(){
const he = Math.min(document.getElementById("height").value || 10, 100) || 10;


const wi = Math.min(document.getElementById("width").value || 10, 100) || 10;

height = he;
width = wi;


for(let x = 0; x < height; x++)
{

for (let i = 0; i < width; i++) 

{

const newDiv = document.createElement('div');
newDiv.classList.add("box");
board.appendChild(newDiv);

}

emptyDiv = document.createElement("div")
emptyDiv.classList.add("empty")
board.appendChild(emptyDiv)
console.log("added empty div")

}

}


function selectObsticles()
{
   $(board).off()


   $(board).on("click", function(event){
    if(event.target.className == "box")
       {
        event.target.classList.add("new") 
        event.target.classList.remove("box")
       }
})

}

function selectDestinations()
{
    $(board).off()


    $(board).on("click", function(event){
      if(event.target.className == "box")
        {
          event.target.classList.add("start")
          event.target.classList.remove("box")
        }
  })
  
  
   $(board).on("dblclick", function(event)
  {
      if( event.target.className == "start")
      {
        event.target.classList.add("stop")  
        event.target.classList.remove("start")
      }
  })
}
  
  function removeMark()
  {
    $(board).off()
    $(board).on("click", function(event)
    {
      if(event.target.className != "box" && event.target.id != "left-panel")
        {
         let defaultClass = event.target.className
         event.target.classList.add("box")
         event.target.classList.remove(defaultClass)
        }
  })
  }



function startA()
{       
        document.getElementById("start").disabled = true;
        let grid = [];
        let tab = [];
        let columns = document.querySelectorAll("#left-panel > div");

        columns.forEach((div) => {
  
            if(tab.length<width)
            {
              if(div.className != "empty")
               {              
                if(div.className == "start"){
                    tab.push("S")}

                else if(div.className == "stop"){
                    tab.push("E")} 
                
                else if(div.className == "box"){
                    tab.push(".")} 
                   
                else  {
                    tab.push("x")}
               }
              
               
        }
        else
        {

            grid.push(tab)
            tab = [];
            if(div.className !== "empty")
                {
                    if(div.className == "start"){
                        tab.push("S")}
                    else if(div.className == "stop"){
                        tab.push("E")} 
                    else if(div.className == "box") {
                        tab.push(".")}
                    else {
                        tab.push("x")} 
                }
        }
        })
      
        
        


const arr = grid;

let start = []
let stop = []
let openList = []
let closeList = []
let path = []




function searchDestinacions()
{
    for(let i=0; i<arr.length; i++)
    {
        for(let z = 0; z<arr[i].length; z++)
        {
            if(arr[i][z]=="S") start = [i,z];
            if(arr[i][z]=="E") stop = [i,z];

        }
    }
   closeList.push({location: start, 
    fCost: 0 + hCost(start), 
    gCost: 0, 
    hCost: hCost(start)});
   

   PossibleWay(start)

}

function gCost(currentPosition) {
    
   
    let element = closeList.find((item) => 
    item.location == currentPosition
    );

    return element.gCost + 1;
}


function hCost(currentPosition) {
    let stopOddX = currentPosition[0] - stop[0]
    let stopOddY = currentPosition[1] - stop[1]
    return Math.sqrt(stopOddX * stopOddX + stopOddY * stopOddY)

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

function PossibleWay(location)
{
    

const up = location[0] - 1;
const down = location[0] + 1;
const left = location[1] - 1;
const right = location[1] + 1;


const upperLocation = {location: [up, location[1]], 
    fCost: gCost(location) + hCost([up, location[1]]), 
    gCost: gCost(location),
    hCost: hCost([up, location[1]]),
    parent: location}

const bottomLocation = {location: [down, location[1]],
    fCost: gCost(location) + hCost([down, location[1]]),  
    gCost: gCost(location), 
    hCost: hCost([down, location[1]]),
    parent: location} 

const leftLocation = {location: [location[0], left],
    fCost: gCost(location) + hCost([location[0],left]), 
    gCost: gCost(location), 
    hCost: hCost([location[0], left]),
    parent: location}

const rightLocation = {location: [location[0], right],
    fCost: gCost(location) + hCost([location[0],right]), 
    gCost: gCost(location), 
    hCost: hCost([location[0], right]),
    parent: location}

  

if(up >= 0 && arr[up][location[1]] != "x" && notInCloseList(upperLocation) && notInOpenList(upperLocation)) 
{
    openList.push(upperLocation);
    
}
if(down < height && arr[down][location[1]] != "x" && notInCloseList(bottomLocation) && notInOpenList(bottomLocation)) 
{
    openList.push(bottomLocation);
  
}
if(left >= 0 && arr[location[0]][left] != "x" && notInCloseList(leftLocation) && notInOpenList(leftLocation)) 
{   
    openList.push(leftLocation);
   
}
if(right < width && arr[location[0]][right] != "x" && notInCloseList(rightLocation) && notInOpenList(rightLocation)) 
{  
    openList.push(rightLocation);
   
}

}
function neighbours()
{   let sameFcost = [];
    const lowestFcost = openList.reduce((a,e) => a.fCost < e.fCost ? a : e)
    sameFcost = openList.filter((item) => item.fCost==lowestFcost.fCost)
    sameFcost = sameFcost.reduce((a,e) => a.hCost < e.hCost ? a : e)
    closeList.push(sameFcost)
    openList = openList.filter(item => item !== sameFcost);
    PossibleWay(sameFcost.location)
      
}

function showPath() {
    let current = closeList.find(item => item.location[0] === stop[0] && item.location[1] === stop[1]);
    
    while (current.location!=start) {
        path.push(current.location); 
        current = closeList.find(item => 
           item.location == current.parent
        );
    }
    path.push(start)
    console.log(path)
    return path; 
}
function A_Star()
{

    searchDestinacions()
    while(!closeList.some((item) => item.location[0]===stop[0] && item.location[1]===stop[1]))
    {
      neighbours()
      if(openList.length == 0 && !closeList.some((item) => item.location[0] == stop[0] && item.location[1]==stop[1])) 
      {
        document.getElementById("info").innerHTML = "Brak ściezki"
        return;
      }
    }
    showPath()
}


function graficShow()
{
    for(let i = 0; i < arr.length; i++)
    {
        for(let z = 0; z < arr[i].length; z++)
        {
            if(path.some((item) => item[0]==i && item[1]==z)) arr[i][z] = "P"
        }
    }

let allDiv = document.querySelectorAll(".box, .new, .start, .stop, .path");
let counter = 0;
for(let i = 0; i<arr.length; i++)
    {
        for(let z = 0; z<arr[i].length; z++)
        {

            if(arr[i][z] === "P" && !allDiv[counter].classList.contains("start") && !allDiv[counter].classList.contains("stop"))
            {
                allDiv[counter].classList.add("path")
                allDiv[counter].classList.remove("box")
            }

            counter++;

        }
    }
  
} 

A_Star()
graficShow()

}




