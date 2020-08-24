// require("file-loader?name=[name].[ext]!./index.html");
// var projectName = require("glider-js");
// var CustomSelect = require("vanilla-js-dropdown");
// //import "./scss/slider.scss";
// import throttle from "raf-throttle";

// =====================================
// ==DOCUMENT ONREADY==
// =====================================
//import data from "./categories.json";
//import { getPLPData } from "./getPLPData";
import { getOriginalBtnData, updateBtnsData } from "./addToCartButton";

// const getData = async () => {
//   let jsonData = await getPLPData();
//   return jsonData;
// };
const displayStyle = "grid",
  dummyText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
let categoriesData,
  products,
  respContainerWidth = 996;
// getData().then((value) => {
//   products = value.configuration.eCommerceData.products;
//   console.log(value.configuration.eCommerceData);
// });

// =====================================
// ==END DOCUMENT ONREADY==
// =====================================

const createCatContainer = (el, products, cart) => {
  const items = el.querySelectorAll(".ProductListElementFilter");
  const categoryItemContainer = document.createElement("ul");
  categoryItemContainer.classList.add("ProductListContainer", "grid");
  for (const item of items) {
    const prodEl = item.querySelector(".ProductListElement"),
      prodId = prodEl.getAttribute("data-product-item-id"),
      product = getProductBy("internationalId", prodId, products),
      added = productAdded(product.internationalId, cart),
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
      li = document.createElement("li");
    li.classList.add(display);
    //transform description case
    descriptionEl.innerHTML = capitalize(product.headline);
    //adding progress line
    intensityEl.innerHTML = progress;
    // adding per capsule price
    priceEl.innerHTML = price + "<span>per capsule</span>";
    //adding Add to Cart btn
    getOriginalBtnData(
      item.querySelectorAll(".AddToBagButton"),
      product,
      added
    );
    //creating a li and moving the item inside
    li.appendChild(item);
    categoryItemContainer.appendChild(li);
  }
  return categoryItemContainer;
};

const updateCatContainerWithCart = (el, cart) => {
  const items = el.querySelectorAll(".ProductListElementFilter");
  for (const item of items) {
    updateBtnsData(item.querySelector(".ProductListElement"), cart);
  }
};

const modCategoryTitle = (el, val) => {
  setCategoriesData(val);
  el.outerHTML = getCatTitleHTML(el);
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

const productAdded = (code, added) => {
  for (const prod of added) {
    const id = prod.productId.split("/").pop();
    if (id === code) {
      return prod.quantity;
    } else {
      return 0;
    }
  }
};

// const backgroundOverWidth = (w) => {
//   let bw =
//     w >= respContainerWidth
//       ? respContainerWidth + (w - respContainerWidth) * 0.5 + "px"
//       : (bw = "100%");
//   return bw;
// };

// const resizeOverflowedBackground = (bgs, window_width) => {
//   console.log(bgs, window_width);
//   bgs.style.width = backgroundOverWidth(window_width);
//   return;
//   let w = backgroundOverWidth(window_width);
//   for (let bg of bgs) {
//     bg.style.width = w;
//   }
// };
export {
  setCategoriesData,
  modCategoryTitle,
  createCatContainer,
  updateCatContainerWithCart,
};
