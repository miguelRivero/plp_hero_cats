// ================================
// ==SELECT (DROPDOWN) COMPONENT ==
// ================================
let select_values;

const setSelectValues = (el, activeTech) => {
  select_values = getTechnologiesData(el, activeTech);
};

function getTechnologiesData(tech, active) {
  let result = [];
  if (tech.length) {
    for (const technology of tech) {
      const title = technology
        .querySelector(".ProductListTechnologies__name")
        .textContent.trim();
      const id = title.toLowerCase();
      result.push({
        label: title,
        value: id,
        active: active === id,
      });
    }
  }
  return result;
}

function createTechnologiesDropdown() {
  const sel = document.createElement("select");
  sel.setAttribute("id", "ProductListTechnologiesDropdown__select");
  document.querySelector(".ProductListTechnologiesDropdown").appendChild(sel);

  for (let val of select_values) {
    const option = document.createElement("option");
    option.setAttribute("value", val.value);
    if (val.active) option.setAttribute("selected", "");
    var label = document.createTextNode(val.label);
    option.appendChild(label);
    sel.appendChild(option);
  }

  addDropdownListener(sel);
}

function addDropdownListener(select) {
  // const select = document.getElementById(
  //   "ProductListTechnologiesDropdown__select"
  // );
  const custom = document.getElementsByClassName(
    "ProductListTechnologiesDropdown"
  )[0];

  let baseURL = getBaseURL();
  select.addEventListener("change", function () {
    let newURL = baseURL + "/" + this.value;
    window.location.href = newURL;
  });

  select.addEventListener("mouseup", function (e) {
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
  let _url = window.location.href.replace(location.hash, "");
  const lastItem = getCurrentTechnologyUrl(_url);
  for (const val of select_values) {
    if (val.value === lastItem) {
      _url = _url.substring(0, _url.lastIndexOf("/"));
    }
  }
  return _url;
}

const getCurrentTechnologyUrl = (url) => {
  let currUrl = url ? url : window.location.href.replace(location.hash, "");
  const tech = currUrl.substring(currUrl.lastIndexOf("/") + 1);
  if (tech === "vertuo") {
    return tech;
  } else {
    return "original";
  }
};

export { setSelectValues, createTechnologiesDropdown, getCurrentTechnologyUrl };
// ==============================
// ==END SELECT COMPONENT==
// ==============================
