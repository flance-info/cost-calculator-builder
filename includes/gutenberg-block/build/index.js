/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);






function Edit({
  attributes,
  setAttributes
}) {
  const [calculators, setCalculators] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const fetchCalculators = async () => {
      try {
        const posts = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default()({
          path: '/ccb-gutenberg/v1/calculators'
        });
        const formattedCalculators = Object.entries(posts).map(([id, label]) => ({
          id,
          label
        }));
        formattedCalculators.unshift({
          id: '',
          label: 'Select calculator'
        });
        setCalculators(formattedCalculators);
      } catch (error) {
        console.error('Error fetching calculators', error);
      }
    };
    fetchCalculators();
  }, []);
  const handleSelectChange = value => {
    const selectedOption = calculators.find(option => option.id === value);
    setAttributes({
      calculator: selectedOption
    });
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'cost-calculator-builder'),
    initialOpen: true
  }, attributes.calculator.id && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    target: "_blank",
    href: location.protocol + '//' + window.location.host + '/wp-admin/admin.php?page=cost_calculator_builder&action=edit&id=' + attributes.calculator.id
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit this calculator', 'cost-calculator-builder')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)()
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "ccb-gutenberg-block"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "ccb-gutenberg-block__header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ccb-gutenberg-block__icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "50",
    height: "50",
    viewBox: "0 0 431 329",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M325.81 236.557C322.815 229.898 315.446 226.575 308.154 226.935C282.914 228.181 259.518 213.722 249.224 190.836C234.682 158.504 249.238 122.231 280.619 108.117C287.597 104.979 296.182 103.152 304.836 102.99C312.245 102.852 319.479 98.8738 321.947 91.8862L333.507 59.1523C336.371 51.0436 331.842 42.0984 323.344 40.7809C300.196 37.1923 276.095 40.4096 253.578 50.537C191.767 78.3375 162.133 152.261 190.789 215.975C215.419 270.737 275.051 299.248 331.053 287.449C339.632 285.641 343.636 276.19 340.039 268.194L325.81 236.557ZM359.03 259.577C362.636 267.596 372.402 270.862 379.45 265.604C418.517 236.461 437.553 186.306 427.66 138.581C425.875 129.972 416.402 125.935 408.383 129.542L376.95 143.679C370.229 146.702 366.908 154.175 367.298 161.535C368.216 178.867 361.705 196.022 349.518 208.381C344.344 213.628 341.87 221.424 344.893 228.145L359.03 259.577ZM353.658 67.3565L341.466 99.4809C338.864 106.336 341.743 113.964 347.099 118.972C347.719 119.552 348.33 120.147 348.933 120.755C353.882 125.749 361.293 127.855 367.705 124.971L399.921 110.482C407.906 106.89 411.19 97.1826 405.977 90.1475C397.115 78.1871 386.181 68.0867 373.71 60.0497C366.322 55.2883 356.777 59.1388 353.658 67.3565ZM30.1514 0.413086C13.5828 0.413085 0.151365 13.8446 0.151367 30.4131L0.151382 299C0.151383 315.569 13.5828 329 30.1514 329H202.991C215.635 329 226.452 321.178 230.867 310.11C220.056 304.56 209.95 297.831 200.718 290.092C199.239 293.766 195.641 296.359 191.438 296.359H132.012C126.489 296.359 122.012 291.882 122.012 286.359L122.012 271.542C122.012 266.019 126.489 261.542 132.012 261.542H173.965C167.274 252.414 161.515 242.56 156.829 232.12V240.662C156.829 246.184 152.352 250.662 146.829 250.662H132.012C126.489 250.662 122.012 246.184 122.012 240.662V225.844C122.012 220.322 126.489 215.844 132.012 215.844H146.829C148.251 215.844 149.605 216.142 150.83 216.677C149.559 212.828 148.428 208.916 147.443 204.945C147.24 204.958 147.035 204.964 146.829 204.964L132.012 204.964C126.489 204.964 122.012 200.487 122.012 194.964L122.012 180.147C122.012 174.624 126.489 170.147 132.012 170.147H142.742C142.703 168.701 142.684 167.25 142.684 165.795C142.684 163.608 142.728 161.432 142.813 159.267H132.012C126.489 159.267 122.012 154.789 122.012 149.267V134.449C122.012 128.926 126.489 124.449 132.012 124.449L146.829 124.449C147.22 124.449 147.607 124.472 147.987 124.516C149.956 117.014 152.449 109.724 155.425 102.689L42.7925 102.689C37.2697 102.689 32.7925 98.2114 32.7925 92.6886L32.7925 43.0542C32.7925 37.5314 37.2697 33.0542 42.7925 33.0542H190.35C195.471 33.0542 199.692 36.9029 200.28 41.8653C209.818 33.8132 220.298 26.842 231.531 21.1408C227.625 9.11032 216.324 0.413083 202.991 0.413094L30.1514 0.413086ZM32.7925 134.449C32.7925 128.926 37.2697 124.449 42.7925 124.449H57.6097C63.1325 124.449 67.6097 128.926 67.6097 134.449V149.267C67.6097 154.789 63.1325 159.267 57.6097 159.267H42.7925C37.2697 159.267 32.7925 154.789 32.7925 149.267L32.7925 134.449ZM32.7925 180.147C32.7925 174.624 37.2697 170.147 42.7925 170.147H57.6097C63.1325 170.147 67.6097 174.624 67.6097 180.147L67.6097 194.964C67.6097 200.487 63.1325 204.964 57.6097 204.964H42.7925C37.2697 204.964 32.7925 200.487 32.7925 194.964V180.147ZM42.7925 215.844C37.2697 215.844 32.7925 220.322 32.7925 225.844V240.662C32.7925 246.184 37.2697 250.662 42.7925 250.662H57.6097C63.1325 250.662 67.6097 246.184 67.6097 240.662L67.6097 225.844C67.6097 220.322 63.1325 215.844 57.6097 215.844H42.7925ZM32.7925 271.542C32.7925 266.019 37.2697 261.542 42.7925 261.542H57.6097C63.1325 261.542 67.6097 266.019 67.6097 271.542V286.359C67.6097 291.882 63.1325 296.359 57.6097 296.359L42.7925 296.359C37.2697 296.359 32.7925 291.882 32.7925 286.359L32.7925 271.542ZM87.402 124.449C81.8792 124.449 77.402 128.926 77.402 134.449V149.267C77.402 154.789 81.8792 159.267 87.402 159.267L102.219 159.267C107.742 159.267 112.219 154.789 112.219 149.267V134.449C112.219 128.926 107.742 124.449 102.219 124.449L87.402 124.449ZM77.402 180.147C77.402 174.624 81.8792 170.147 87.402 170.147H102.219C107.742 170.147 112.219 174.624 112.219 180.147V194.964C112.219 200.487 107.742 204.964 102.219 204.964H87.402C81.8792 204.964 77.402 200.487 77.402 194.964V180.147ZM87.402 215.844C81.8792 215.844 77.402 220.322 77.402 225.844V240.662C77.402 246.184 81.8792 250.662 87.402 250.662H102.219C107.742 250.662 112.219 246.184 112.219 240.662V225.844C112.219 220.322 107.742 215.844 102.219 215.844L87.402 215.844ZM77.402 271.542C77.402 266.019 81.8792 261.542 87.402 261.542H102.219C107.742 261.542 112.219 266.019 112.219 271.542V286.359C112.219 291.882 107.742 296.359 102.219 296.359L87.402 296.359C81.8792 296.359 77.402 291.882 77.402 286.359L77.402 271.542Z",
    fill: "black"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "ccb-gutenberg-block__title"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cost Calculator Builder', 'cost-calculator-builder'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "ccb-gutenberg-block__body"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select a Calculator'),
    options: calculators.map(option => ({
      label: option.label,
      value: option.id
    })),
    value: attributes.calculator ? attributes.calculator.id : '',
    onChange: handleSelectChange
  })))));
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/block.json");




