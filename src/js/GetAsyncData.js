export async function getCartData() {
  return napi.cart().read();
}

export async function getPLPData() {
  let resp = await fetch(
    "https://www.nespresso.com/br/en/order/capsules/original"
  );
  resp = await resp.text();
  const parsedDom = new DOMParser().parseFromString(resp, "text/html");
  window.customUI = [];
  const scriptContent = parsedDom.documentElement.querySelector(
    "[id*='respProductListPLPCapsule']"
  ).nextElementSibling.textContent;
  const modifiedScript = scriptContent.replace(
    "window.ui.push",
    "window.customUI.push"
  );
  eval(modifiedScript);
  return window.customUI[window.customUI.length - 1];
}
