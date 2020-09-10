import { smallScreen } from "../main";

const setButtonCollapsed = (el) => {
  if (smallScreen) {
    el.classList.add("AddToBagButton--collapsed");
  } else {
    el.classList.remove("AddToBagButton--collapsed");
  }
};

const getOriginalBtnData = (ele, product, added) => {
  let increment = product.unitQuantity > 1 ? 1 : 10;
  const disabled = !product.available,
    btn_container = ele
      .querySelector(".AddToBagButton__container")
      .cloneNode(true),
    data_focus = ele
      .querySelector(".AddToBagButton")
      .getAttribute("data-focus-id"),
    new_btn = document.createElement("div"),
    hiddenText =
      ele.querySelector(".VisuallyHidden").textContent ||
      ele.querySelector(".VisuallyHidden").innerText;
  new_btn.classList.add("AddToBagButton");
  new_btn.setAttribute("data-focus-id", data_focus);
  //if (disabled) new_btn.setAttribute("disabled", "");
  new_btn.innerHTML = addStepperBtnElements(
    null,
    increment,
    added,
    hiddenText,
    disabled,
    smallScreen
  );
  btn_container.firstChild.appendChild(new_btn);
  btn_container.classList.add("AddToBagButtonStepper");

  //add click event
  btn_container.addEventListener(
    "click",
    function (event) {
      stepperInput(event, product.internationalId, increment, disabled);
      ele.closest("li").classList.add("ProductListItem--cartActive");
    },
    false
  );

  //add foucusout and keyup ENTER to input
  const inputEl = btn_container.querySelector(".AddToBagButton__input");
  inputEl.addEventListener("focusout", (event) => {
    inputRoundQHandler(event.target, increment, product.internationalId);
  });

  inputEl.addEventListener("keyup", (event) => {
    let key = event.keyCode || event.which;
    if (key == 13) {
      inputRoundQHandler(event.target, increment, product.internationalId);
    }
  });

  return btn_container;
};

const inputRoundQHandler = (ele, increment, id) => {
  const value = roundQUp(ele.value, increment);
  setInputValue(ele, value);
  addToCart(id, value);
};
const updateBtnValues = (prod, number) => {
  //reload is for styling as 1 button (without input visible)
  const input = prod.querySelector(".AddToBagButton__input");
  setInputValue(input, number);
  prod.querySelector(".AddToBagButton__incart").innerHTML = number;
  const sel = prod.querySelector(".AddToBagButton__stepper");
  //set style when page loads
  //  le esta llegando zero cuando no es asi
  if (!number) {
    singleButtonStyle(sel, number);
  }
};

const singleButtonStyle = (el, num) => {
  if (num) {
    el.classList.remove("empty");
    el.classList.add("incart");
  } else {
    el.classList.remove("incart");
    el.classList.add("empty");
  }
};

const addStepperBtnElements = (
  id,
  increase,
  added,
  hiddenTxt,
  disabled,
  smallScreen
) => {
  return `
      <span class="VisuallyHidden">${hiddenTxt}</span>
      <div class="AddToBagButton__stepper ${!added ? "empty" : "incart"}">
      <button class="AddToBagButton__decrease" value="decrease"><span>-</span></button>
      <input type="number" class="AddToBagButton__input" value="${added}" min="0" max="100" step="${increase}"/>
      <button class="AddToBagButton__increase" value="increase"><span>+</span></button>
      <button class="AddToBagButton__incart" value="incart">${
        added ? added : 0
      }</button>
      <button class="AddToBagButton__empty" value="empty">${
        !disabled ? "BUY" : "OUT OF STOCK"
      }</button>
    `;
};

const stepperInput = (event, prod_id, inc, disable) => {
  event.stopPropagation();
  if (disable) return false;

  let btn_value = event.target.value
    ? event.target.value
    : event.target.parentNode.value;
  let min = 0,
    max = 100,
    //btn = document.getElementById(id),
    btn = document.querySelector("[data-product-item-id='" + prod_id + "']"),
    stepper = btn.querySelector(".AddToBagButton__stepper"),
    input = btn.querySelector(".AddToBagButton__input"),
    val = parseInt(input.value),
    new_value = val,
    surplus = val % inc;

  if (smallScreen) {
    switch (btn_value) {
      // case "empty":
      //   stepper.classList.remove("empty");
      //   new_value = inc;
      //   break;
      case "incart":
        stepper.classList.remove("incart");
        //      new_value += inc;
        break;
      case "decrease":
        new_value = surplus ? val - surplus : val >= inc ? val - inc : min;
        break;
      case "increase":
        stepper.classList.remove("empty");

        new_value =
          surplus && val < max
            ? val + (inc - surplus)
            : val < max - inc
            ? val + inc
            : (new_value = max);
        break;
      default:
        break;
    }
  } else {
    switch (btn_value) {
      case "empty":
        stepper.classList.remove("empty");
        new_value = inc;
        break;
      case "incart":
        stepper.classList.remove("incart");
        //      new_value += inc;
        break;
      case "decrease":
        new_value = surplus ? val - surplus : val >= inc ? val - inc : min;
        break;
      case "increase":
        new_value =
          surplus && val < max
            ? val + (inc - surplus)
            : val < max - inc
            ? val + inc
            : (new_value = max);
        break;
      default:
        break;
    }
  }
  addToCart(prod_id, new_value);
};

const roundQUp = (val, inc, max = 100) => {
  val = parseInt(val);
  const surplus = val % inc;
  const new_value = surplus && val < max ? val + (inc - surplus) : val;
  return new_value;
};

const setInputValue = (input, number) => {
  input.setAttribute("value", number);
  input.value = number;
};
const addToCart = (id, val) => {
  window.CartManager.updateItem(id, val)
    .then(() => {})
    .catch(() => {
      console.log("Error adding item to cart");
    });
};

export { getOriginalBtnData, updateBtnValues };
