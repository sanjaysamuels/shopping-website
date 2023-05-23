window.onload = async function() {
  const user = await getUserData();
  await renderReceipt(user);
}

let items;

async function renderReceipt(user) {
  const response = await fetch(`orders?userId=${user._id}`);
  const orders = await response.json();
  const template = get("item-row-template");
  orders.forEach(item => renderItem(template, item));
}

function renderItem(template, { _id, subTotal, taxes, totalAmount }) {
  renderRow(template, _id, formatAmount(subTotal), formatAmount(taxes), formatAmount(totalAmount));
}

function renderRow(template, col1, col2, col3, col4) {
  const newItemRow = template.cloneNode(true);
  const itemLink = newItemRow.getElementsByTagName("a")[0];
  const itemTitle = newItemRow.getElementsByTagName("p")[0];
  const itemQuantity = newItemRow.getElementsByTagName("p")[1];
  const itemPrice = newItemRow.getElementsByTagName("p")[2];
  const itemAmount = newItemRow.getElementsByTagName("p")[3];

  itemLink.setAttribute("href", `receipt.html?orderId=${col1}`);
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
