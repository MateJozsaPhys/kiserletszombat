window.addEventListener('load', () => {
            console.log("Loaded");
//document.addEventListener('DOMContentLoaded', function() {
            const socket = io.connect('http://' + document.domain + ':' + location.port + '/admin_public');
            socket.on('connect', () => {
                socket.emit("after_connect_admin_public", {'sid':socket.id});
                console.log(socket.id);
            });
            //const clientCountElement = document.getElementById('clientCount');
//             socket.on('connected_clients_info', function(data) {
//                 clientsList.innerHTML = '';
//                 data.clients.forEach(function(sid) {
//                     const listItem = document.createElement('li');
//                     listItem.textContent = sid;
//                     clientsList.appendChild(listItem);
//                 //clientCountElement.textContent = data.client_count;
//                 });
//                 sidElement.textContent         = data.sid;
//             });

//             socket.on("connect", () => {
//                 const data = {'sid':socket.id, 'name':document.getElementById('name-field').value}
//                 socket.emit("connect", data);
//             });

            
            socket.on('put_pixels', (data) => {
                r = data.r
                y = data.y
                console.log(data.sid);
                console.log(data.name);                
                console.log(data.r);
                //console.log(data.y);
                for (let i = 0; i < y.length; i++) {
                    pixelX = r/4*canvas.width;
                    pixelY = canvas.height - y[i] * canvas.height;
                    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                    ctx.fillRect(pixelX, pixelY, 2, 2);
                }
            });
  const canvas = document.getElementById('mainCanvas');
  const ctx = canvas.getContext('2d');
  const stripe = document.getElementById('stripe');

  const updateStripePosition = (x) => {
    x = Math.max(0, Math.min(x, canvas.width - stripe.offsetWidth));
    stripe.style.left = x + 'px';
  };

  canvas.addEventListener('click', (e) => {
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
    //const stripeCenterX = stripe.getBoundingClientRect().left - canvas.getBoundingClientRect().left + stripe.offsetWidth / 2;
    const r = (stripeCenterX / canvas.width) * 4;
    let x = 0.5;

    for (let i = 0; i < 500; i++) {
      x = logisticMap(x, r);
      if (i > 250) {
        const pixelX = stripeCenterX;
        const pixelY = canvas.height - x * canvas.height;
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(pixelX, pixelY, 2, 2);
      }
    }
  };

  // Initialize stripe position
  updateStripePosition(0);
});
