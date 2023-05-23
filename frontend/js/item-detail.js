const ITEM_DETAIL_HTML = "item-detail";
const NOT_FOUND_MESSAGE_HTML = "not-found";
const ITEM_HTML_TEMPLATE = "item-template";
const ITEMS_HTML_CONTAINER = "items-container";
const ORDERS = JSON.parse(localStorage.getItem("orders")) || [];
const CURRENT_USER = localStorage.getItem("un");

var itemId;
var newCommentArr;
let cart;
let comments = [
  {
    title: 'The product is really good.',
    desc: 'This is a test comment',
    imageUrl: 'images/img-1.jpeg'
  },
  {
    title: 'The product is really good.',
    desc: 'This is a test comment and the second one as well.',
    imageUrl: "images/img-4.jpeg"
  }
];
let currentItem;
let items;
var base64Img;

window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  itemId = params.get("itemId");
  cart = await loadFullCart();
  getAllProductComments();
  currentItem = await findItemById(itemId);
  currentItem ? showItem(currentItem) : showNotFoundItem();
  items = await getItems();
  console.log("THIS IS THE CURRENTUSER", CURRENT_USER)
}

// Example POST method implementation:
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
  return response.json(); // parses JSON response into native JavaScript objects
}

async function addToCart(itemId) {
  const quantityFromForm = Number(get("quantity").value);
  const quantityFromCart = cart[itemId] ? cart[itemId].quantity : 0;
  const quantity = quantityFromCart + quantityFromForm;
  const item = currentItem;

  const cartItem = {
    itemId: itemId,
    price: item.price,
    quantity: quantity,
    amount: item.price * quantity,
  };
  cart[itemId] = { ...cart[itemId], ...cartItem };

  await saveCart();
  goToHome();
}

async function saveCart() {
  const cartData = await getCart();
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

async function findItemById(id) {
  const item = await fetch(`items/${id}`)
  return await item.json();
}

function showItem({ id, name, description, imageUrl, price }) {
  get("title").textContent = name;
  get("description").textContent = description;
  get("price").textContent = `$${price}`;
  get("image").setAttribute("src", imageUrl);
  get("quantity-button").addEventListener("click", e => {
    e.preventDefault();
    addToCart(id);
  });

  makeVisibleById(ITEM_DETAIL_HTML);
}

function showNotFoundItem() {
  makeVisibleById(NOT_FOUND_MESSAGE_HTML);
}

// Backend image processing to store in the database is happening below this line
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
          resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
          reject(error);
      };
  });
};

const uploadImage = async (event) => {
  const avatar = document.getElementById("avatar");
  const file = event.target.files[0];
  base64Img = await convertBase64(file);
};

var createImg64 = function(event){
  uploadImage(event);
}



function addComment() {
  const rating = localStorage.getItem('rating');
  if (localStorage.getItem('status') == "loggedIn") {
    var newCommentTitle = document.getElementById('newCommentTitleArea').value
    var newComment = document.getElementById('newCommentTextArea').value

    if (newCommentTitle != '' && newComment != '' && rating != '') {
      postData('http://localhost:7266/Comments/create-comment', {
            "product":itemId,
            "user":CURRENT_USER,
            "rating":rating,
            "image": base64Img,
            "text":newComment,
            "title": newCommentTitle
    })
    localStorage.setItem('rating', '');
    location.reload();
    clearComment();
    } else {
      window.alert("Enter Details to make the comment");
    }
  } else {
    window.alert("Please login to post your comment.");
    
      
    clearComment();
  }

}

function clearComment() {
  document.getElementById('newCommentTitleArea').value = ''
  document.getElementById('newCommentTextArea').value = ''
  document.getElementById("newCommentImage").value = ''
}

function populateComments(itemComments) {
  const container = get(ITEMS_HTML_CONTAINER);
  itemComments.forEach(comment => {
    container.appendChild(createHtmlItem(comment));
  })
}

function createHtmlItem({ product, user, rating, image, text, title }) {
  const newItem = get(ITEM_HTML_TEMPLATE).cloneNode(true);
  makeVisible(newItem);
  var icon;
  if (rating == 5){
    icon = "😁"
  } else if (rating <5 && rating > 3){
    icon = "😊"
  } else {
    icon = "😡"
  }
  const htmlTitle = newItem.getElementsByTagName("h6")[0];
  htmlTitle.textContent = `${title}, Rating: ${rating}`;
  const htmlUsername = newItem.getElementsByTagName("h4")[0];
  htmlUsername.textContent = `${user} ${icon}`;
  const htmlDesc = newItem.getElementsByTagName("p")[0];
  htmlDesc.textContent = text;
  const htmlImg = newItem.getElementsByTagName("img")[0];

  //htmlImg.style.visibility = "hidden";
  if (image) {
    htmlImg.setAttribute("src", image)
  } else {
    htmlImg.style.visibility = "hidden";
  }
  return newItem;
}

async function checkPurchase(){
  const username = CURRENT_USER;
  const purchase_history = itemId; // Here you add the id of the product that the user is trying to comment in
  const result = await fetch('/user/check-purchase', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      purchase_history,
    })
  }).then((res) => res.json())

  if (result.status === "ok"){
    console.log('Got message ', result.data)
    addComment()
  } else{
    console.log('OOPS!')
    window.alert("Please purchase the product to post your comment.");
  }
}

async function getAllProductComments(){
  const product = itemId; // Id of the product
  const result = await fetch('/Comments/get-product-cmt', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        product,
    })
  }).then((res) => res.json())

  if (result.status === "ok"){
    if(result.data){
      populateComments(result.data)
    }
    //console.log('Got the comment: ', result.data)
  } else{
    console.log('OOPS!')
  }

}

/*
function checkPurchase() {
  flag = 0
  ORDERS.forEach(order => {
    if (order.userId == CURRENT_USER) {
      order.items.forEach(item => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const product = Number(urlParams.get('itemId'))
        if (item.itemId == product) {
          flag = 1
        }
      })
    }
  })
  if (flag == 1) {
    return true;
  } else {
    return false;
  }
}

var loadFile = function(event) {
	var image = document.getElementById('output');
	//image.src = URL.createObjectURL(event.target.files[0]);
  var blobImg = URL.createObjectURL(event.target.files[0])
  console.log(blobImg)
}
*/
