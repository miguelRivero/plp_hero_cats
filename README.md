# PLP HERO + CATS (PHASE 1)

##DEPENDENCIES

- GliderJS (currently linked to a custom fork that has unused functionalities commented)
- Vanilla JS Dropdown
- RAF Throttle (for scrolling performance -barely noticed)

##ASSETS

- Images are currently stored in this repository

##CODE FILES
In the folder js there are 3 files focused on some component/functionality.

- Categories-data.js gets the required info (titles, id, images) from the markup in order to use it in the slider.
- Horizontal-scroll.js deals mainly with calculations of slides dimensions and arrow visualization.
- Select.js gets the info from markup for the technologies select dropdown and deals with its functionality.

The css folder just has the common file (mostly font-family and variables definition) and the slider file.

##BUILD

- Webpack file has a bundle variable. If true, it bundles css and js together (for testing in Tampermonkey). The opposite produces separate files meant for Google Optimize.
