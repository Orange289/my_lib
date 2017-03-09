var d = document;
var jsCookie = require('js-cookie');

document.addEventListener('DOMContentLoaded', function () {
  let default_selectors = d.querySelectorAll('.js_ghostGridHolder');
  for (let i = 0; i < default_selectors.length; i++) {
    showGrid(default_selectors[i], 12);
  }

  if (default_selectors.length) {
    let gridToggle = d.createElement('span');
    gridToggle.className = 'ghost-grid-toggle';

    if (JSON.parse(jsCookie.get('KDX_Tools_Grid_Opened') || 'false')) {
      for (let i = 0; i < default_selectors.length; i++) {
        toggleGrid(default_selectors[i]);
      }
      gridToggle.className = 'ghost-grid-toggle activated';
    }

    gridToggle.addEventListener('click', function () {
      for (let i = 0; i < default_selectors.length; i++) {
        toggleGrid(default_selectors[i]);
      }
      jsCookie.set('KDX_Tools_Grid_Opened', !JSON.parse(jsCookie.get('KDX_Tools_Grid_Opened') || 'false'), {expires: 1});
      gridToggle.className = gridToggle.className === 'ghost-grid-toggle' ? 'ghost-grid-toggle activated' : 'ghost-grid-toggle';
    })
  }

  function showGrid(el, columms = 12) {
    let element = el || document.body;
    let grid = d.createElement('div');
    let rootfz = parseFloat(window.getComputedStyle(d.documentElement).fontSize);
    grid.className = 'ghost-grid';
    grid.innerHTML = '<div class="gridcontainer"><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div><div class="grid_1"><div class="ghost-grid__inner"></div></div></div>';
    element.style.position = window.getComputedStyle(element).getPropertyValue("position") === 'static' ? 'relative' : '';
    element.insertBefore(grid, element.firstChild);
    grid.style.width = (element.offsetWidth / rootfz) + 'rem';
    window.addEventListener('resize', function () {
      grid.style.width = (element.offsetWidth / rootfz) + 'rem';
    })
  }

  function toggleGrid(el) {
    el.style.visibility = !el.style.visibility ? 'hidden' : '';
  }
});
