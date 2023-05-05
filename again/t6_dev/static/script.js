window.addEventListener('load', () => {
            console.log("Loaded");
//document.addEventListener('DOMContentLoaded', function() {
            const randomString = Math.random().toString(36).substring(2);
            const textField = document.getElementById('name-field');
            textField.value = randomString;
            //const socket = io.connect('http://' + document.domain + ':' + location.port, {query:{'name':randomString}, ); // if using @socketio.on('connect') on the server side
            const socket = io.connect('http://' + document.domain + ':' + location.port);
            console.log(socket.id);
            socket.on('connect', () => {
                socket.emit("after_connect_client", {'sid':socket.id, 'name':randomString});
            });

  const canvas = document.getElementById('mainCanvas');

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const ctx = canvas.getContext('2d');
  const stripe = document.getElementById('stripe');
  const toBeRemoved = 90;
  let pixelPositions = [];
  let iterLimit = 100;
  let isIterating = 0;

  const updateStripePosition = (x) => {
    x = Math.max(0, Math.min(x, canvas.width - stripe.offsetWidth));
    stripe.style.left = x + 'px';
  };

  canvas.addEventListener('click', (e) => {
    if (isIterating == 1) return;
    const stripeX = e.clientX - canvas.getBoundingClientRect().left - stripe.offsetWidth / 2;
    updateStripePosition(stripeX);
    throwLogisticMapPixels();
    notifyServer();
  });

  const logisticMap = (x, r) => {
    return r * x * (1 - x);
  };

  
  const notifyServer = () => {
    console.log("notifying Server");
    const stripeCenterX = stripe.getBoundingClientRect().left - canvas.getBoundingClientRect().left + stripe.offsetWidth / 2;
    const r = (stripeCenterX / canvas.width) * 4;      
    socket.emit("r_changed", {'sid':socket.id, 'name':textField.value, 'r_val':r});
  };
  
  const throwLogisticMapPixels = () => {
    const stripeCenterX = stripe.getBoundingClientRect().left - canvas.getBoundingClientRect().left + stripe.offsetWidth / 2;
    const r = (stripeCenterX / canvas.width) * 4;
    let x = 0.5;

    isIterating = 1;
    for (let i = 0; i <= iterLimit; i++) {
      x = logisticMap(x, r);
      if (i > 0) {
        const pixelX = stripeCenterX;
        const pixelY = canvas.height - x * canvas.height;
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        pixelPositions.push([pixelX, pixelY]);
        ctx.fillRect(pixelX, pixelY, 2, 2);
      }
      if (i == iterLimit) {
        resetPixels();
        pixelPositions = [];
        isIterating = 0;
      }
    }
  };

  function resetPixels() {
    for (let ii = 0; ii < toBeRemoved; ii++){
      console.log("Resetting")
      // calculate the index of the pixel to modify
//    const index = (y * canvas.width + x) * 4;
//
//    // set the red, green, and blue values to 255 (white)
//    imageData.data[index] = 255;      // red
//    imageData.data[index + 1] = 255;  // green
//    imageData.data[index + 2] = 255;  // blue
//
//    // put the modified pixel data back onto the canvas
//    ctx.putImageData(imageData, 0, 0);

//      ctx.fillStyle = "rgba(0, 0, 0, 0.0)";
//      ctx.fillRect(pixelPositions[0], pixelPositions[1], 2, 2);
      };
    };
  // Initialize stripe position
  updateStripePosition(0);
});

