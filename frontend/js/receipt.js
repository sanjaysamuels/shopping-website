window.onload = async function() {
  const orderId = getParam("orderId");
  await showReceiptForOrder(orderId);
}

let items;

async function showReceiptForOrder(orderId) {
  items = await getItems();
  const response  = await fetch(`orders/${orderId}`);
  const order = await response.json();
  order.id ? await renderReceipt(order) : renderNotFoundOrder();
}

async function renderReceipt(order) {
  const response = await fetch(`orderItems?orderId=${order.id}`);
  const orderItems = await response.json();
  const template = get("item-row-template");
  orderItems.forEach(item => renderItem(template, item));
  renderTotals(template, "Sub Total", order.subTotal);
  renderTotals(template, "Tax (13%)", order.taxes);
  renderTotals(template, "Total Amount", order.totalAmount);
}

function renderTotals(template, title, amount) {
  const row = renderRow(template, "", "", title, formatAmount(amount));
  row.getElementsByTagName("p")[2].style.fontWeight = 600;
  row.getElementsByTagName("p")[3].style.fontWeight = 600;
}

function renderItem(template, { itemId, quantity, price, amount }) {
  const item = items.find(item => item.id === itemId);
  renderRow(template, item.name, quantity, formatAmount(price), formatAmount(amount));
}

function renderRow(template, col1, col2, col3, col4) {
  const newItemRow = template.cloneNode(true);
  const itemTitle = newItemRow.getElementsByTagName("p")[0];
  const itemQuantity = newItemRow.getElementsByTagName("p")[1];
  const itemPrice = newItemRow.getElementsByTagName("p")[2];
  const itemAmount = newItemRow.getElementsByTagName("p")[3];

  itemTitle.textContent = col1;
  itemQuantity.textContent = col2;
  itemPrice.textContent = col3;
  itemAmount.textContent = col4;

  document.getElementsByTagName("tbody")[0].appendChild(newItemRow);
  makeVisible(newItemRow);
  return newItemRow;
}

function renderNotFoundOrder() {
  document.getElementsByTagName("table")[0].classList.add("visually-hidden");
  document.getElementsByTagName("h1")[0].textContent = "Order has not been found";
}

function getOrders() {
  const orders = JSON.parse(localStorage.getItem("orders"));
  return orders ? orders : {};
}
