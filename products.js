const cartUpdate = document.getElementById('update-cart');
const cartCount = document.getElementById('span-count');
const cartList = document.querySelector('.your-cart-list');
const bodyElement = document.body
const mainElement = document.getElementById('main')
const message = document.getElementById('msgBox')


const imageUrl = {
  image12: './images/celebration.gif',
  gif: './images/loading.gif'
}
// const mainEl = document.getElementById('main')
let cart = [];
let totalPrice = 0;


const bigContainer = document.querySelectorAll('.big-container')

bigContainer.forEach((containers)=>{
    //for the images
  const image = containers.querySelector('img').src
  // for the text ie the product title
  const title = containers.querySelector('.common').textContent
  //price
  const price = Number(containers.querySelector('.common-dollar').textContent.replace('$', ''))
  //for buttons
  const button = containers.querySelector('.add-to-cart')

  //event starting point
  button.addEventListener('click', () => {
    const foundItems = cart.find((item) => item.title === title);
    
    if (foundItems) {
      foundItems.productQuantity += 1;//I used that productQuantity out of nowhere. It means u can give it any name manually.
      showMessage(`Added another ${title}`);
    } else {
      cart.push({ title, price, productQuantity: 1, image });
      showMessage(`${title} added to cart`);
    }

    updateCartUI();
  });
});
//event ended here

//show image function 
let showMessage = (message)=>{
  cartUpdate.textContent = message;
  cartUpdate.style.cssText = `
    width: 100%;
    text-align: center;
    padding: 10px;
    margin-bottom: 20px;
    background: green;
    color: white;
    font-size: 30px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  `;

  const imageEl = document.createElement('img')
  imageEl.src = imageUrl.image12
  imageEl.style.cssText = `
                          width: 100px;
                          `
  cartUpdate.appendChild(imageEl)

  setTimeout(() => {
    cartUpdate.style.display = 'none';
  }, 3000);
}

