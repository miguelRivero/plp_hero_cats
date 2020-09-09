// ==UserScript==
// @name         COFEEE +  CATS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.nespresso.com/br/en/order/capsules/original
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js

// ==/UserScript==

/* global $ */

require("file-loader?name=[name].[ext]!./index.html");
var projectName = require("glider-js");
var CustomSelect = require("vanilla-js-dropdown");
import "regenerator-runtime/runtime";
import "./scss/slider.scss";
import "./scss/gridList.scss";
import "./scss/addToCartButton.scss";
import throttle from "raf-throttle";
import { ellipsis } from "ellipsed";
import { setSelectValues, createTechnologiesDropdown } from "./js/Select.js";
import { getCategories } from "./js/CategoriesData";
import {
  setSlidesElement,
  setSliderContainer,
  getSliderRealWidth,
  sliderRequired,
  getSlidesAverageWidth,
  sliderArrowsNeeded,
} from "./js/HorizontalScroll";
import {
  //setCategoriesData,
  modCategoryTitle,
  createCatContainer,
  updateCatContainerWithCart,
  // resizeOverflowedBackground,
} from "./js/GridList";
//import { updateBtnsData } from "./js/AddToCartButton";
import { getPLPData, getCartData } from "./js/GetAsyncData";

// const getProductsData = async () => {
//   return getPLPData();
// };

// const getBasketData = async () => {
//   return getCartData();
// };

let smallScreen;
// Set/update the viewportWidth value
const isSmallScreen = () => {
  return (window.innerWidth || document.documentElement.clientWidth) < 786;
};

