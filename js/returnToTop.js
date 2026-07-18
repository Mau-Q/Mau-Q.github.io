(function () {
  'use strict';

  function init() {
    var wrap = document.querySelector('.progress-wrap');
    var progressPath = document.querySelector('.progress-wrap path');
    if (!wrap || !progressPath) return;

    var returnToLast = document.querySelector('.return-to-last-progress-wrap');
    var pathLength = progressPath.getTotalLength();

    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();

    var offset = 50;

    function update() {
      var scroll = window.pageYOffset || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var progress = height > 0 ? pathLength - (scroll * pathLength / height) : pathLength;
      progressPath.style.strokeDashoffset = progress;

      if (scroll > offset) {
        if (returnToLast) returnToLast.style.bottom = '100px';
        wrap.classList.add('active-progress');
      } else {
        if (returnToLast) returnToLast.style.bottom = '45px';
        wrap.classList.remove('active-progress');
      }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });

    wrap.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var targetNode = document.querySelector('.lg-container');
    if (!targetNode) return;

    var observer = new MutationObserver(function (mutationsList) {
      mutationsList.forEach(function (mutation) {
        if (mutation.attributeName !== 'class') return;
        var isShown = mutation.target.classList.contains('lg-show');
        var display = isShown ? 'none' : '';
        if (returnToLast) returnToLast.style.display = display;
        wrap.style.display = display;
      });
    });

    observer.observe(targetNode, { attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
