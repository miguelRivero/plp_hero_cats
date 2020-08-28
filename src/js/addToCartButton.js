import { smallScreen } from "../main";

const setButtonCollapsed = (el) => {
  if (smallScreen) {
    el.classList.add("AddToBagButton--collapsed");
  } else {
    el.classList.remove("AddToBagButton--collapsed");
  }
};

const getOriginalBtnData = (ele, product, added) => {
  //console.log(product);
  //  for (let btn of btns) {
  let increment = product.unitQuantity > 1 ? 1 : 10;
  //if (article) {
  const disabled = !product.available,
    btn_container = ele.querySelector(".AddToBagButton__container"),
    new_btn = document.createElement("div"),
    hiddenText =
      ele.querySelector(".VisuallyHidden").textContent ||
      ele.querySelector(".VisuallyHidden").innerText;
  new_btn.classList.add("AddToBagButton");
  let quantity = 0;
  //if (disabled) new_btn.setAttribute("disabled", "");
  const new_btn_content = addStepperBtnElements(
    null,
    increment,
    added,
    hiddenText,
    disabled,
    smallScreen
  );
  new_btn.innerHTML = new_btn_content;
  btn_container.firstChild.appendChild(new_btn);
  //setButtonCollapsed(new_btn);
  //  btn_container.firstChild.innerHTML = new_btn_content;

  //move to lastchild
  ele.appendChild(btn_container);

  //add click event
  btn_container.addEventListener(
    "click",
    function (event) {
      stepperInput(event, product.internationalId, increment, disabled);
      ele.closest("li").classList.add("ProcutListItem--cartActive");
    },
    false
  );
  return btn_container;
  //}
  // }
};

const updateBtnsData = (article, article_id, cart, first) => {
  if (cart && cart.length) {
    for (const item of cart) {
      let updated_q;
      if (article_id === item.productId.split("/").pop()) {
        updated_q = item.quantity;
      } else {
        //For removed items
        updated_q = 0;
      }
      updateBtnValues(article, updated_q, first);
    }
  } else {
    updateBtnValues(article, 0, first);
  }
};

const updateBtnValues = (prod, number, reload) => {
  console.log("updateBtnValues");
  console.log(reload);

  //reload is for styling as 1 button (without input visible)
  prod.querySelector(".AddToBagButton__input").setAttribute("value", number);
  prod.querySelector(".AddToBagButton__incart").innerHTML = number;
  console.log("updateBtnValues,  reload = ", reload);
  const sel = prod.querySelector(".AddToBagButton__stepper");
  //set style when page loads
  if (reload || number === 0) {
    singleButtonStyle(sel, number);
  }
};

const singleButtonStyle = (el, num) => {
  console.log("singleButtonStyle");
  console.log(el, num);
  if (num === 0) {
    console.log("0 = incart -> empty");
    el.classList.remove("incart");
    el.classList.add("empty");
  } else {
    console.log("!0 = empty -> incart");
    el.classList.remove("empty");
    el.classList.add("incart");
    console.log("_______________");
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
  console.log("stepperInput");
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
      console.log(new_value);
      break;
    case "increase":
      new_value =
        surplus && val < max
          ? val + (inc - surplus)
          : val < max - inc
          ? val + inc
          : (new_value = max);
      console.log(new_value);
      break;
    default:
      break;
  }

  addToCart(prod_id, new_value);
  updateBtnValues(btn, new_value, false);
};

const addToCart = (id, val) => {
  window.CartManager.updateItem(id, val)
    .then(() => {
      //eventHub.$emit("cart.update2", id);
    })
    .catch(() => {
      console.log("Error adding item to cart");
    });
};

export { getOriginalBtnData, updateBtnsData };
