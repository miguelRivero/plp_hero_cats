let slidesTrackElement,
  sliderContainer,
  slideMargin = 12;

const setSlidesElement = (el) => {
  slidesTrackElement = el;
};

const setSliderContainer = (el) => {
  sliderContainer = el;
};

const getEachSlideWidth = () => {
  let _widths = [];
  for (let i = 0; i < slidesTrackElement.children.length; i++) {
    _widths.push(slidesTrackElement.children[i].offsetWidth);
  }
  return _widths;
};

const getSlidesAverageWidth = () => {
  return (
    Math.ceil(
      getEachSlideWidth().reduce((a, b) => a + b, 0) /
        slidesTrackElement.children.length
    ) + slideMargin
  );
};

const getSlidesTotalWidth = () => {
  return getEachSlideWidth().reduce((a, b) => a + b, 0);
};

const getSliderRealWidth = (ev) => {
  let _w = getSlidesTotalWidth();
  if (ev.detail.sticky === "sticky") {
    return _w + 40;
  } else if (ev.detail.sticky !== "sticky" && sliderArrowsNeeded(_w)) {
    return _w + 20;
  } else {
    return _w;
  }
};

const sliderArrowsNeeded = (w) => {
  if (w >= sliderContainer.getBoundingClientRect().width) {
    return true;
  } else {
    return false;
  }
};

const sliderRequired = (bool) => {
  if (bool) {
    sliderContainer.classList.remove("no-slider");
  } else {
    sliderContainer.classList.add("no-slider");
  }
};

export {
  setSlidesElement,
  setSliderContainer,
  getSliderRealWidth,
  sliderRequired,
  getSlidesAverageWidth,
  sliderArrowsNeeded,
};
