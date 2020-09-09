import { getOriginalBtnData, updateBtnValues } from "./AddToCartButton";
// const getData = async () => {
//   let jsonData = await getPLPData();
//   return jsonData;
// };
const displayStyle = "list",
  allProducts = document.querySelectorAll(".ProductListElement"),
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
  const categoryItemContainer = document.createElement("ul"),
    display =
      displayStyle === "list"
        ? "list"
        : product.unitQuantity > 1
        ? "list"
        : "grid";
  //grid or list style
  categoryItemContainer.classList.add("ProductListContainer", display);
  for (const item of items) {
    const prodEl = item.querySelector(".ProductListElement"),
      prodId = prodEl.getAttribute("data-product-item-id"),
      product = getProductBy("internationalId", prodId, products),
      added = itemsInBasket(product.internationalId, cart),
      descriptionEl = item.querySelector(".ProductListElement__headline"),
      intensityEl = item.querySelector(".ProductListElement__intensity"),
      progress = createIntensityEl(product.intensity),
      priceElClone = item
        .querySelector(".ProductListElement__price")
        .cloneNode(true),
      price = priceElClone.textContent || priceElClone.innerText,
      detailsEl = document.createElement("div"),
      li = document.createElement("li");
    //transform description case
    descriptionEl.innerHTML = capitalize(product.headline);
    //adding progress line
    intensityEl.innerHTML = progress;
    // adding per capsule price
    priceElClone.innerHTML = price + "<span>per capsule</span>";
    //moving price after intensity
    intensityEl.parentNode.insertBefore(priceElClone, intensityEl.nextSibling);
    //moving element to details container
    detailsEl.classList.add("ProductListElement__details");
    detailsEl.appendChild(prodEl.querySelector(".ProductListElement__name"));

    const contentElClone = prodEl
      .querySelector(".ProductListElement__content")
      .cloneNode(true);
    detailsEl.appendChild(contentElClone);
    detailsEl.appendChild(intensityEl);

    detailsEl.appendChild(priceElClone);
    prodEl.appendChild(detailsEl);
    //adding Add to Cart btn
    const add_btn = getOriginalBtnData(prodEl, product, added);
    //move to lastchild
    prodEl.appendChild(add_btn);
    // add class if is in basket
    if (added) prodEl.classList.add("ProductInBasket");
    //creating a li and moving the item inside
    li.appendChild(item);
    categoryItemContainer.appendChild(li);
  }
  return categoryItemContainer;
};

const updateCatContainerWithCart = (cart) => {
  for (const item of allProducts) {
    if (cart.length) {
      const itemId = item.getAttribute("data-product-item-id"),
        added = itemsInBasket(itemId, cart);
      //added is a number (0 = false)
      if (added) {
        item.classList.add("ProductInBasket");
      } else {
        //item.closest("li").classList.remove("ProductListItem--cartActive");
        item.classList.remove("ProductInBasket");
      }
      updateBtnValues(item, added);
      //console.log(itemId + " ===>");
    } else {
      //item.closest("li").classList.remove("ProductListItem--cartActive");
      updateBtnValues(item, 0);
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

const checkProductIntoView = () => {
  for (const prod of allProducts) {
    let visible = isScrolledIntoView(prod);
    if (!visible & prod.classList.contains("ProductInBasket")) {
      prod.querySelector(".AddToBagButton__stepper").classList.add("incart");
    }
  }
};

const isScrolledIntoView = (el) => {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;
  // Only completely visible elements return true:
  var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  // Partially visible elements return true:
  return isVisible;
};

export {
  setCategoriesData,
  modCategoryTitle,
  createCatContainer,
  updateCatContainerWithCart,
  checkProductIntoView,
};
