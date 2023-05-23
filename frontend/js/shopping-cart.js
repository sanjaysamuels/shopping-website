window.onload = async function () {
  await loadUserData();
  items = await getItems();
  cartData = await getCart();
  showCartIndicator();
  await showCartItems();
  get("process-order").addEventListener("click", async e => {
    e.preventDefault();
    await processOrder();
  });
}

let cart;
let items;
let cartData;
let currentUserId;
let purchaseHistory;

async function loadUserData() {
  const user = await getUserData();
  purchaseHistory = user.purchase_history;
  currentUserId = user._id;
}

async function showCartItems() {
  cart = await loadFullCart();
  if (isCartEmpty()) {
    renderEmptyState();
  }
  else {
    const template = get("item-row-template");
    for (var itemId in cart) {
      renderItem(template, cart[itemId]);
    }
    renderTotalAmount();
  }
}

function renderItem(template, { itemId, amount, quantity }) {
  const newItemRow = template.cloneNode(true);
  newItemRow.setAttribute("id", `row-${itemId}`);
  const itemTitle = newItemRow.getElementsByTagName("p")[0];
  const itemAmount = newItemRow.getElementsByTagName("p")[1];
  const item = items.find(item => item.id === itemId);
  itemTitle.textContent = item.name;
  itemAmount.textContent = formatAmount(amount);
  const itemQuantity = newItemRow.getElementsByTagName("input")[0];
  itemQuantity.value = quantity;
  newItemRow.addEventListener("change", async e => {
    const newQuantity = Number(e.target.value);
    cart[itemId].quantity = newQuantity;
    cart[itemId].amount = newQuantity * item.price;
    itemAmount.textContent = formatAmount(cart[itemId].amount);
    await saveCart();
    renderTotalAmount();
  });
  const removeLink = newItemRow.getElementsByTagName("a")[0];
  removeLink.addEventListener("click", () => {
    var doDeleteIt = confirm("Do you want to delete this item?");
    if (doDeleteIt) {
      removeCartItem(itemId);
    }
  });

  document.getElementsByTagName("tbody")[0].appendChild(newItemRow);
  makeVisible(newItemRow);
}

async function removeCartItem(itemId) {
  delete cart[itemId];
  get(`row-${itemId}`).remove();
  
  await remove(`cartItems?cartId=${cartData.id}&itemId=${itemId}`);

  if (isCartEmpty()) {
    renderEmptyState();
  }
  else {
    renderTotalAmount();
  }
  showCartIndicator();
}

async function saveCart() {
  const itemsDictionary = {};

  items.forEach(item => {
    itemsDictionary[item.id] = item;
  });

  Object.entries(cart).forEach(async ([itemId, cartItem]) => {
    let item = itemsDictionary[itemId];
    if (cartItem.id) {
      await putData(`cartItems/${cartItem.id}`, {
        quantity: cartItem.quantity,
        amount: cartItem.amount
      });
    } else {
      await postData("cartItems", {
        cartId: cartData.id,
        itemId: itemId,
        price: item.price,
        quantity: cartItem.quantity,
        amount: cartItem.amount
      });
    }
  });
}

function renderTotalAmount() {
  let totalAmount = 0;
  for (var itemId in cart) {
    totalAmount += cart[itemId].amount;
  }
  get("total-amount").textContent = `TOTAL: ${formatAmount(totalAmount)}`;
}

function renderEmptyState() {
  document.getElementsByTagName("h1")[0].textContent = "The cart is empty";
  get("cart-form").classList.add("visually-hidden");
}

function isCartEmpty() {
  return Object.entries(cart).length === 0;
}

async function processOrder() {
  const newOrder = await createOrder();
  await updateUserPurchaseHistory();
  await cleanCart();
  window.location.href = `receipt.html?orderId=${newOrder.id}`;
}

async function createOrder() {
  const newOrder = {
    subTotal: 0,
    taxes: 0,
    totalAmount: 0,
    userId: currentUserId,
  };
  for (var itemId in cart) {
    let item = cart[itemId];
    newOrder.subTotal += item.amount;
  }
  newOrder.taxes = newOrder.subTotal * ONTARIO_TAX;
  newOrder.totalAmount = newOrder.subTotal + newOrder.taxes;

  const savedOrder = await postData('orders', newOrder);

  for (var itemId in cart) {
    let item = cart[itemId];
    await postData('orderItems', {
      orderId: savedOrder.id,
      itemId: itemId,
      price: item.price,
      quantity: item.quantity,
      amount: item.amount
    });
  }
  return savedOrder;
}

 async function updateUserPurchaseHistory() {
    const itemIds = [];
    for (var itemId in cart) {
      itemIds.push(itemId);
    }
    purchaseHistory.push(...itemIds);
    await patchData(`user/${currentUserId}`, { purchase_history: purchaseHistory });
 }

async function cleanCart() {
  await remove(`user/${currentUserId}/cart`);
}


