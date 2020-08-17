async function getCartData() {
  return await napi
    .cart()
    .read()
    .then(function (p) {
      return p;
    });
}

const productAdded = (code, added) => {
  for (const prod of added) {
    const id = prod.productId.split("/").pop();
    if (id === code) {
      return prod;
    } else {
      return false;
    }
  }
};

async function getOriginalBtnData() {
  const btns = document.querySelectorAll(".AddToBagButton");
  await getCartData().then((data) => {
    for (let btn of btns) {
      let article = btn.closest("article"),
        increment = 10;
      if (article) {
        const product_code = article.getAttribute("data-product-code"),
          disabled = btn.hasAttribute("disabled"),
          added = productAdded(product_code, data),
          btn_container = btn.closest(".AddToBagButton__container"),
          hiddenText =
            btn.querySelector(".VisuallyHidden").textContent ||
            btn.querySelector(".VisuallyHidden").innerText,
          btn_id = btn.parentElement.getAttribute("id");
        let quantity = 0;
        if (added) {
          quantity = added.quantity;
          article.classList.add(".ProductInBasket");
        }
        const new_btn = document.createElement("div");
        new_btn.classList.add("AddToBagButton");
        if (disabled) new_btn.setAttribute("disabled", "");
        const new_btn_content = addStepperBtnElements(
          null,
          quantity,
          increment,
          added,
          hiddenText
        );
        new_btn.innerHTML = new_btn_content;
        btn_container.firstChild.appendChild(new_btn);

        //move to lastchild
        article.appendChild(btn_container);

        //add click event
        btn_container.addEventListener(
          "click",
          function (event) {
            stepperInput(event, btn_id, increment, disabled);
          },
          false
        );
      }
    }
  });
}

const addStepperBtnElements = (id, q, increase, added, hiddenTxt, disabled) => {
  return `
    <span class="VisuallyHidden">${hiddenTxt}</span>
    <div class="AddToBagButton__stepper ${!added ? "empty" : "incart"}">
    <button class="AddToBagButton__decrease" value="decrease">–</button>
    <input type="number" class="AddToBagButton__input" value="${q}" min="0" max="100" step="${increase}"/>
    <button class="AddToBagButton__increase" value="increase">+</button>
    <button class="AddToBagButton__incart" value="incart">${q}</button>
    <button class="AddToBagButton__empty" value="empty">BUY</button>
    `;
};

const stepperInput = (event, id, inc, disable) => {
  event.stopPropagation();
  if (disable) return false;
  let btn_value = event.target.value;
  let min = 0,
    max = 100,
    btn = document.getElementById(id),
    stepper = btn.querySelector(".AddToBagButton__stepper"),
    input = btn.querySelector(".AddToBagButton__input"),
    val = parseInt(input.value),
    new_value = val,
    surplus = val % inc;

  switch (btn_value) {
    case "empty":
      stepper.classList.remove("empty");
      new_value = 0;
      break;
    case "incart":
      stepper.classList.remove("incart");
      break;
    case "decrease":
      new_value = surplus ? val - surplus : val >= inc ? val - inc : min;
      if (new_value === 0) stepper.classList.add("empty");
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

  input.setAttribute("value", new_value);
};

export { getOriginalBtnData };
