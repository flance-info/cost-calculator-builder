/****************** Fields ******************/
import total from './cost-total';
import checkbox from './cost-checkbox';
import date_picker from './cost-date-picker/';
import time_picker from './cost-time-picker';
import drop_down from './cost-drop-down';
import dropDownImg from './cost-drop-down-with-image';
import html from './cost-html';
import line from './cost-line';
import multi_range from './cost-multi-range';
import radio from './cost-radio';
import range from './cost-range';
import text from './cost-text';
import toggle from './cost-toggle';
import quantity from './cost-quantity';
import file_upload from './cost-file-upload';
import radioWithImg from './cost-radio-with-image';
import checkboxWithImg from './cost-checkbox-with-image';
import repeater from './cost-repeater';
import group from './cost-group';

export default [
  { content: total, template_name: 'total', component_name: 'cost-total' },
  {
    content: quantity,
    template_name: 'quantity',
    component_name: 'cost-quantity',
  },
  {
    content: checkbox,
    template_name: 'checkbox',
    component_name: 'cost-checkbox',
  },
  {
    content: date_picker,
    template_name: 'date-picker',
    component_name: 'date-picker',
  },
  {
    content: time_picker,
    template_name: 'time-picker',
    component_name: 'time-picker',
  },
  {
    content: drop_down,
    template_name: 'drop-down',
    component_name: 'cost-drop-down',
  },
  {
    content: dropDownImg,
    template_name: 'drop-down-with-image',
    component_name: 'cost-drop-down-with-image',
  },
  { content: html, template_name: 'html', component_name: 'cost-html' },
  { content: line, template_name: 'line', component_name: 'cost-line' },
  {
    content: multi_range,
    template_name: 'multi-range',
    component_name: 'cost-multi-range',
  },
  {
    content: radio,
    template_name: 'radio-button',
    component_name: 'cost-radio',
  },
  {
    content: range,
    template_name: 'range-button',
    component_name: 'cost-range',
  },
  { content: text, template_name: 'text-area', component_name: 'cost-text' },
  { content: toggle, template_name: 'toggle', component_name: 'cost-toggle' },
  {
    content: file_upload,
    template_name: 'file-upload',
    component_name: 'cost-file-upload',
  },
  {
    content: radioWithImg,
    template_name: 'radio-with-image',
    component_name: 'cost-radio-with-image',
  },
  {
    content: checkboxWithImg,
    template_name: 'checkbox-with-image',
    component_name: 'cost-checkbox-with-image',
  },
  {
    content: repeater,
    template_name: 'repeater',
    component_name: 'cost-repeater',
  },
  {
    content: group,
    template_name: 'group',
    component_name: 'cost-group',
  },
];
