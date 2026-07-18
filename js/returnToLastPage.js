(function () {
  'use strict';

  function init() {
    var button = document.querySelector('.return-to-last-progress-wrap');
    if (!button) return;

    var progressWrap = document.querySelector('.progress-wrap');
    if (progressWrap && progressWrap.classList.contains('active-progress')) {
      button.style.bottom = '100px';
    } else {
      button.style.bottom = '45px';
    }
    button.classList.add('active-progress');

    button.addEventListener('click', function (event) {
      event.preventDefault();
      window.history.back();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
