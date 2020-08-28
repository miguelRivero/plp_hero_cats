import { getOriginalBtnData, updateBtnsData } from "./AddToCartButton";

// const getData = async () => {
//   let jsonData = await getPLPData();
//   return jsonData;
// };
const displayStyle = "list",
  dummyText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
let categoriesData;
// getData().then((value) => {
//   products = value.configuration.eCommerceData.products;
//   console.log(value.configuration.eCommerceData);
// });

const modCategoryTitle = (el, val) => {
  setCategoriesData(val);
  return getCatTitleHTML(el);
  // getCatTitleHTML(el);
};

const createCatContainer = (el, items, products, cart) => {
  const categoryItemContainer = document.createElement("ul");
  categoryItemContainer.classList.add("ProductListContainer");
  for (const item of items) {
    const prodEl = item.querySelector(".ProductListElement"),
      prodId = prodEl.getAttribute("data-product-item-id"),
      product = getProductBy("internationalId", prodId, products),
      added = itemsInBasket(product.internationalId, cart),
      display =
        displayStyle === "list"
          ? "list"
          : product.unitQuantity > 1
          ? "list"
          : "grid",
      descriptionEl = item.querySelector(".ProductListElement__headline"),
      intensityEl = item.querySelector(".ProductListElement__intensity"),
      progress = createIntensityEl(product.intensity),
      priceEl = item.querySelector(".ProductListElement__price"),
      price = priceEl.textContent || priceEl.innerText,
      detailsEl = document.createElement("div"),
      li = document.createElement("li");
    //grid or list style
    li.classList.add(display);
    //transform description case
    descriptionEl.innerHTML = capitalize(product.headline);
    //adding progress line
    intensityEl.innerHTML = progress;
    // adding per capsule price
    priceEl.innerHTML = price + "<span>per capsule</span>";
    //moving price after intensity
    intensityEl.parentNode.insertBefore(priceEl, intensityEl.nextSibling);
    //moving element to details container
    detailsEl.classList.add("ProductListElement__details");
    detailsEl.appendChild(prodEl.querySelector(".ProductListElement__name"));
    detailsEl.appendChild(prodEl.querySelector(".ProductListElement__content"));
    detailsEl.appendChild(intensityEl);
    detailsEl.appendChild(priceEl);
    prodEl.appendChild(detailsEl);
    //adding Add to Cart btn
    const add_btn = getOriginalBtnData(prodEl, product, added);
    prodEl.appendChild(add_btn);
    // add class if is in basket
    if (added) prodEl.classList.add("ProductInBasket");
    //creating a li and moving the item inside
    li.appendChild(item);
    categoryItemContainer.appendChild(li);
  }
  return categoryItemContainer;
};

const updateCatContainerWithCart = (cart, first) => {
  const items = document.querySelectorAll(".ProductListElement");
  for (const item of items) {
    if (cart.length) {
      const itemId = item.getAttribute("data-product-item-id"),
        added = itemsInBasket(itemId, cart);
      if (added) {
        item.classList.add("ProductInBasket");
      } else {
        item.classList.remove("ProductInBasket");
      }
      updateBtnsData(item, itemId, cart, first);
    } else {
      updateBtnsData(item, null, null, first);
    }
  }
};

const setCategoriesData = (data) => {
  categoriesData = getCategoriesData(data);
};

const getCategoriesData = (val) => {
  const completeCats = val.configuration.eCommerceData.categories;
  const usedCats = val.configuration.eCommerceData.productGroups;

  return completeCats.filter(function (c1) {
    return usedCats.some(function (c2) {
      return c1.id === c2.categoryId;
    });
  });
};

const getCatTitleHTML = (el) => {
  const catData = getCatData(el.textContent);
  return createCatTitleHTML(catData);
};

const getCatData = (str) => {
  for (const cat of categoriesData) {
    if (cat.name === str) return cat;
  }
};

const createCatTitleHTML = (cat) => {
  return `
  <div class="ProductListGroup__background--overflowed"><div></div><div></div></div>
  <h3 class="ProductListGroup__title">${cat.title}</h3>
  <div class="ProductListGroup__content">
    <div class="ProductListGroup__description">
      <p>${cat.description || dummyText}</p>
      <!-- <a href="">Discover</a> -->
    </div>
  </div>
    `;
};

const createIntensityEl = (int) => {
  return `
    <p><span>INTENSITY</span>&nbsp;<span class="ProductListElement__intensenumber">${int}</span></p>
    <div class="ProductListElement__progress">
      <div class="ProductListElement__progressBar">
        <span class="ProductListElement__progressBarFill" style="width: ${
          (int * 100) / 13
        }%;"></span>
      </div>
    </div>
  `;
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const getProductBy = (attr, name, products) => {
  for (let prod of products) {
    if (name === prod[attr]) {
      return prod;
    }
  }
};

const itemsInBasket = (code, added) => {
  let data = added.find(function (ele) {
    return ele.productId.split("/").pop() === code;
  });
  if (data) {
    return data.quantity;
  } else {
    return 0;
  }
};
export {
  setCategoriesData,
  modCategoryTitle,
  createCatContainer,
  updateCatContainerWithCart,
};
