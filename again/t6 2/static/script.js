document.addEventListener("DOMContentLoaded", function() {
//    console.log("Loaded");
//    const randomString = Math.random().toString(36).substring(2);
//    const textField = document.getElementById('name-field');
//    textField.value = randomString;
//    const socket = io.connect('http://' + document.domain + ':' + location.port);
//    console.log(socket.id);
//    socket.on('connect', () => {
//        socket.emit("after_connect_client", {'sid':socket.id, 'name':randomString});
//    });
  const iterLimit = 100;
  const gridS = 100;
  const grid = document.getElementById("grid");
  let columnID = 0;
  let sliderX = 0;
  let x = 0.01;
  let r = 0.0;
  let db = 0;
  let converged = 0.5;
  let minR = 1.0;
  let maxR = 4.0;
  let lastCells = [];

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
        r = minR + (maxR-minR) * (columnID / gridS)
//        notifyServer();
        });
    grid.appendChild(cell);
  };
  highlightSlider();
  setInterval(function() {

    if (r >= minR && r <= maxR && db <= iterLimit) {
      x = r * x * (1 - x);
      roundX2 = (gridS-1) - Math.round(x * (gridS-1));
      cellIndex = columnID + roundX2 * gridS;
      cellToHighlight = grid.childNodes[cellIndex];
      cellToHighlight.classList.add("highlighted");

      if (db >= iterLimit * converged) {
        lastCells.push(cellIndex);
      }
      if (db == iterLimit) {
        resetColumn();
        for (let ii = 0; ii < lastCells.length; ii++) {
            cellToHighlight = grid.childNodes[lastCells[ii]];
            cellToHighlight.classList.add("converged");
        }
        lastCells = [];
        }
    db += 1;
    }
  }, 10);

function highlightSlider() {
    for (let i = 0; i < gridS; i++){
      grid.childNodes[gridS * i + columnID].classList.add("slider");
    };
  };

function resetColumn() {
    for (let i = 0; i < gridS; i++){
      grid.childNodes[gridS * i + columnID].classList.remove("highlighted");
    };
  };

function removeSliderHighlight() {
    for (let i = 0; i < gridS; i++){
      grid.childNodes[gridS * i + columnID].classList.remove("slider");
    };
  };

const notifyServer = () => {
    console.log("notifying Server");
    const stripeCenterX = stripe.getBoundingClientRect().left - canvas.getBoundingClientRect().left + stripe.offsetWidth / 2;
    const r = (stripeCenterX / canvas.width) * 4;
    socket.emit("r_changed", {'sid':socket.id, 'name':textField.value, 'r_val':r});
  };

});