//update cart user interface
let updateCartUI = ()=>{
  cartList.innerHTML = `
    <h1>Your cart <span id="span-count">(${cart.length})</span></h1>
  `;

  totalPrice = 0;

  cart.forEach((item, i) => {
    const itemTotal = item.price * item.productQuantity;
    totalPrice += itemTotal;

    //the added cart container div starts here
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.style.marginBottom = '15px';

    itemDiv.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div>
          <p style="margin: 0; font-size: 18px;"><strong>${item.title}</strong></p>
          <p style="margin: 0; font-size: 18px;">$${item.price} * ${item.productQuantity}</p>
          <p style="margin: 0; font-size: 15px; font-weight: bold; margin: 8px 0">$${itemTotal.toFixed(2)}</p>

          <div style="margin-top: 5px;">
         
            <button onclick="changeQuantity(${i}, -1)" style="padding: 12px 14px; background: red; border: none; margin-right: 5px; font-weight: 800; color: white;  cursor: pointer">Remove</button>

            
            <button onclick="changeQuantity(${i}, 1)" style="padding: 12px 14px; background: green; color: white; font-weight: 800; border: none;  cursor: pointer;")>Add</button>

          </div>
        </div>
        <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
      </div>
    `;

    cartList.appendChild(itemDiv);
  });
  //its ended here.

  //this is to check if the Your CART is not zero
  if (cart.length > 0) {
    const totalDiv = document.createElement('div');
    totalDiv.style = "display: flex; justify-content: space-between; align-items: center; margin-top: 15px";
    totalDiv.innerHTML = `
      <p style='font-size: 25px;'><strong>Total</strong></p>
      <h2>$${totalPrice.toFixed(2)}</h2>
    `;
    cartList.appendChild(totalDiv);
    //this ends here

    //checkoutBtn starts here
    const checkoutBtn = document.createElement('button');
    checkoutBtn.textContent = 'Checkout';
    checkoutBtn.style.cssText = 'margin-top: 20px; padding: 10px; background: orange; border: none; border-radius: 5px; width: 100%; font-size: 18px; font-weight: bold; cursor: pointer';
    cartList.appendChild(checkoutBtn);
    //its ended here

    // Attach listener AFTER button is created
    checkoutBtn.addEventListener('click', () => {
      //check if the checkbutton is clicked
      if(!checkoutBtn.disabled){
        confirmOrder();
        //dim the main content
        mainElement.style.cssText = `
        opacity: 0.3;
        background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5));
      `
      //disable the button to avoid double clicking
      checkoutBtn.disabled = true

      //after 3 seconds the mainElement will return to its initial background
      setTimeout(()=>{
        mainElement.style.cssText = `
        opacity: 1
        `
        checkoutBtn.disabled = false
      }, 10000)
      }
    });
  }
}
//the updateUi ends here.

// ✅ Removed duplicate checkout block that was outside the function

function changeQuantity(index, delta) {
  cart[index].productQuantity += delta;

  if (cart[index].productQuantity <= 0) {
    const removed = cart.splice(index, 1)[0];
    showMessage(`${removed.title} removed from cart`);
  } else {
    showMessage(`${cart[index].title} quantity updated to ${cart[index].productQuantity}`);
  }

  updateCartUI();
}


let confirmOrder = ()=>{
  // This is to send a feedback mail to the user
    const msgBox = document.getElementById("msgBox");


  emailjs.sendForm("service_83lvxrm", "template_pw47dsc", this)
    .then(() => {
      msgBox.innerHTML = "Your order is received. A confirmation email has been sent!";
      msgBox.style.cssText =`
                            color: green;
                            background-color: white;
                            padding: 1.25rem;
                            text-align: center;
                            `;
      this.reset();
    }, (err) => {
      console.error("Failed to send email:", err);
      msgBox.innerHTML = "Something went wrong. Please try again.";
      msgBox.style.color = "red";
    });

  
  // Save cart details before clearing
  const confirmedCart = [...cart];
  const confirmedTotal = totalPrice;


  // Clear cart
  cart = [];
  updateCartUI(); // Re-render the cart with empty content

  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 400px;
    height: 400px;
    background: whitesmoke;
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    text-align: center;
  `;

   //Waiting loading image
   const loading = document.createElement('img')
   loading.src = imageUrl.gif
   loading.style.cssText = `
                             width: 100%;
 
                           `
     const textMessage = document.createElement('p')
     textMessage.textContent = 'Please wait while we are confirming your order'
     textMessage.style.cssText = `
                           font-size: 20px;
                           font-weight: bold;
                           text-align: center;
                           color: green
                           
                           `
    const textMessage2 = document.createElement('p')
    textMessage2.textContent = 'Your order is almost ready...'
    textMessage2.style.cssText = `
                                  font-size: 20px;
                                  font-weight: bold;
                                  text-align: center;
                                  color: green
                                  
                                  `
      

     // ✅ Checkmark SVG (green and smaller)
     const checkmark = document.createElement('div');
     checkmark.innerHTML = `
       <svg width="50" height="50" viewBox="0 0 100 100">
         <circle cx="50" cy="50" r="45" stroke="green" stroke-width="5" fill="none" />
         <polyline points="30,55 45,70 70,40" style="fill:none;stroke:green;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;" />
       </svg>
     `;
     const polyline = checkmark.querySelector('polyline');
     setTimeout(() => {
       polyline.style.transition = 'stroke-dashoffset 1s ease';
       polyline.style.strokeDashoffset = '0';
     }, 100);

    // Confirmation text
    const confirmedText = document.createElement('h1');
    confirmedText.textContent = 'Order Confirmed!';
    confirmedText.style.cssText = `
      color: black;
      font-size: 30px;
      margin-bottom: 15px;
    `;

  // ✅ Items list
  const itemList = document.createElement('div');
  itemList.style.cssText = `
    color: black;
    background: yelloworange;
    font-size: 16px;
    margin-top: 15px;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    max-width: 400px;
    text-align: left;
  `;

  confirmedCart.forEach(item => {
    const itemLine = document.createElement('p');
    itemLine.innerHTML = `<strong>${item.title}</strong> x${item.productQuantity} - $${(item.price * item.productQuantity).toFixed(2)}`;
    itemList.appendChild(itemLine);
  });

  // ✅ Total display
  const totalDisplay = document.createElement('h3');
  totalDisplay.textContent = `Total: $${confirmedTotal.toFixed(2)}`;
  totalDisplay.style.cssText = `
    color: black;
    margin-top: 10px;
  `;

  //message

  const messageDisplay = document.createElement('p')
  messageDisplay.textContent = `Thank you for your custom. We hope you enjoy your meal`
  messageDisplay.style.cssText = `
  color: black;
  margin-top: 10px;
  `

 


  // Append all
 
  overlay.appendChild(loading)
  overlay.appendChild(textMessage)
  document.body.appendChild(overlay);

  setTimeout(()=>{
    overlay.appendChild(textMessage2)
    overlay.appendChild(textMessage).remove()
  },3000)

  setTimeout(()=>{
    overlay.appendChild(confirmedText);
    overlay.appendChild(checkmark);
    overlay.appendChild(itemList);
    overlay.appendChild(totalDisplay);
    overlay.appendChild(messageDisplay)
    overlay.appendChild(loading).remove()
    overlay.appendChild(textMessage2).remove()
  },6000)

  setTimeout(()=>{
    overlay.appendChild(textMessage2).remove();
  },8000)

  // Remove overlay after 4 seconds
  setTimeout(() => {
    overlay.remove();
  }, 10000);
}

//changing the background color to change the mode from dark to light 
const toggleSwitch = document.getElementById('switch');
const candoEl = document.getElementById('cando-engineer');
const switchCircle = document.getElementById('switch-circle')

toggleSwitch.addEventListener('click', function () {
  toggleSwitch.classList.toggle('active');
 
  
  if (bodyElement.classList.contains('change')) {
    bodyElement.classList.remove('change');
    cartList.style.cssText = `
    color: black;
    background: white;
    `
    candoEl.style.cssText = `
    color: red;
    `
    switchCircle.style.background = 'red';
  } else {
    bodyElement.classList.add('change');
    candoEl.style.cssText = `
    color: white;
    `
    cartList.style.cssText = `
    color: black;
    background: white;
    `
  }
});




