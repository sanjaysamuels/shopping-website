const ONTARIO_TAX = 0.13;
const ITEMS_COLLECTION = "items";

async function getItems() {
  const response = await fetch(ITEMS_COLLECTION);
  const items = await response.json();
  return items;
};

function getItemsFromCache() {
  return JSON.parse(localStorage.getItem(ITEMS_COLLECTION));
}
