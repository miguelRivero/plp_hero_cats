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
    console.log(data);
    for (let btn of btns) {
      let article = btn.closest("article"),
        increment = 10;
      if (article) {
        const product_code = article.getAttribute("data-product-code"),
          added = productAdded(product_code, data),
          btn_container = btn.closest(".AddToBagButton__container"),
          btn_id = btn.parentElement.getAttribute("id");
        let quantity = 0;
        if (added) {
          quantity = added.quantity;
          article.classList.add(".ProductInBasket");
        }

        const new_btn_cont = document.createElement("div");
        new_btn_cont.classList.add("AddToBagButton");
        const new_btn = addStepperBtnElements(null, quantity, increment, added);
        new_btn_cont.innerHTML = new_btn;
        btn_container.firstChild.appendChild(new_btn_cont);

        //move to lastchild
        article.appendChild(btn_container);

        //remove original click

        btn_container.addEventListener(
          "click",
          function (event) {
            stepperInput(event, btn_id, increment);
          },
          false
        );
      }
    }
  });
}

const addStepperBtnElements = (id, q, increase, added) => {
  return `
  <div class="AddToBagButton">
    <span class="VisuallyHidden">
      You have ${q} of Our Favourites 50 Capsule Coffee Assortment in your basket. Activate to add the product
    </span>
    <div class="AddToBagButton__stepper ${!added ? "empty" : ""}">
    <button class="AddToBagButton__decrease" value="decrease">–</button>
    <input type="number" class="AddToBagButton__input" value="${q}" min="0" max="100" step="${increase}"/>
    <button class="AddToBagButton__increase" value="increase">+</button>
    <button class="AddToBagButton__empty" value="empty">BUY</button>
    </div>
  </div>
    `;
};

const stepperInput = (event, id, inc) => {
  event.stopPropagation();
  let btn_value = event.target.value;
  let min = 0,
    max = 100,
    btn = document.getElementById(id),
    stepper = btn.querySelector(".AddToBagButton__stepper"),
    input = btn.querySelector(".AddToBagButton__input"),
    val = parseInt(input.value),
    new_value = val,
    surplus = val % inc;

  console.log(val);
  console.log(btn_value);
  switch (btn_value) {
    case "empty":
      stepper.classList.remove("empty");
      new_value = 0;
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
