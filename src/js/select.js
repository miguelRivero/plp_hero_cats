// ==============================
// ==SELECT COMPONENT==
// ==============================

const select_values = getTechnologiesData();

function getTechnologiesData() {
  let result = [];
  const technologies_groups = document.querySelectorAll(
    ".ProductListTechnologies__link"
  );
  if (technologies_groups.length) {
    for (const technology of technologies_groups) {
      const title = technology
        .querySelector(".ProductListTechnologies__name")
        .textContent.trim();
      const id = title.toLowerCase();
      result.push({
        label: title,
        value: id,
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
  const lastItem = _url.substring(_url.lastIndexOf("/") + 1);
  for (const val of select_values) {
    if (val.value === lastItem) {
      _url = _url.substring(0, _url.lastIndexOf("/"));
    }
  }
  return _url;
}

export { createTechnologiesDropdown };
// ==============================
// ==END SELECT COMPONENT==
// ==============================