const setIsSmallScreen = () => {
  smallScreen = isSmallScreen();
  if (smallScreen) {
    document.getElementById("main").classList.add("Main--smallScreen");
  } else {
    document.getElementById("main").classList.remove("Main--smallScreen");
  }
};
// =====================================
// ==DOCUMENT ONREADY==
// =====================================
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    // Get existing elements reference
    const products_title = ".ProductList__title",
      productsTitleElement = document.querySelector(products_title),
      product_list_groups = document.querySelectorAll(".ProductListGroup"),
      imagesStorage =
        "https://raw.githubusercontent.com/miguelRivero/plp_hero_cats/master/dist/images/",
      imagePlaceholder = imagesStorage + "placeholder.jpg",
      technologiesElement = document.querySelector(".ProductListTechnologies")
        ? document.querySelector(".ProductListTechnologies")
        : false;

    let stickySliderHeight,
      sliderTopOffset,
      glider,
      last_slider_layout,
      tabs_display_style,
      categories = [],
      smartBanner = document.querySelector(".smartbanner"),
      dynamicBanner = document.querySelector(".dynamic_banner"),
      headerTopWrapper = document.querySelector(".Header__top-wrapper"),
      sliderLayoutEvent = new CustomEvent("slider-sticky-state", {
        detail: { sticky: null },
      });

    //Set viewport width screen class
    setIsSmallScreen();
    //Adding the Slider to the DOM
    const slider = document.createElement("div");
    slider.classList.add("ProductListCategories");
    slider.innerHTML = addProductListNavigationComponent();
    productsTitleElement.parentNode.insertBefore(
      slider,
      productsTitleElement.nextSibling
    );
    const btnContainer = document.querySelector(".ProductListCategoriesSlider");
    const btns = btnContainer.querySelectorAll(
      ".ProductListCategoriesSlider__item"
    );

    // ==============================
    // ==SLIDER COMPONENT==
    // ==============================

    // Initialize Glider slider with options
    const createGlider = (w) => {
      glider = new Glider(btnContainer, {
        exactWidth: true,
        draggable: true,
        slidesToScroll: "auto",
        itemWidth: w ? w : 200,
        slidesToShow: "auto",
        skipTrack: true,
        duration: 3,
        arrows: {
          prev: ".glider-prev",
          next: ".glider-next",
        },
      });
    };

    //Creating the slider markup
    function addProductListNavigationComponent() {
      categories = getCategories(product_list_groups, imagesStorage);
      return `
    <div class="ProductListNavigation">
      <div class="ProductListTechnologiesDropdown"></div>
      <div class="ProductListCategoriesSlider__container">
        <button aria-label="Previous" class="ProductListCategoriesSlider__arrow ProductListCategoriesSlider__arrow--left glider-prev"><span></span></button>
        <ul class="ProductListCategoriesSlider glider">
          <div class="glider-track">
            ${categories
              .map(
                (category, index) => `
            <li class="${
              index === 0
                ? "ProductListCategoriesSlider__item"
                : "ProductListCategoriesSlider__item"
            }" data-link="${category.id}" data-index="${index}">
              <a href="#${category.id}">
                <div class="ProductListCategoriesSlider__item__button">
                  <img class="ProductListCategoriesSlider__item__image" src="${
                    category.image
                  }" onerror="this.src='${imagePlaceholder}'" alt="${
                  category.label
                }">
                  <div class="ProductListCategoriesSlider__item__title multiline">
                  ${category.labelAsArray
                    .map(
                      (label, i) => `
                    <p>${label}</p>
                  `
                    )
                    .join("")}
                  </div>
                  <div class="ProductListCategoriesSlider__item__title singleline">
                      <p title="${category.label}">${category.label}</p>
                  </div>
                </div>
              </a>
            </li>
            `
              )
              .join("")}
          </div>
        </ul>
        <button aria-label="Next" class="ProductListCategoriesSlider__arrow ProductListCategoriesSlider__arrow--right glider-next"><span></span></button>
      </div>
    </div>
    `;
    }

    // ==============================
    // ==END SLIDER COMPONENT========
    // ==============================

    // ===================================
    // ==VERTICAL SCROLL FUNCTIONALITY==
    // ==For sticky functionality==
    // ===================================

    const getElementTopOffset = (element) => {
      if (typeof element != "undefined" && element != null) {
        let rect = element.getBoundingClientRect();
        return rect.top + rect.height;
      } else {
        return 0;
      }
    };

    const getSliderTopOffset = () => {
      //Check if these elements exist in DOM  and define them for future use
      smartBanner = smartBanner
        ? smartBanner
        : document.querySelector(".smartbanner");
      dynamicBanner = dynamicBanner
        ? dynamicBanner
        : document.querySelector(".dynamic_banner");
      headerTopWrapper = headerTopWrapper
        ? headerTopWrapper
        : document.querySelector(".Header__top-wrapper");

      const filtered_args = [
          smartBanner,
          dynamicBanner,
          headerTopWrapper,
        ].filter(function (el) {
          return el != null;
        }),
        offset_array = [];
      for (const el of filtered_args) {
        if (el !== null) offset_array.push(getElementTopOffset(el));
      }
      return Math.max(...offset_array);
    };

    const getScrollTop = () => {
      return (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    };

    const toggleStickySlider = () => {
      if (
        getScrollTop() > 0 &&
        sliderTopOffset >= btnContainer.getBoundingClientRect().y
      ) {
        slider.classList.add("sticky");
        slider.style.top = sliderTopOffset + "px";
        sliderLayoutEvent.detail.sticky = "sticky";
      } else {
        slider.classList.remove("sticky");
        slider.style.top = 0;
        sliderLayoutEvent.detail.sticky = "normal";
      }

      slider.dispatchEvent(sliderLayoutEvent);
      stickySliderHeight = btnContainer.getBoundingClientRect().height;
    };

    // ===================================
    // ==END VERTICAL SCROLL FUNCTIONALITY==
    // ==For sticky functionality==
    // ===================================

    // =====================================
    // ==HORIZONTAL SCROLL FUNCTIONALITY==
    // ==Glider component use and override==
    // =====================================
    const slidesTrackElement = document.querySelector(".glider-track");
    setSlidesElement(slidesTrackElement);
    setSliderContainer(
      document.querySelector(".ProductListCategoriesSlider__container")
    );
    const updateGlider = (layoutEvent) => {
      //Custom glider methods
      const _realwidth = getSliderRealWidth(layoutEvent);
      slidesTrackElement.style.width = _realwidth + "px";
      sliderRequired(sliderArrowsNeeded(_realwidth));
      //Native Glider methods
      let options = { itemWidth: getSlidesAverageWidth() };
      glider.setOption(options);
      glider.refresh(true);
      //Styling the arrows and gradient
      let heightSlider = document
        .querySelector(".ProductListCategoriesSlider ")
        .getBoundingClientRect().height;
      let arrows = document.querySelectorAll(
        ".ProductListCategoriesSlider__arrow "
      );
      for (let arrow of arrows) {
        arrow.style.height = heightSlider + "px";
      }

      if (layoutEvent.detail.sticky !== "sticky") {
        slider.style.top = 0;
      } else {
        sliderTopOffset = getSliderTopOffset();
        slider.style.top = sliderTopOffset + "px";
      }
    };
    // =====================================
    // ==END HORIZONTAL SCROLL FUNCTIONALITY==
    // ==Glider component use and override==
    // =====================================

    // =====================================
    // ==SETTIMEOUT FUNCTIONALITY==
    // ==To prevent errors if elements are==
    // ==rendered dynamically==
    // =====================================

    setTimeout(function () {
      createGlider();
      //Technologies dropdown visibility
      if (
        !technologiesElement ||
        !window.matchMedia("(min-width: 768px)").matches
      ) {
        // hide dropdown container
        document
          .querySelector(".ProductListTechnologiesDropdown")
          .classList.add("hidden");
        slider.classList.remove("ProductListCategories--dropdown");
      } else {
        // show dropdown and listen to sticky state to hide/show technologies tabs
        setSelectValues(
          document.querySelectorAll(".ProductListTechnologies__link")
        );
        createTechnologiesDropdown();
        const select = new CustomSelect({
          elem: "ProductListTechnologiesDropdown__select",
        });
        slider.classList.add("ProductListCategories--dropdown");
        if (technologiesElement.currentStyle) {
          tabs_display_style = technologiesElement.currentStyle.display;
        } else if (window.getComputedStyle) {
          tabs_display_style = window
            .getComputedStyle(technologiesElement, null)
            .getPropertyValue("display");
        } else {
          tabs_display_style = "block";
        }
      }

      slider.addEventListener("slider-sticky-state", function (event) {
        if (event.detail.sticky !== last_slider_layout) {
          updateGlider(sliderLayoutEvent);
          sliderTopOffset = getSliderTopOffset();
          //check first change to correct anchor scroll
          last_slider_layout = event.detail.sticky;
        }

        if (technologiesElement) {
          if (event.detail.sticky === "sticky") {
            technologiesElement.style.display = "none";
          } else {
            technologiesElement.style.display = tabs_display_style;
          }
        }
      });

      sliderTopOffset = getSliderTopOffset();
      window.addEventListener("scroll", throttle(scrollListener));
      scrollToWithOffset();
      updateGlider(sliderLayoutEvent);
      highlightSliderBtn();
    }, 0);

    // =====================================
    // ==END SETTIMEOUT FUNCTIONALITY==
    // =====================================

    // ==================================================
    // ==VERTICAL SCROLL ACTIVATING SLIDER BUTTONS=======
    // ==Detecting vertical scroll treshold and trigger==
    // ==================================================
    const highlightSliderBtn = () => {
      for (let cat of categories) {
        if (location.hash === "#" + cat.id) {
          setBtnActive(cat.id);
        }
      }
    };

    const scrollListener = () => {
      toggleStickySlider();
      checkSectionsAreIntoView();
    };

    const getSafetyOffset = () => {
      return (
        Math.ceil(
          stickySliderHeight
            ? stickySliderHeight + sliderTopOffset
            : 56 + sliderTopOffset
        ) + 100
      );
    };

    const checkSectionsAreIntoView = () => {
      var fromTop = Math.ceil(getScrollTop() + getSafetyOffset());
      let cur = [];
      // Get id of current scroll item
      for (let target of product_list_groups) {
        if (target.offsetTop <= fromTop) {
          cur.push($(target));
        }
      }
      cur = cur[cur.length - 1];
      var id = cur && cur.length ? cur[0].id : "";
      setBtnActive(id);
    };

    const setBtnActive = (id) => {
      btns.forEach((btn, i) => {
        btn.classList.remove("custom-active");
        const link = btn.getAttribute("data-link");
        if (id === link) {
          btn.classList.add("custom-active");
          glider.scrollItem(i > 0 ? i - 1 : 0);
          updateURL(link);
        }
      });
    };

    const updateURL = (link) => {
      if (history.pushState) {
        history.pushState(null, null, "#" + link);
      } else {
        location.hash = "#" + link;
      }
    };

    const scrollToWithOffset = () => {
      slider.addEventListener(
        "click",
        function (e) {
          if (!e.target.closest(".ProductListCategoriesSlider__item")) {
            return;
          } else {
            e.stopPropagation();
            const link = e.target
              .closest(".ProductListCategoriesSlider__item")
              .getAttribute("data-link");
            window.removeEventListener("scroll", throttle(scrollListener));
            let safety_top_offset = getSafetyOffset(),
              offsetTop = Math.ceil(document.getElementById(link).offsetTop);
            if (last_slider_layout !== "sticky") {
              window.scrollTo(
                window.scrollX,
                offsetTop - safety_top_offset - 145
              );
              window.setTimeout(function () {
                // Because the Header changes when scrolling, we don't know the
                // real dimensions it will have when the slider gets sticky.
                // Thats why we have to recalculate it and apply the position with right
                // measures afterwards
                toggleStickySlider();
                offsetTop = Math.ceil(document.getElementById(link).offsetTop);
                safety_top_offset = getSafetyOffset();
                scrollAnimated(offsetTop - safety_top_offset);
              }, 50);
            } else {
              scrollAnimated(offsetTop - safety_top_offset);
            }
            setBtnActive(link);
          }
        },
        true
      );
    };

    const scrollAnimated = (y) => {
      // To avoid duplicate firing (html and body) we use the boolean var
      let gotDone = false;
      $("html, body").animate({ scrollTop: y }, 500, function () {
        if (!gotDone) {
          gotDone = true;
          window.setTimeout(function () {
            window.addEventListener("scroll", throttle(scrollListener));
          }, 10);
        }
      });
    };

    // ==================================================
    // ==END VERTICAL SCROLL ACTIVATING SLIDER BUTTONS===
    // ==Detecting vertical scroll treshold and trigger==
    // ==================================================

    // ==================================================
    // == TITLE / TABS LAYOUT ORDER =====================
    // ==================================================
    checkTitleTabsPosition();
    function checkTitleTabsPosition() {
      // If there a title and tabs, and title is after tabs, swap positions
      if (technologiesElement && productsTitleElement) {
        const parent = document.querySelector(".ProductList__content");
        let index = 0;
        for (var child in parent.childNodes) {
          if (parent.childNodes[child].nodeType == 1) {
            parent.childNodes[child].index = index;
            index++;
          }
        }

        if (technologiesElement.index < productsTitleElement.index) {
          productsTitleElement.parentNode.insertBefore(
            productsTitleElement,
            technologiesElement
          );
        }
      }
    }
    // ==================================================
    // ==END TITLE / TABS LAYOUT ORDER ==================
    // ==================================================

    // ==========================================================
    // ================ SECOND PHASE ============================
    // ==========================================================

    // ==================================================
    // == GRID / LIST LAYOUT ============================
    // ==================================================

    // Mod to the category items
    const runGridListTest = async () => {
      try {
        const value = await getPLPData();
        const cart = await getCartData();
        document.getElementById("main").classList.add("GridListViewReady");
        let products = value.configuration.eCommerceData.products,
          firstPageLoad;
        for (let cat of product_list_groups) {
          //Create container for Category title, description and grid/list
          const productGridContainer = document.createElement("div");
          productGridContainer.classList.add("ProductListGroupContainer");
          // Mod to the category title
          const title = cat.querySelector(".ProductListGroup__title");
          title.outerHTML = modCategoryTitle(title, value);

          //Look for created grid/list content and append content
          const items = cat.querySelectorAll(".ProductListElementFilter");
          const catContainer = createCatContainer(cat, items, products, cart);
          cat
            .querySelector(".ProductListGroup__content")
            .appendChild(catContainer);

          //Append background, category title and gris/list content
          productGridContainer.appendChild(
            cat.querySelector(".ProductListGroup__background--overflowed")
          );
          productGridContainer.appendChild(title);
          productGridContainer.appendChild(
            cat.querySelector(".ProductListGroup__content")
          );
          //Append transformed markup to category
          cat.appendChild(productGridContainer);
        }

        //update from cart
        window.napi.data().on("cart.update", async function (event) {
          console.log("EVENT cart.update");
          const cart = await getCartData();
          updateCatContainerWithCart(cart, firstPageLoad);
          firstPageLoad = false;
        });
      } catch (error) {
        console.log(error);
      }
    };

    runGridListTest();
    ellipsis(".ProductListElement__headline", 2, { responsive: true });
    ellipsis(".ProductListElement__details .ProductListElement__name a", 1, {
      responsive: true,
    });

    // // ==================================================
    // == END GRID / LIST LAYOUT ========================
    // ==================================================

    window.onresize = function (event) {
      setIsSmallScreen();
      updateGlider(sliderLayoutEvent);
    };
  }
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// =====================================
// ==END DOCUMENT ONREADY==
// =====================================
export { smallScreen };
