const getOriginalBtnData = (btns, product, added) => {
  for (let btn of btns) {
    let article = btn.closest("article"),
      increment = 10;
    if (article) {
      const disabled = !product.available,
        btn_container = btn.closest(".AddToBagButton__container"),
        hiddenText =
          btn.querySelector(".VisuallyHidden").textContent ||
          btn.querySelector(".VisuallyHidden").innerText,
        new_btn = document.createElement("div");
      new_btn.classList.add("AddToBagButton");
      let quantity = 0;
      //console.log(product_code);
      if (added) {
        //quantity = added.quantity;
        article.classList.add("ProductInBasket");
      }
      if (disabled) new_btn.setAttribute("disabled", "");
      const new_btn_content = addStepperBtnElements(
        null,
        increment,
        added,
        hiddenText,
        disabled
      );
      new_btn.innerHTML = new_btn_content;
      btn_container.firstChild.appendChild(new_btn);

      //move to lastchild
      article.appendChild(btn_container);

      //add click event
      btn_container.addEventListener(
        "click",
        function (event) {
          console.log(product);
          stepperInput(event, product.internationalId, increment, disabled);
        },
        false
      );
    }
  }
};

const updateBtnsData = (article, bought) => {
  const article_id = article.getAttribute("data-product-item-id");
  if (bought.length) {
    for (let b of bought) {
      let updated_q;
      if (article_id === b.productId.split("/").pop()) {
        updated_q = b.quantity;
      } else {
        updated_q = 0;
      }
      updateBtnInput(article, updated_q);
    }
  } else {
    updateBtnInput(article, 0);
  }
};

const updateBtnInput = (prod, number) => {
  prod.querySelector(".AddToBagButton__input").setAttribute("value", number);
  prod.querySelector(".AddToBagButton__incart").innerHTML = number;
  console.log(number);
  if (number === 0) {
    const sel = prod.querySelector(".AddToBagButton__stepper");
    sel.classList.remove("incart");
    sel.classList.add("empty");
  }
};

const addStepperBtnElements = (id, increase, added, hiddenTxt, disabled) => {
  return `
    <span class="VisuallyHidden">${hiddenTxt}</span>
    <div class="AddToBagButton__stepper ${!added ? "empty" : "incart"}">
    <button class="AddToBagButton__decrease" value="decrease"></button>
    <input type="number" class="AddToBagButton__input" value="${added}" min="0" max="100" step="${increase}"/>
    <button class="AddToBagButton__increase" value="increase"></button>
    <button class="AddToBagButton__incart" value="incart">${added}</button>
    <button class="AddToBagButton__empty" value="empty">${
      !disabled ? "BUY" : "OUT OF STOCK"
    }</button>
    `;
};

const stepperInput = (event, prod_id, inc, disable) => {
  event.stopPropagation();
  if (disable) return false;
  let btn_value = event.target.value;
  let min = 0,
    max = 100,
    //btn = document.getElementById(id),
    btn = document.querySelector("[data-product-item-id='" + prod_id + "']"),
    stepper = btn.querySelector(".AddToBagButton__stepper"),
    input = btn.querySelector(".AddToBagButton__input"),
    val = parseInt(input.value),
    new_value = val,
    surplus = val % inc;

  switch (btn_value) {
    case "empty":
      stepper.classList.remove("empty");
      new_value = inc;
      break;
    case "incart":
      stepper.classList.remove("incart");
      new_value += inc;
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

  updateBtnInput(btn, new_value);
  addToCart(prod_id, new_value);
};

const addToCart = (id, val) => {
  console.log(id, val);
  window.CartManager.updateItem(id, val)
    .then(() => {
      console.log("added");
    })
    .catch(() => {
      console.log("not added");
    });
};

export { getOriginalBtnData, updateBtnsData };
