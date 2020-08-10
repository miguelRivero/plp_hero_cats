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
import { getPLPData } from "./getPLPData.js";
const categoriesData = data.categories;
const getData = async () => {
  let jsonData = await getPLPData();
  return jsonData;
};

let products;
getData().then((value) => {
  //products = value.configuration.eCommerceData.products;
  console.log(value);
});

// document.onreadystatechange = function () {
//   if (document.readyState == "complete") {
//     const categories = document.querySelectorAll(".ProductListGroup");

//     // Mod to the category title
//     const categoryTitle = document.querySelectorAll(".ProductListGroup__title");
//     [].forEach.call(categoryTitle, modCategoryTitle);

//     // Mod to the category items
//     for (let cat of categories) {
//       cat.appendChild(createCatContainer(cat));
//     }
//   }
// };
// =====================================
// ==END DOCUMENT ONREADY==
// =====================================
const getPLPdata = () => {
  getPLPData().then((data) => console.log(data));
};
const modCategoryTitle = (el) => {
  el.innerHTML = getCatTitleHTML(el);
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

const createCatTitleHTML = (data) => {
  return `
    <div class="ProductListGroup__title__content">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <a href="">Discover</a>
    </div>
    `;
};

const createCatContainer = (el) => {
  const items = el.querySelectorAll(".ProductListElementFilter");
  const categoryItemContainer = document.createElement("ul");
  categoryItemContainer.classList.add("ProductListContainer", "grid");
  for (const item of items) {
    //trnasform description case
    const descriptionEl = item.querySelector(".ProductListElement__headline");
    const description = descriptionEl.textContent || descriptionEl.innerText;
    descriptionEl.innerHTML = capitalize(description);
    //adding progress line
    const progress = createIntensityEl();
    const intensity = item.querySelector(".ProductListElement__intensity");
    intensity.innerHTML = progress;
    // adding per capsule price
    const priceEl = item.querySelector(".ProductListElement__price");
    const price = priceEl.textContent || priceEl.innerText;
    const priceHTML = price + "<span>per capsule</span>";
    priceEl.innerHTML = priceHTML;

    //crating a li and moving the item inside
    const li = document.createElement("li");
    li.appendChild(item);
    categoryItemContainer.appendChild(li);
  }
  return categoryItemContainer;
};

const createIntensityEl = () => {
  const int = 7;
  return `
    <p>INTENSITY <span>${int}</span></p>
    <div class="ProductListElement__progress">
      <div class="ProductListElement__progressBar">
        <span class="ProductListElement__progressBarFill" style="width: ${
          int * 10
        }%;"></span>
      </div>
    </div>
  `;
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export { modCategoryTitle, createCatContainer };
