let data;
let oldCategory = "";
async function fetchData() {
  try {
    const response = await fetch("./code/data.json");
    data = await response.json();
    console.log("Data loaded: ");
  } catch (err) {
    console.log(err);
  }
}

async function main() {
  const dataFetch = await fetchData();

  data.categories[0].products.forEach((element) => {
    createCard(element);
  });
  data.categories.forEach((element) => {
    createCategory(element.name);
  });
  updateCategory({ target: { id: data.categories[0].name } });
  updateBasketCounter();
  for (let i = localStorage.length - 1; i > -1; i--) {
    if (localStorage[localStorage.key(i)] == 0) {
      delete localStorage[localStorage.key(i)];
    }
  }
}

main();

const updateCategory = (e) => {
  if (oldCategory != "") {
    const temp = document.getElementById(oldCategory);
    temp.style.backgroundColor = "unset";
  }

  oldCategory = e.target.id;
  const curCat = document.getElementById(e.target.id);
  curCat.style.backgroundColor = "#d1d1d1";

  const categoryHead = document.querySelector(".category");
  const newCategoryHead = document.createElement("h1");
  newCategoryHead.textContent = e.target.id;
  if (categoryHead.lastChild) {
    categoryHead.removeChild(categoryHead.lastChild);
  }

  categoryHead.append(newCategoryHead);

  let newCategory = e.target.id;
  for (let i = 0; i < data.categories.length; i++) {
    let cur = data.categories[i].name;
    if (cur == newCategory) {
      flushCards();
      data.categories[i].products.forEach((element) => {
        createCard(element);
      });
      break;
    }
  }
};
const createCard = (product) => {
  const itemCard = document.createElement("div");
  itemCard.classList.add("item-card");
  itemCard.id = product.id;

  const cardImgContainer = document.createElement("div");
  cardImgContainer.classList.add("card-img-container");

  const itemImage = document.createElement("img");
  itemImage.classList.add("item-image");
  itemImage.src = "/images/item-images/" + product.image;

  const generalBasket = document.createElement("img");
  generalBasket.classList.add("general-basket");
  generalBasket.src = "images/shopping-basket.png";
  generalBasket.addEventListener("click", () => {
    incrementCounter(product.id);
  });

  cardImgContainer.appendChild(itemImage);
  if (localStorage[product.id] && localStorage[product.id] > 0) {
    const generalCounter = document.createElement("div");
    generalCounter.classList.add("general-counter");
    generalCounter.textContent = localStorage[product.id];
    cardImgContainer.appendChild(generalCounter);
  }
  cardImgContainer.appendChild(generalBasket);

  const cardTitle = document.createElement("div");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = product.name;

  itemCard.appendChild(cardImgContainer);
  itemCard.appendChild(cardTitle);

  const cardsContainer = document.querySelector(".cards");

  cardsContainer.appendChild(itemCard);
};

const createCategory = (title) => {
  const navElement = document.createElement("div");
  navElement.classList.add("nav-element");
  navElement.textContent = title;
  navElement.id = title;
  navElement.onclick = updateCategory;

  const navigation = document.querySelector(".navigation");
  navigation.appendChild(navElement);
};

const flushCards = () => {
  const cards = document.querySelector(".cards");
  while (cards.firstChild) {
    cards.removeChild(cards.lastChild);
  }
};

const incrementCounter = (id) => {
  if (localStorage[id]) {
    localStorage[id]++;
  } else {
    localStorage[id] = 1;
  }

  const myItemCard = document.getElementById(id);
  const myCounter = myItemCard.querySelector(
    ".card-img-container .general-counter"
  );
  if (myCounter) {
    myCounter.textContent = localStorage[id];
  } else {
    const generalCounter = document.createElement("div");
    generalCounter.classList.add("general-counter");
    generalCounter.textContent = localStorage[id];
    myItemCard.querySelector(".card-img-container").appendChild(generalCounter);
  }

  if (localStorage[id] == 0) {
    myItemCard.removeChild(
      myItemCard.querySelector(".card-img-container .general-counter")
    );
  }
  updateBasketCounter();
};

const updateBasketCounter = () => {
  const basketCounter = document.querySelector(".basket > .basket-counter");
  let suma = 0;

  for (let i = 0; i < localStorage.length; i++) {
    if (!isNaN(localStorage.key(i))) {
      suma += parseInt(localStorage[localStorage.key(i)]);
    }
  }

  if (suma > 0 && !basketCounter) {
    const newCounter = document.createElement("div");
    newCounter.classList.add("basket-counter");
    newCounter.textContent = suma;
    document.querySelector(".basket-box").appendChild(newCounter);
  } else if (suma <= 0 && basketCounter) {
    document.querySelector(".basket-box").removeChild(basketCounter);
  } else if (suma > 0) {
    basketCounter.textContent = suma;
  }
};

const generateBasketElements = () => {
  const tableBody = document.querySelector(".table-body");
  for (let i = 0; i < localStorage.length; i++) {
    if (!isNaN(localStorage.key(i))) {
      let curElement = createBasketElement(getProductById(localStorage.key(i)));
      tableBody.appendChild(curElement);
    }
  }
};

const createBasketElement = (product) => {
  const tableItem = document.createElement("div");
  tableItem.classList.add("table-item");
  tableItem.id = product.id;

  const itemLabel = document.createElement("div");
  itemLabel.classList.add("item-label");
  itemLabel.textContent = product.name;
  tableItem.appendChild(itemLabel);

  const itemAmount = document.createElement("div");
  itemAmount.classList.add("item-amount");

  const plusButton = document.createElement("button");
  plusButton.classList.add("plus-amount");
  plusButton.textContent = "+";
  itemAmount.appendChild(plusButton);

  const itemCount = document.createElement("input");
  itemCount.classList.add("item-count");
  itemCount.setAttribute("type", "number");
  itemCount.setAttribute("maxlength", "3");
  itemCount.setAttribute("min", "0");
  itemCount.setAttribute("max", "999");
  itemCount.value = localStorage[product.id];
  itemAmount.appendChild(itemCount);

  const minusButton = document.createElement("button");
  minusButton.classList.add("minus-amount");
  minusButton.textContent = "-";
  itemAmount.appendChild(minusButton);

  tableItem.appendChild(itemAmount);

  return tableItem;
};

const getProductById = (id) => {
  for (let i = 0; i < data.categories.length; i++) {
    for (let j = 0; j < data.categories[i].products.length; j++) {
      if (data.categories[i].products[j].id == id) {
        return data.categories[i].products[j];
      }
    }
  }
};
