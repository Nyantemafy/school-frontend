import { Tooltip, Dropdown } from 'bootstrap';

// Initialisation des tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new Tooltip(tooltipTriggerEl);
});

// Initialisation des dropdowns
const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
dropdownElementList.map(function (dropdownToggleEl) {
  return new Dropdown(dropdownToggleEl);
});