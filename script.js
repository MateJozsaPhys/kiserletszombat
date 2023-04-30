document.addEventListener("DOMContentLoaded", function() {
  const gridSize = 10;
  const gridS = 20;
  const bunnyGrid = document.getElementById("bunny-grid");
  const grid = document.getElementById("grid")
  const yScaleGrid = document.getElementById("y-scale-grid");
  const slider = document.getElementById("mySlider");
  const yearContainer = document.getElementById("years");
  let r = parseFloat(slider.value);
  let db = 0;
  let x = 0.01;
  let time = 0;
  let roundX = 0;
  let roundX2 = 0;

  for (let i = 0; i < gridS*gridS; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }

  for (let i = 0; i < gridSize*gridSize; i++) {
    let bunnyCell = document.createElement("div");
    bunnyCell.classList.add("no-bunny-cell");
    bunnyGrid.appendChild(bunnyCell);
  }

  for (let i = 0; i < 3*16; i++) {
    let bunnyCell = document.createElement("div");
    if ( (i < 9) || (i >= 18 && i < 24) || (i > 32 && i <= 35) || (i > 45 && i <= 46)){
      bunnyCell.classList.add("bunny-cell");
    } else{
      bunnyCell.classList.add("no-bunny-cell");
    }
    
    yScaleGrid.appendChild(bunnyCell);
  }

  slider.addEventListener("input", function() {
    r = parseFloat(slider.value);
    time = 0;
    db = 0;
    x = 0.01;
    for (let i = 0; i < gridS*gridS; i++){
      grid.childNodes[i].classList.remove("highlighted");
    }
  });

  setInterval(function() {
    if (r >= 2.4 && r <= 4.0 && db == 0) {
      x = r * x * (1 - x);
      roundX = Math.round(x * (gridSize*gridSize));
      for (let i = 0; i< gridSize*gridSize; i++){
        if (typeof bunnyGrid.childNodes[i].classList === 'object'){
          bunnyGrid.childNodes[i].classList.remove("bunny-cell");
        }
      }
      for (let i = 0; i < roundX+1; i++){
        if (typeof bunnyGrid.childNodes[i].classList === 'object'){
          bunnyGrid.childNodes[i].classList.add("bunny-cell");
        }
      }
      roundX2 = (gridS-1) - Math.round(x * (gridS-1));
      cellIndex = time + roundX2 * gridS;
      cellToHighlight = grid.childNodes[cellIndex];
      cellToHighlight.classList.add("highlighted");
      yearContainer.innerHTML = `${time+1}. év`;
      if (time < 19){
        time = time + 1;
      } else {
        db = 1;
      }
    }
  }, 1000);
 
});
