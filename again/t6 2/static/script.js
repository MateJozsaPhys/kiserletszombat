document.addEventListener("DOMContentLoaded", function() {
  const gridS = 100;
  const grid = document.getElementById("grid");
  let columnID = 0;
  let sliderX = 0;
  let x = 0.01;
  let db = 0;

  for (let i = 0; i < gridS*gridS; i++) {
    let cell = document.createElement("div");
    cell.setAttribute("id", i);
    cell.classList.add("cell");
    cell.addEventListener("click", function() {
        removeSliderHighlight();
        columnID = parseFloat(this.id) % gridS;
        console.log(columnID);
        highlightSlider();
        x = 0.01;
        db = 0;
        });
    grid.appendChild(cell);
  };
  highlightSlider();
  setInterval(function() {
    r = 2.4 + 1.6 * (columnID / gridS)
    if (r >= 2.4 && r <= 4.0 && db <= 500) {
      x = r * x * (1 - x);
      roundX2 = (gridS-1) - Math.round(x * (gridS-1));
      cellIndex = columnID + roundX2 * gridS;
      cellToHighlight = grid.childNodes[cellIndex];
      cellToHighlight.classList.add("highlighted");
      db += 1;
    }
  }, 150);

  


function highlightSlider() {
    for (let i = 0; i < gridS; i++){
      grid.childNodes[gridS * i + columnID].classList.add("slider");
    };
  };

function removeSliderHighlight() {
    for (let i = 0; i < gridS; i++){
      grid.childNodes[gridS * i + columnID].classList.remove("slider");
    };
  };
});