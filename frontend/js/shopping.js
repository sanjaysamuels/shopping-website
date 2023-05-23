const ITEM_HTML_TEMPLATE = "item-template";
const ITEMS_HTML_CONTAINER = "items-container";
let items;

window.onload = async function() {
  try {
    await getUserData();
  }
  catch {
    window.location.href = "accounts.html";
  } 
  await showItems();
  await showCartIndicator();
}

async function showItems() {
  const container = get(ITEMS_HTML_CONTAINER);
  items = await getItems();
  items.forEach(item => {
    container.appendChild(createHtmlItem(item));
  });
}

function createHtmlItem({ id, name, price, imageUrl }) {
    const newItem = get(ITEM_HTML_TEMPLATE).cloneNode(true);
    newItem.setAttribute("id", `item-${id}`)
    makeVisible(newItem);

    const htmlImg = newItem.getElementsByTagName("img")[0];
    htmlImg.setAttribute("src", imageUrl);
    
    const htmlTitle = newItem.getElementsByTagName("h5")[0];
    htmlTitle.textContent = name;
    const htmlPrice = newItem.getElementsByTagName("p")[0];
    htmlPrice.textContent = `$${price}`;
    const htmlButton = newItem.getElementsByTagName("a")[0];
    htmlButton.setAttribute("href", `item-detail.html?itemId=${id}`);

    return newItem;
}
