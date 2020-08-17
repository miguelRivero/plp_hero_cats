// ==UserScript==
// @name         COFEEE +  CATS UK
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
import "./scss/slider.scss";
import throttle from "raf-throttle";
import { createTechnologiesDropdown } from "./js/select.js";
// =====================================
// ==DOCUMENT ONREADY==
// =====================================
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    // Get existing elements reference
    const products_title = ".ProductList__title",
      slideMargin = 12,
      productsTitleElement = document.querySelector(products_title),
      product_list_groups = document.querySelectorAll(".ProductListGroup"),
      header_top = document.querySelector(".Header__top-wrapper"),
      imagesStorage =
        "https://raw.githubusercontent.com/miguelRivero/plp_hero_cats/master/dist/images/",
      imagePlaceholder = imagesStorage + "placeholder.jpg",
      smart_banner = document.querySelector(".smartbanner"),
      dynamic_banner = document.querySelector(".dynamic_banner"),
      technologiesElement = document.querySelector(".ProductListTechnologies")
        ? document.querySelector(".ProductListTechnologies")
        : false;

    let stickySliderHeight,
      sliderTopOffset,
      glider,
      last_slider_layout,
      tabs_display_style,
      categories = [],
      tick = false,
      //bodyLastTopRect = document.body.getBoundingClientRect().top,
      sliderLayoutEvent = new CustomEvent("slider-sticky-state", {
        detail: { sticky: null },
      });

    //Adding the Slider to the DOM
    const slider = document.createElement("div");
    slider.classList.add("ProductListCategories");
    slider.innerHTML = addProductListNavigationComponent();
    insertAfter(slider, productsTitleElement);

    const btnContainer = document.querySelector(".ProductListCategoriesSlider");
    const btns = btnContainer.querySelectorAll(
      ".ProductListCategoriesSlider__item"
    );

    const sliderContainer = document.querySelector(
      ".ProductListCategoriesSlider__container"
    );

    // ==============================
    // ==SLIDER COMPONENT==
    // ==============================

    // Initialize Glider slider with options
    function createGlider(w) {
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
    }

    //Getting categories data and parsing it
    function capitalize(str1) {
      return str1.charAt(0).toUpperCase() + str1.slice(1);
    }
    function shortestStringReduce(arr) {
      return arr.reduce((a, b) => (a.length < b.length ? a : b));
    }
    function parseTitleAsArray(arr) {
      for (let [index, str] of arr.entries()) {
        if (str === "&" || str === "to" || str === "and" || str === "of") {
          let shorter = shortestStringReduce([arr[index - 1], arr[index + 1]]);
          if (shorter === arr[index - 1]) {
            arr[index - 1] = arr[index - 1] + " " + str;
          } else {
            arr[index + 1] = str + " " + arr[index + 1];
          }
          arr.splice(index, 1);
        } else {
          capitalize(str);
        }
      }
      return arr;
    }

    function getCategories() {
      let result = [];
      if (product_list_groups.length) {
        product_list_groups.forEach((productGroup) => {
          const title = productGroup
            .querySelector("h3")
            .textContent.replace(" Capsules", "")
            .replace(" capsules", "")
            .trim();
          const text_id = title.toLowerCase().split(" ").join("-");
          const id = "ab-" + text_id;
          const titleAsArray = parseTitleAsArray(title.split(" "));
          productGroup.id = id;
          result.push({
            label: title,
            labelAsArray: titleAsArray,
            image: imagesStorage + text_id + ".jpg",
            id: id,
          });
        });
      }
      return result;
    }

    //Creating the slider markup
    function addProductListNavigationComponent() {
      categories = getCategories();
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

    function insertAfter(el, referenceNode) {
      referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }
    // ==============================
    // ==SLIDER COMPONENT==
    // ==============================

    // ===================================
    // ==VERTICAL SCROLL FUNCTIONALITY==
    // ==For sticky functionality==
    // ===================================

    function getTopOffset(element) {
      if (typeof element != "undefined" && element != null) {
        let rect = element.getBoundingClientRect();
        return rect.top + rect.height;
      } else {
        return 0;
      }
    }

    function getSliderTopOffset() {
      const filtered_args = [header_top, dynamic_banner, smart_banner].filter(
          function (el) {
            return el != null;
          }
        ),
        offset_array = [];
      for (const el of filtered_args) {
        if (el !== null) offset_array.push(getTopOffset(el));
      }
      return Math.max(...offset_array);
      //return getTopOffset(el2) ? getTopOffset(el2) : getTopOffset(el1);
    }

    function getScrollTop() {
      return (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    }

    function toggleStickySlider() {
      if (
        getScrollTop() > 0 &&
        sliderTopOffset >= btnContainer.getBoundingClientRect().y
      ) {
        slider.classList.add("sticky");
        slider.style.top = sliderTopOffset + "px";
        // bodyLastTopRect = document.body.getBoundingClientRect().top;
        sliderLayoutEvent.detail.sticky = "sticky";
      } else {
        slider.classList.remove("sticky");
        slider.style.top = 0;
        sliderLayoutEvent.detail.sticky = "normal";
      }
      // console.log("toggleStickySlider");
      // console.log("getScrollTop() = " + getScrollTop());
      // console.log("sliderTopOffset = " + sliderTopOffset);
      // console.log(
      //   "btnContainer.getBoundingClientRect().y = " +
      //     btnContainer.getBoundingClientRect().y
      // );
      slider.dispatchEvent(sliderLayoutEvent);
      stickySliderHeight = btnContainer.getBoundingClientRect().height;
    }

    // ===================================
    // ==END VERTICAL SCROLL FUNCTIONALITY==
    // ==For sticky functionality==
    // ===================================

    // =====================================
    // ==HORIZONTAL SCROLL FUNCTIONALITY==
    // ==Glider component use and override==
    // =====================================
    const slidesTrackElement = document.querySelector(".glider-track");
    const slidesElements = slidesTrackElement.children;

    function getEachSlideWidth() {
      let _widths = [];
      for (let i = 0; i < slidesElements.length; i++) {
        _widths.push(slidesElements[i].offsetWidth);
      }
      return _widths;
    }

    function getSlidesAverageWidth() {
      return (
        Math.ceil(
          getEachSlideWidth().reduce((a, b) => a + b, 0) / slidesElements.length
        ) + slideMargin
      );
    }

    function getSlidesTotalWidth() {
      return getEachSlideWidth().reduce((a, b) => a + b, 0);
    }

    function getSliderRealWidth() {
      let _w = getSlidesTotalWidth();
      if (sliderLayoutEvent.detail.sticky === "sticky") {
        return _w + 40;
      } else if (
        sliderLayoutEvent.detail.sticky !== "sticky" &&
        sliderArrowsNeeded(_w)
      ) {
        return _w + 20;
      } else {
        return _w;
      }
    }

    // function disableSliderArrowRight(disable) {
    //   const arrow_right = sliderContainer.querySelector(
    //     ".ProductListCategoriesSlider__arrow--right"
    //   );

    //   if (
    //     btns[btns.length - 1].getBoundingClientRect().left <
    //     sliderContainer.getBoundingClientRect().width
    //   ) {
    //     arrow_right.classList.add("custom-disabled");
    //   } else {
    //     arrow_right.classList.remove("custom-disabled");
    //   }
    // }

    function sliderArrowsNeeded(w) {
      if (w >= sliderContainer.getBoundingClientRect().width) {
        return true;
      } else {
        return false;
      }
    }

    function sliderRequired(bool) {
      if (bool) {
        sliderContainer.classList.remove("no-slider");
      } else {
        sliderContainer.classList.add("no-slider");
      }
    }

    function updateGlider() {
      //Custom glider methods
      const _realwidth = getSliderRealWidth();
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

      if (sliderLayoutEvent.detail.sticky !== "sticky") {
        slider.style.top = 0;
      } else {
        sliderTopOffset = getSliderTopOffset();
        slider.style.top = sliderTopOffset + "px";
      }
    }
    // function slideControlsEnabled() {
    //   return btnContainer.scrollWidth > btnContainer.clientWidth;
    // }

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
        createTechnologiesDropdown();
        const select = new CustomSelect({
          elem: "ProductListTechnologiesDropdown__select",
        });
        slider.classList.add("ProductListCategories--dropdown");
        // let tabs_display_style;
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
          updateGlider();
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

      // =====================================
      // ==END SETTIMEOUT FUNCTIONALITY==
      // =====================================

      // ==================================================
      // ==VERTICAL SCROLL ACTIVATING SLIDER BUTTONS=======
      // ==Detecting vertical scroll treshold and trigger==
      // ==================================================
      sliderTopOffset = getSliderTopOffset();
      //window.addEventListener("scroll", scrollRAF);
      window.addEventListener("scroll", throttle(scrollListener));
      scrollToWithOffset();
      updateGlider();
      highlightSliderBtn();
    }, 0);

    function highlightSliderBtn() {
      for (let cat of categories) {
        if (location.hash === "#" + cat.id) {
          setBtnActive(cat.id);
        }
      }
    }

    function scrollListener() {
      toggleStickySlider();
      checkSectionsAreIntoView();
    }

    // function scrollRAF() {
    //   if (!tick) {
    //     window.requestAnimationFrame(function () {
    //       scrollListener();
    //       tick = false;
    //     });
    //     tick = true;
    //   }
    // }

    function getSafetyOffset() {
      return (
        Math.ceil(
          stickySliderHeight
            ? stickySliderHeight + sliderTopOffset
            : 56 + sliderTopOffset
        ) + 100
      );
    }

    function checkSectionsAreIntoView() {
      var fromTop = Math.ceil(getScrollTop() + getSafetyOffset());
      let cur = [];
      // Get id of current scroll item
      for (let target of product_list_groups) {
        //let offsetTop = Math.ceil(target.offsetTop);
        // if (offsetTop <= fromTop && offsetTop + $(target).height() > fromTop) {
        if (target.offsetTop <= fromTop) {
          cur.push($(target));
        }
      }
      cur = cur[cur.length - 1];
      var id = cur && cur.length ? cur[0].id : "";
      setBtnActive(id);
    }

    function setBtnActive(id) {
      btns.forEach((btn, i) => {
        btn.classList.remove("custom-active");
        const link = btn.getAttribute("data-link");
        if (id === link) {
          btn.classList.add("custom-active");
          glider.scrollItem(i > 0 ? i - 1 : 0);
          //console.log(i);
          updateURL(link);
        }
      });
    }

    function updateURL(link) {
      if (history.pushState) {
        history.pushState(null, null, "#" + link);
      } else {
        location.hash = "#" + link;
      }
      console.log(location.hash);
    }
    const scrollToWithOffset = () => {
      slider.addEventListener(
        "click",
        function (e) {
          if (!e.target.closest(".ProductListCategoriesSlider__item")) {
            return;
          } else {
            e.stopPropagation();
            window.removeEventListener("scroll", throttle(scrollListener));
            // const btn = e.target.closest(".ProductListCategoriesSlider__item");
            // const link = btn.getAttribute("data-link");

            //updateURL(link);

            let safety_top_offset = getSafetyOffset(),
              offsetTop = Math.ceil(document.getElementById(link).offsetTop);

            if (last_slider_layout !== "sticky") {
              window.scrollTo(
                window.scrollX,
                offsetTop - safety_top_offset - 145
              );
              window.setTimeout(function () {
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
      // To avoid duplicate firing (html and body)
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

    window.onresize = function (event) {
      updateGlider();
    };
  }
};
// =====================================
// ==END DOCUMENT ONREADY==
// =====================================
