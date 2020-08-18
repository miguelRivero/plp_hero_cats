//Getting categories data and parsing it
const capitalize = (str1) => {
  return str1.charAt(0).toUpperCase() + str1.slice(1);
};
const shortestStringReduce = (arr) => {
  return arr.reduce((a, b) => (a.length < b.length ? a : b));
};
const parseTitleAsArray = (arr) => {
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
};
const getCategories = (product_list_groups, imagesStorage) => {
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
};

export { getCategories };
