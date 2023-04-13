let data;
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

  generateBasketElements();
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage[localStorage.key(i)] == 0) {
      delete localStorage[localStorage.key(i)];
    }
  }
}

main();

const generateBasketElements = () => {
  const tableBody = document.querySelector(".table-body");
  for (let i = 0; i < localStorage.length; i++) {
    if (!isNaN(localStorage.key(i)) && localStorage[localStorage.key(i)] != 0) {
      const curElement = createBasketElement(
        getProductById(localStorage.key(i))
      );
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
  plusButton.addEventListener("click", () => {
    changeAmountForId(product.id, "+");
  });
  itemAmount.appendChild(plusButton);

  const itemCount = document.createElement("input");
  itemCount.classList.add("item-count");
  itemCount.setAttribute("type", "number");
  itemCount.setAttribute("maxlength", "3");
  itemCount.setAttribute("min", "0");
  itemCount.setAttribute("max", "999");
  itemCount.value = localStorage[product.id];
  itemCount.addEventListener("focusout", () => {
    onUnfocusBox(product.id);
  });
  itemAmount.appendChild(itemCount);

  const minusButton = document.createElement("button");
  minusButton.classList.add("minus-amount");
  minusButton.textContent = "-";
  minusButton.addEventListener("click", () => {
    changeAmountForId(product.id, "-");
  });
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

const changeAmountForId = (id, operation) => {
  if (operation == "-" && localStorage[id] > 0) {
    localStorage[id]--;
  }
  if (operation == "+") {
    localStorage[id]++;
  }
  updateBasketCounter(id);
};

const updateBasketCounter = (id) => {
  const element = document.getElementById(id);

  const field = element.querySelector(".item-count");
  field.value = localStorage[id];
};

const onUnfocusBox = (id) => {
  const itemBox = document.getElementById(id);
  const field = itemBox.querySelector(".item-count");
  if (field.value <= 0) {
    field.value = 0;
  }
  field.value = parseInt(field.value);
  localStorage[id] = parseInt(field.value);
};
