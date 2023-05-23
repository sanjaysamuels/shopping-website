/* Common data and functions */
async function showCartIndicator() {
  const cart = await loadFullCart();
  const itemsQuantity = Object.keys(cart).length

  const cartIcon = get("cart-icon");
  const cartInfo = get("cart-info");
  const cartLink = get("cart-link");

  if (itemsQuantity > 0) {
    cartIcon.classList.add("text-danger")
    cartInfo.textContent = `${itemsQuantity} Items`;
    cartLink.classList.remove("disabled");
  } 
  else {
    cartIcon.classList.remove("text-danger")
    cartInfo.textContent = "Empty";
    cartLink.classList.add("disabled");
  }
}

async function loadFullCart() {
  const cartData = await getCart();
  const cartItemsResponse = await fetch(`CartItems?cartId=${cartData.id}`);
  const cartItems = await cartItemsResponse.json();
  const itemsDictionary = {};

  const items = await getItems();
  items.forEach(item => {
    itemsDictionary[item.id] = item;
  });
  const cart = {};

  if (cartItems.length > 0) {
    cartItems.forEach(ca => {
      let item = itemsDictionary[ca.itemId];
      cart[ca.itemId] = {
        id: ca.id,
        itemId: ca.itemId,
        price: item.price,
        quantity: ca.quantity,
        amount: ca.amount
      };
    });
  }

  return cart;
}

async function getCart() {
  const user = await getUserData();
  const cartResponse = await fetch(`user/${user._id}/cart`);
  return await cartResponse.json();
}

async function getUserData() {
  const username = localStorage.getItem('un');
  const response = await fetch(`user?username=${username}`);
  const result = await response.json();
  if (!result || result.length == 0) {
    throw "User has not been found";
  }
  return result[0];
}


async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

async function putData(url = '', data = {}) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    const response = await fetch(url, requestOptions);
    const json = await response.json();
    return json;
}

async function patchData(url = '', data = {}) {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    const response = await fetch(url, requestOptions);
    const json = await response.json();
    return json;
}

async function remove(url = '') {
    const requestOptions = {
        method: 'DELETE',
    };
    return await fetch(url, requestOptions);;
}

function makeVisibleById(elementId) {
  makeVisible(get(elementId));
}

function makeVisible(element) {
  element.classList.remove("visually-hidden"); 
}

function get(id) {
  return document.getElementById(id);
}

function goToHome() {
  window.location.href = "index.html";
}

function formatAmount(amount) {
  var formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });

  return formatter.format(amount);
}

function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
