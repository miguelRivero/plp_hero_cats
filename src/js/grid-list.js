// require("file-loader?name=[name].[ext]!./index.html");
// var projectName = require("glider-js");
// var CustomSelect = require("vanilla-js-dropdown");
// //import "./scss/slider.scss";
// import throttle from "raf-throttle";

// =====================================
// ==DOCUMENT ONREADY==
// =====================================
import "regenerator-runtime/runtime";
import data from "./categories.json";
//import { getPLPData } from "./getPLPData";
import { getOriginalBtnData } from "./addToCartButton";

// const getData = async () => {
//   let jsonData = await getPLPData();
//   return jsonData;
// };
const categoriesData = data.categories;

let products,
  respContainerWidth = 996;
// getData().then((value) => {
//   products = value.configuration.eCommerceData.products;
//   console.log(value.configuration.eCommerceData);
// });

// =====================================
// ==END DOCUMENT ONREADY==
// =====================================

const createCatContainer = (el, products) => {
  const items = el.querySelectorAll(".ProductListElementFilter");
  const categoryItemContainer = document.createElement("ul");
  categoryItemContainer.classList.add("ProductListContainer", "grid");
  for (const item of items) {
    console.log(item);
    const prodId = item
      .querySelector(".ProductListElement")
      .getAttribute("data-product-item-id");
    console.log(prodId);
    const product = getProductBy("internationalId", prodId, products);
    console.log(product);
    const nameEl = item.querySelector(".ProductListElement__name a");
    const name = nameEl.textContent || nameEl.innerText;
    //const product = getProduct(name, products);
    //transform description case
    const descriptionEl = item.querySelector(".ProductListElement__headline");
    const description = descriptionEl.textContent || descriptionEl.innerText;
    descriptionEl.innerHTML = capitalize(description);
    //adding progress line
    const intensityEl = item.querySelector(".ProductListElement__intensity");
    const progress = createIntensityEl(product.intensity);
    intensityEl.innerHTML = progress;
    // adding per capsule price
    const priceEl = item.querySelector(".ProductListElement__price");
    const price = priceEl.textContent || priceEl.innerText;
    const priceHTML = price + "<span>per capsule</span>";
    priceEl.innerHTML = priceHTML;
    getOriginalBtnData(item.querySelectorAll(".AddToBagButton"));

    //crating a li and moving the item inside
    const li = document.createElement("li");
    li.appendChild(item);
    categoryItemContainer.appendChild(li);
  }
  return categoryItemContainer;
};

const modCategoryTitle = (el) => {
  el.outerHTML = getCatTitleHTML(el);
};

const getCatTitleHTML = (el) => {
  const catData = getCatData(el.textContent);
  return createCatTitleHTML(catData);
};

const getCatData = (str) => {
  for (const cat of categoriesData) {
    if (cat.title === str) return cat;
  }
};

const createCatTitleHTML = (cat) => {
  return `
  <div class="ProductListGroup__background--overflowed"><div></div><div></div></div>
  <h3 class="ProductListGroup__title">${cat.title}</h3>
  <div class="ProductListGroup__content">
    <div class="ProductListGroup__description">
      <p>${cat.description}</p>
      <a href="">Discover</a>
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

const getProduct = (name, products) => {
  for (let prod of products) {
    if (name === prod.name) {
      return prod;
    }
  }
};

const getProductBy = (attr, name, products) => {
  for (let prod of products) {
    if (name === prod[attr]) {
      return prod;
    }
  }
};

const backgroundOverWidth = (w) => {
  let bw =
    w >= respContainerWidth
      ? respContainerWidth + (w - respContainerWidth) * 0.5 + "px"
      : (bw = "100%");
  return bw;
};

const resizeBackground = (bgs, window_width) => {
  let w = backgroundOverWidth(window_width);
  for (let bg of bgs) {
    bg.style.width = w;
  }
};
export { modCategoryTitle, createCatContainer, resizeBackground };
