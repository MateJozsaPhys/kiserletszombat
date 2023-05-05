

document.addEventListener("DOMContentLoaded", function() {
  const bunny_button = document.getElementById("bunny_button");
  const logistic_button = document.getElementById("logistic_button");
  let bunny_page = "";
  let logistic_page = "";
  let x = 0.01;
  let time = 0;
  let roundX = 0;
  let roundX2 = 0;


  slider.addEventListener("input", clearRabbitField);
  slider.addEventListener('dblclick', increaseSliderValue);

  setInterval(function() {
    if (r >= 2.4 && r <= 4.0 && db == 0) {
      x = r * x * (1 - x);
      roundX = Math.round(x * (gridSize));
      for (let i = 0; i< gridSize+1; i++){
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
      if (time < 29){
        time = time + 1;
      } else {
        db = 1;
      }
    }
  }, 1000);


function clearRabbitField() {
    r = parseFloat(slider.value);
    time = 0;
    db = 0;
    x = 0.01;
    for (let i = 0; i < gridS*gridS; i++){
      grid.childNodes[i].classList.remove("highlighted");
    }
  };


function increaseSliderValue() {
    sv = parseFloat(slider.value);
    if (dbclicked == 0){
        if (sv + sliderIncrease > maxValue) {newvalue = maxValue}
        else {newvalue = sv + sliderIncrease};
        slider.value = newvalue;
        dbclicked = 1;
        }
    else {
        if (sv + sliderIncrease < minValue) {newvalue = minValue}
        else {newvalue = sv - sliderIncrease};
        slider.value = newvalue;
        dbclicked = 0;
        }

    clearRabbitField();
  };


});
