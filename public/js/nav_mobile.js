console.log('NAV_MOBILE.JS')
document.addEventListener('DOMContentLoaded', function () {
  (function () {
    'use strict';

    // Page cursors
    document.body.addEventListener('mousemove', function (event) {
      cursor.style.left = event.clientX + 'px';
      cursor.style.top = event.clientY + 'px';
      cursor2.style.left = event.clientX + 'px';
      cursor2.style.top = event.clientY + 'px';
      cursor3.style.left = event.clientX + 'px';
      cursor3.style.top = event.clientY + 'px';
    });

    var cursor = document.getElementById('cursor');
    var cursor2 = document.getElementById('cursor2');
    var cursor3 = document.getElementById('cursor3');

    function addHover() {
      cursor2.classList.add('hover');
      cursor3.classList.add('hover');
    }

    function removeHover() {
      cursor2.classList.remove('hover');
      cursor3.classList.remove('hover');
    }

    removeHover();

    var hoverTargets = document.querySelectorAll('.hover-target');

    for (var i = hoverTargets.length - 1; i >= 0; i--) {
      addHoverListeners(hoverTargets[i]);
    }

    function addHoverListeners(target) {
      target.addEventListener('mouseover', addHover);
      target.addEventListener('mouseout', removeHover);
    }

    // Navigation
    var app = (function () {
      var body = null;
      var menu = null;
      var menuItems = null;

      var init = function () {
        body = document.querySelector('body');
        menu = document.querySelector('.menu-icon');
        menuItems = document.querySelectorAll('.nav__list-item');
        applyListeners();
      };

      var applyListeners = function () {
        menu.addEventListener('click', function () {
          toggleClass(body, 'nav-active');
        });
      };

      var toggleClass = function (element, stringClass) {
        if (element.classList.contains(stringClass))
          element.classList.remove(stringClass);
        else element.classList.add(stringClass);
      };

      init();
    })();
  })();
});
