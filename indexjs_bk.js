// ==UserScript==
// @name         PLP COFFEE -HERO + CATS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.nespresso.com/br/en/order/capsules
// @grant        none
// @run-at       document-end
// ==/UserScript==

require("file-loader?name=[name].[ext]!./index.html");
var projectName = require("glider-js");
var CustomSelect = require("vanilla-js-dropdown");
import "./scss/style.scss";
import { track } from "glider-js";

// =====================================
// ==DOCUMENT ONREADY==
// =====================================
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    //dummy images
    // let categories_images = [
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    //   "images/barista-creation_L.jpg",
    // ];

    // Get element before slider
    const products_title = ".ProductList__title";
    const productsTitleElement = document.querySelector(products_title);
    const product_list_groups = document.querySelectorAll(".ProductListGroup");
    let stickySliderHeight, sliderTopOffset;

    //Adding the Slider to the DOM
    const slider = document.createElement("div");
    slider.classList.add("ProductListCategories");
    slider.innerHTML = addProductListNavigationComponent();
    insertAfter(slider, productsTitleElement);

    const btnContainer = document.querySelector(".ProductListCategoriesSlider");
    const btns = btnContainer.querySelectorAll(
      ".ProductListCategoriesSlider__item"
    );
    // Check viewport size
    const checkViewport = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        return "desktop";
      } else {
        return "mobile";
      }
    };
    const sliderContainer = document.querySelector(
      ".ProductListCategoriesSlider__container"
    );
    let viewport = checkViewport();
    // ==============================
    // ==SELECT COMPONENT==
    // ==============================

    const select_values = getTechnologiesData();
    const technologiesElement = document.querySelector(
      ".ProductListTechnologies"
    )
      ? document.querySelector(".ProductListTechnologies")
      : false;

    function getTechnologiesData() {
      let result = [];
      let technologies_groups = document.querySelectorAll(
        ".ProductListTechnologies__link"
      );
      if (technologies_groups.length) {
        technologies_groups.forEach((technology) => {
          const title = technology
            .querySelector(".ProductListTechnologies__name")
            .textContent.trim();
          const id = title.toLowerCase();
          result.push({
            label: title,
            value: id,
          });
        });
      }
      return result;
    }

    function createTechnologiesDropdown() {
      const sel = document.createElement("select");
      sel.setAttribute("id", "ProductListTechnologiesDropdown__select");
      document
        .querySelector(".ProductListTechnologiesDropdown")
        .appendChild(sel);

      for (let val of select_values) {
        const option = document.createElement("option");
        option.setAttribute("value", val.value);
        var label = document.createTextNode(val.label);
        option.appendChild(label);
        document
          .getElementById("ProductListTechnologiesDropdown__select")
          .appendChild(option);
      }

      addDropdownListener();
    }

    function addDropdownListener() {
      const select = document.getElementById(
        "ProductListTechnologiesDropdown__select"
      );
      const custom = document.getElementsByClassName(
        "ProductListTechnologiesDropdown"
      )[0];

      select.addEventListener("change", function () {
        let baseURL = getBaseURL();
        let newURL = baseURL + "/" + this.value;
        window.location.href = newURL;
      });

      document.addEventListener("click", function (e) {
        window.setTimeout(function () {
          if (
            custom
              .getElementsByClassName("js-Dropdown-list")[0]
              .classList.contains("is-open")
          ) {
            custom.classList.add("ProductListTechnologiesDropdown--opened");
          } else {
            custom.classList.remove("ProductListTechnologiesDropdown--opened");
          }
        }, 0);
      });
    }

    function getBaseURL() {
      let _url = window.location.href;
      const lastItem = _url.substring(_url.lastIndexOf("/") + 1);
      for (let val of select_values) {
        if (val.value === lastItem) {
          _url = _url.substring(0, _url.lastIndexOf("/"));
        }
      }
      return _url;
    }
    // ==============================
    // ==END SELECT COMPONENT==
    // ==============================

    // ==============================
    // ==SLIDER COMPONENT==
    // ==============================

    // Initialize Glider slider with options
    let glider;
    function createGlider(w) {
      glider = new Glider(btnContainer, {
        exactWidth: false,
        draggable: true,
        slidesToScroll: "auto",
        exactWidth: false,
        itemWidth: w ? w : 200,
        slidesToShow: "auto",
        skipTrack: true,
        arrows: {
          prev: ".glider-prev",
          next: ".glider-next",
        },
      });
    }

    //Slider buttons active class handlers
    if (btns.length) {
      Array.from(btns).forEach((btn) => {
        btn.addEventListener("click", function () {
          btnContainer.querySelector(".custom-active")
            ? btnContainer
                .querySelector(".custom-active")
                .classList.remove("custom-active")
            : "";
          this.classList.add("custom-active");
        });
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
            .textContent.replace("Capsules", "")
            .replace("capsules", "")
            .trim();
          const text_id = title.toLowerCase().replace(" ", "-");
          const id = "ab-" + text_id;
          const titleAsArray = parseTitleAsArray(title.split(" "));
          productGroup.id = id;
          result.push({
            label: title,
            labelAsArray: titleAsArray,
            //image: imageName,
            //image: "images/barista-creations.jpg",
            image: "https://via.placeholder.com/80",
            id: id,
          });
        });
      }
      return result;
    }

    //Creating the slider markup
    function addProductListNavigationComponent() {
      const categories = getCategories();
      return `
    <div class="ProductListNavigation">
      <div class="ProductListTechnologiesDropdown"></div>
      <div class="ProductListCategoriesSlider__container">
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
                  }" alt="${category.label}">
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
        <button aria-label="Previous" class="ProductListCategoriesSlider__arrow ProductListCategoriesSlider__arrow--left glider-prev"><span></span></button>
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

    //BR BANNER
    // let add_banner = false;
    // if (add_banner) {
    //   const banner = document.createElement("section");
    //   banner.id = "hero";
    //   banner.classList.add("ProductList__banner");
    //   banner.innerHTML = createBanner();
    //   // banner.style.backgroundImage = "url('https://via.placeholder.com/800')";
    //   productsTitleElement.parentNode.insertBefore(banner, productsTitleElement);

    //   function createBanner() {
    //     let _title = "Inspirazione Italiana";
    //     let _subtitle = "Explore Italy's regional coffee artistry";
    //     return `
    //         <div class="g_bg g_parallax g_imgSrc g_imgSrc_loaded"
    //             style="
    //             background-image: url('/shared_res/agility/define/originalMachineHub/img/backgrounds/ol_capsules_ground_L.jpg')">
    //         </div>
    //         <div class="g_restrict">
    //           <div class="g_content">
    //             <div class="g_text">
    //               <h2 class="g_h1">${_title}</h2>
    //               <h3 class="g_h1">${_subtitle}</h3>
    //             </div>
    //           </div>
    //         </div>
    //     `;
    //     // return `
    //     //       <h2 class="ProductList__banner__title">${_title}</h1>
    //     //       <h3 class="ProductList__banner__subtitle">${_subtitle}</h2>;
    //     //     `;
    //   }
    // }

    // ===================================
    // ==VERTICAL SCROLL FUNCTIONALITY==
    // ==For sticky functionality==
    // ===================================

    let bodyLastTopRect = document.body.getBoundingClientRect().top;
    let sliderLayoutEvent = new CustomEvent("slider-sticky-state", {
      detail: { sticky: null },
    });
    const getTopOffset = (element) => {
      if (typeof element != "undefined" && element != null) {
        let rect = element.getBoundingClientRect();
        return rect.top + rect.height;
      } else {
        return 0;
      }
    };

    function getSliderTopOffset(el1, el2) {
      let el1Offset = getTopOffset(el1);
      let el2TopOffset = getTopOffset(el2);
      let offset = el2TopOffset ? el2TopOffset : el1Offset;
      return offset;
    }

    function toggleStickySlider(boo, offset) {
      if (boo) {
        slider.classList.add("sticky");
        slider.style.top = offset + "px";
        bodyLastTopRect = document.body.getBoundingClientRect().top;
        sliderLayoutEvent.detail.sticky = "sticky";
      } else {
        slider.classList.remove("sticky");
        slider.style.top = 0;
        sliderLayoutEvent.detail.sticky = "normal";
      }
      slider.dispatchEvent(sliderLayoutEvent);
      stickySliderHeight = btnContainer.getBoundingClientRect().height;
      //updateGlider();
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
      //return Math.ceil(getSlidesTotalWidth() / slidesElements.length);
      return Math.ceil(
        getEachSlideWidth().reduce((a, b) => a + b, 0) / slidesElements.length
      );
    }

    function getSlidesTotalWidth() {
      let marginPx = 8;
      let slidesW = getEachSlideWidth();
      let margin = marginPx * slidesW.length - marginPx;
      let totalWidth = slidesW.reduce((a, b) => a + b, 0);
      return totalWidth + margin;
    }

    function setScrollingIterationsNeeded(w) {
      return Math.ceil(w / sliderContainer.offsetWidth);
    }
    let scrollingIterationsNeeded;
    function updateGlider() {
      //glider.ele.Glider = glider;
      console.log("getSlidesAverageWidth = " + getSlidesAverageWidth());
      let options = { itemWidth: getSlidesAverageWidth() };
      glider.setOption(options);
      glider.refresh(true);
      //glider.updateControls();
      //disableSliderArrowRight();
      let _realwidth = getSliderRealWidth();
      scrollingIterationsNeeded = setScrollingIterationsNeeded(_realwidth);
      slidesTrackElement.style.width = _realwidth + "px";
      checkSliderArrowsNeeded();
    }

    function getSliderRealWidth() {
      return sliderLayoutEvent.detail.sticky === "sticky"
        ? getSlidesTotalWidth() + 20
        : getSlidesTotalWidth();
    }

    let arrowRightTimesClicked = 0;
    let arrowRightTimesAnimated = 0;
    function disableSliderArrowRight(disable) {
      const arrow_right = sliderContainer.querySelector(
        ".ProductListCategoriesSlider__arrow--right"
      );
      // const centerSlides = sliderContainer.querySelectorAll(".center");
      // const centerSlideIndex = centerSlides[
      //   centerSlides.length - 1
      // ].getAttribute("data-index");
      // const lastSlide = slidesElements[slidesElements.length - 1];
      // const lastSlideIndex = lastSlide.getAttribute("data-index");
      // const lastSlideRightPosition = lastSlideIndex - centerSlideIndex

      // console.log(sliderContainer.getBoundingClientRect());
      // console.log(slidesTrackElement.getBoundingClientRect());
      // console.log(btns[btns.length - 1].getBoundingClientRect());

      const trackRect = slidesTrackElement.getBoundingClientRect();
      // console.log(
      //   trackRect.right -
      //     Math.abs(trackRect.left) -
      //     sliderContainer.getBoundingClientRect().width
      // );
      // Math.ceil(_.ele.scrollLeft + _.containerWidth) >=
      //   Math.floor(_.trackWidth) || disableArrows;
      if (
        btns[btns.length - 1].getBoundingClientRect().left <
        sliderContainer.getBoundingClientRect().width
      ) {
        arrow_right.classList.add("custom-disabled");
      } else {
        arrow_right.classList.remove("custom-disabled");
      }
    }

    function checkSliderArrowsNeeded() {
      let sliderW = getSliderRealWidth();
      let totalW = sliderContainer.getBoundingClientRect().width;
      // console.log(sliderW);
      // console.log(totalW);
      if (sliderW <= totalW) {
        hideSlideArrows(true);
      } else {
        hideSlideArrows(false);
      }
    }

    function hideSlideArrows(hide) {
      //  console.log("hideSlideArrows = " + hide);
      let arrows = document.querySelectorAll(
        ".ProductListCategoriesSlider__arrow"
      );
      for (let arrow of arrows) {
        if (hide) {
          sliderContainer.classList.add("no-slider");
        } else {
          sliderContainer.classList.remove("no-slider");
        }
      }
    }

    function slideControlsEnabled() {
      return btnContainer.scrollWidth > btnContainer.clientWidth;
    }

    // var lastSlideVisibility = new IntersectionObserver(
    //   function (entries) {
    //     if (entries[0].isIntersecting === true) {
    //       console.log("intersectin true");
    //       disableSliderArrowRight(false);
    //       // if (viewport === "desktop")
    //       //   document
    //       //     .querySelector(".ProductListCategoriesSlider")
    //       //     .classList.add("marginleft");
    //     } else {
    //       console.log("intersectin flase");
    //       disableSliderArrowRight(true);
    //       // if (viewport === "desktop")
    //       //   document
    //       //     .querySelector(".ProductListCategoriesSlider")
    //       //     .classList.remove("marginleft");
    //     }
    //   },
    //   { threshold: [1] }
    // );

    //lastSlideVisibility.observe(slidesElements[slidesElements.length - 1]);
    let last_slider_layout, tabs_display_style;

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
      const header_top = document.querySelector(".Header__top-wrapper");
      const dynamic_banner = document.querySelector(".dynamic_banner");
      //Technologies dropdown visibility
      if (!technologiesElement) {
        // hide dropdown container
        document
          .querySelector(".ProductListTechnologiesDropdown")
          .classList.add("hidden");
        slider.classList.remove("ProductListCategories--dropdown");
      } else {
        // show dropdown and listen to sticky state to hide/show technologies tabs
        createTechnologiesDropdown();
        let select = new CustomSelect({
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
          // console.log(
          //   "last_slider_layout =" +
          //     last_slider_layout +
          //     " event.detail.sticky = " +
          //     event.detail.sticky
          // );
          updateGlider();
          arrowRightTimesClicked = 0;
          arrowRightTimesAnimated = 0;
          sliderTopOffset = getSliderTopOffset(header_top, dynamic_banner);
          //check first change to correct anchor scroll
          if (!last_slider_layout) {
          }
          last_slider_layout = event.detail.sticky;
        }

        if (technologiesElement) {
          if (event.detail.sticky === "sticky") {
            technologiesElement.style.display = "none";
          } else {
            technologiesElement.style.display = tabs_display_style;
          }
        }
        //          glider.ele.Glider = glider;
      });

      // =====================================
      // ==END SETTIMEOUT FUNCTIONALITY==
      // =====================================

      // ==================================================
      // ==VERTICAL SCROLL ACTIVATING SLIDER BUTTONS=======
      // ==Detecting vertical scroll treshold and trigger==
      // ==================================================
      sliderTopOffset = getSliderTopOffset(header_top, dynamic_banner);
      window.addEventListener("scroll", function () {
        let currentScroll =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        // console.log("currentScroll = " + currentScroll);
        // console.log("sliderRect.y = " + btnContainer.getBoundingClientRect().y);
        // console.log("window.scrollY = " + window.scrollY);
        // console.log("sliderScrollOffset = " + sliderScrollOffset);
        // console.log("sliderTopOffset = " + sliderTopOffset);
        // console.log("getTopOffset(header_top) = " + getTopOffset(header_top));
        let toggle =
          currentScroll > 0 &&
          sliderTopOffset >= btnContainer.getBoundingClientRect().y;
        toggleStickySlider(toggle, sliderTopOffset);
        checkSectionsAreIntoView();
      });
      scrollToWithOffset();
      updateGlider();
    }, 0);

    let slidePositionFromCenter;
    function checkSectionsAreIntoView() {
      let index = product_list_groups.length;
      while (
        --index &&
        window.scrollY + sliderTopOffset + stickySliderHeight <
          product_list_groups[index].offsetTop
      ) {}
      btns.forEach((btn) => btn.classList.remove("custom-active"));
      btns[index].classList.add("custom-active");
      let centerBtnIndexArray = [];
      for (let centerBtn of btnContainer.querySelectorAll(".center")) {
        centerBtnIndexArray.push(centerBtn.getAttribute("data-index"));
      }
      if (index < centerBtnIndexArray[0]) {
        if (slidePositionFromCenter !== "left") {
          glider.scrollItem("prev");
          slidePositionFromCenter = "left";
        }
      } else if (index > centerBtnIndexArray[centerBtnIndexArray.length - 1]) {
        if (slidePositionFromCenter !== "right") {
          glider.scrollItem("next");
          slidePositionFromCenter = "right";
        }
      }
    }

    function offsetAnchor() {
      if (location.hash.length !== 0) {
        const safety_top_offset = stickySliderHeight + sliderTopOffset;
        window.scrollTo(window.scrollX, window.scrollY - safety_top_offset);
      }
    }

    function scrollToWithOffset() {
      const links = document.querySelectorAll(
        ".ProductListCategoriesSlider__item a"
      );
      links.forEach(
        (each) =>
          (each.onclick = function (e, respond = null) {
            window.setTimeout(function () {
              offsetAnchor();
            }, 0);
            return;
            const distanceToTop = (el) =>
              Math.floor(el.getBoundingClientRect().top);
            e.preventDefault();
            var targetID = respond
              ? respond.getAttribute("href")
              : this.getAttribute("href");
            const targetAnchor = document.getElementById(
              targetID.replace("#", "")
            );
            const safety_top_offset = stickySliderHeight + sliderTopOffset;
            if (!targetAnchor) return;

            const originalTop = distanceToTop(targetAnchor);
            const totalOffset = originalTop - safety_top_offset;

            // console.log("stickySliderHeight = " + stickySliderHeight);
            console.log("safety_top_offset = " + safety_top_offset);
            // console.log("originalTop = " + originalTop);
            console.log("totalOffset = " + totalOffset);

            window.scrollBy({ top: totalOffset, left: 0, behavior: "smooth" });
            const checkIfDone = setInterval(function () {
              const atBottom =
                window.innerHeight + window.pageYOffset >=
                document.body.offsetHeight - 2;
              console.log("distancetop = " + distanceToTop(targetAnchor));
              console.log("atBottom = " + atBottom);
              if (
                distanceToTop(targetAnchor) === safety_top_offset ||
                atBottom
              ) {
                targetAnchor.tabIndex = "-1";
                // targetAnchor.focus();
                window.history.pushState("", "", targetID);
                clearInterval(checkIfDone);
              }
            }, 100);
          })
      );
    }

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

    // btnContainer.addEventListener("glider-loaded", function (event) {
    //   console.log("Slide loaded %s", event);
    //   console.log(event);
    // });
    // btnContainer.addEventListener("glider-refresh", function (event) {
    //   console.log("Slide refresh %s", event);
    //   console.log(event);
    // });

    // document
    //   .querySelectorAll(".ProductListCategoriesSlider__arrow")
    //   .forEach((item) => {
    //     item.addEventListener(
    //       "click",
    //       (event) => {
    //         if (event.target.offsetParent.classList.contains("glider-next")) {
    //           arrowRightTimesClicked++;
    //         } else {
    //           arrowRightTimesClicked--;
    //         }
    //         console.log(
    //           "fron clck" + arrowRightTimesClicked,
    //           scrollingIterationsNeeded
    //         );
    //         if (arrowRightTimesClicked === scrollingIterationsNeeded) {
    //           disableSliderArrowRight(true);
    //         } else {
    //           disableSliderArrowRight(false);
    //         }
    //       },
    //       false
    //     );
    //   });

    // btnContainer.addEventListener("glider-animated", function (event) {
    //   console.log("Slide animated %s" + event.detail);
    // });
    // btnContainer.addEventListener("glider-slide-visible", function (event) {
    //   console.log("Slide Visible %s", event.detail.slide);
    // });
    window.onresize = function (event) {
      viewport = checkViewport();
      updateGlider();
    };
  }
};
// =====================================
// ==END DOCUMENT ONREADY==
// =====================================