/**
 * Internal dependencies
 */



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "431",
    height: "329",
    viewBox: "0 0 431 329",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M325.81 236.557C322.815 229.898 315.446 226.575 308.154 226.935C282.914 228.181 259.518 213.722 249.224 190.836C234.682 158.504 249.238 122.231 280.619 108.117C287.597 104.979 296.182 103.152 304.836 102.99C312.245 102.852 319.479 98.8738 321.947 91.8862L333.507 59.1523C336.371 51.0436 331.842 42.0984 323.344 40.7809C300.196 37.1923 276.095 40.4096 253.578 50.537C191.767 78.3375 162.133 152.261 190.789 215.975C215.419 270.737 275.051 299.248 331.053 287.449C339.632 285.641 343.636 276.19 340.039 268.194L325.81 236.557ZM359.03 259.577C362.636 267.596 372.402 270.862 379.45 265.604C418.517 236.461 437.553 186.306 427.66 138.581C425.875 129.972 416.402 125.935 408.383 129.542L376.95 143.679C370.229 146.702 366.908 154.175 367.298 161.535C368.216 178.867 361.705 196.022 349.518 208.381C344.344 213.628 341.87 221.424 344.893 228.145L359.03 259.577ZM353.658 67.3565L341.466 99.4809C338.864 106.336 341.743 113.964 347.099 118.972C347.719 119.552 348.33 120.147 348.933 120.755C353.882 125.749 361.293 127.855 367.705 124.971L399.921 110.482C407.906 106.89 411.19 97.1826 405.977 90.1475C397.115 78.1871 386.181 68.0867 373.71 60.0497C366.322 55.2883 356.777 59.1388 353.658 67.3565ZM30.1514 0.413086C13.5828 0.413085 0.151365 13.8446 0.151367 30.4131L0.151382 299C0.151383 315.569 13.5828 329 30.1514 329H202.991C215.635 329 226.452 321.178 230.867 310.11C220.056 304.56 209.95 297.831 200.718 290.092C199.239 293.766 195.641 296.359 191.438 296.359H132.012C126.489 296.359 122.012 291.882 122.012 286.359L122.012 271.542C122.012 266.019 126.489 261.542 132.012 261.542H173.965C167.274 252.414 161.515 242.56 156.829 232.12V240.662C156.829 246.184 152.352 250.662 146.829 250.662H132.012C126.489 250.662 122.012 246.184 122.012 240.662V225.844C122.012 220.322 126.489 215.844 132.012 215.844H146.829C148.251 215.844 149.605 216.142 150.83 216.677C149.559 212.828 148.428 208.916 147.443 204.945C147.24 204.958 147.035 204.964 146.829 204.964L132.012 204.964C126.489 204.964 122.012 200.487 122.012 194.964L122.012 180.147C122.012 174.624 126.489 170.147 132.012 170.147H142.742C142.703 168.701 142.684 167.25 142.684 165.795C142.684 163.608 142.728 161.432 142.813 159.267H132.012C126.489 159.267 122.012 154.789 122.012 149.267V134.449C122.012 128.926 126.489 124.449 132.012 124.449L146.829 124.449C147.22 124.449 147.607 124.472 147.987 124.516C149.956 117.014 152.449 109.724 155.425 102.689L42.7925 102.689C37.2697 102.689 32.7925 98.2114 32.7925 92.6886L32.7925 43.0542C32.7925 37.5314 37.2697 33.0542 42.7925 33.0542H190.35C195.471 33.0542 199.692 36.9029 200.28 41.8653C209.818 33.8132 220.298 26.842 231.531 21.1408C227.625 9.11032 216.324 0.413083 202.991 0.413094L30.1514 0.413086ZM32.7925 134.449C32.7925 128.926 37.2697 124.449 42.7925 124.449H57.6097C63.1325 124.449 67.6097 128.926 67.6097 134.449V149.267C67.6097 154.789 63.1325 159.267 57.6097 159.267H42.7925C37.2697 159.267 32.7925 154.789 32.7925 149.267L32.7925 134.449ZM32.7925 180.147C32.7925 174.624 37.2697 170.147 42.7925 170.147H57.6097C63.1325 170.147 67.6097 174.624 67.6097 180.147L67.6097 194.964C67.6097 200.487 63.1325 204.964 57.6097 204.964H42.7925C37.2697 204.964 32.7925 200.487 32.7925 194.964V180.147ZM42.7925 215.844C37.2697 215.844 32.7925 220.322 32.7925 225.844V240.662C32.7925 246.184 37.2697 250.662 42.7925 250.662H57.6097C63.1325 250.662 67.6097 246.184 67.6097 240.662L67.6097 225.844C67.6097 220.322 63.1325 215.844 57.6097 215.844H42.7925ZM32.7925 271.542C32.7925 266.019 37.2697 261.542 42.7925 261.542H57.6097C63.1325 261.542 67.6097 266.019 67.6097 271.542V286.359C67.6097 291.882 63.1325 296.359 57.6097 296.359L42.7925 296.359C37.2697 296.359 32.7925 291.882 32.7925 286.359L32.7925 271.542ZM87.402 124.449C81.8792 124.449 77.402 128.926 77.402 134.449V149.267C77.402 154.789 81.8792 159.267 87.402 159.267L102.219 159.267C107.742 159.267 112.219 154.789 112.219 149.267V134.449C112.219 128.926 107.742 124.449 102.219 124.449L87.402 124.449ZM77.402 180.147C77.402 174.624 81.8792 170.147 87.402 170.147H102.219C107.742 170.147 112.219 174.624 112.219 180.147V194.964C112.219 200.487 107.742 204.964 102.219 204.964H87.402C81.8792 204.964 77.402 200.487 77.402 194.964V180.147ZM87.402 215.844C81.8792 215.844 77.402 220.322 77.402 225.844V240.662C77.402 246.184 81.8792 250.662 87.402 250.662H102.219C107.742 250.662 112.219 246.184 112.219 240.662V225.844C112.219 220.322 107.742 215.844 102.219 215.844L87.402 215.844ZM77.402 271.542C77.402 266.019 81.8792 261.542 87.402 261.542H102.219C107.742 261.542 112.219 266.019 112.219 271.542V286.359C112.219 291.882 107.742 296.359 102.219 296.359L87.402 296.359C81.8792 296.359 77.402 291.882 77.402 286.359L77.402 271.542Z",
    fill: "black"
  })),
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./src/save.js":
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
function save({
  attributes
}) {
  return `[stm-calc id='${attributes.calculator ? attributes.calculator.id : ''}']`;
}

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"cost-calculator-builder/calculator-selector","version":"0.1.0","title":"Cost Calculator Builder","category":"widgets","icon":"smiley","description":"Insert a calculator form you have created with Cost Calculator Builder.","example":{},"supports":{"html":false},"attributes":{"calculator":{"type":"object","default":{}}},"textdomain":"cost-calculator-builder","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkgutenberg_block"] = self["webpackChunkgutenberg_block"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map