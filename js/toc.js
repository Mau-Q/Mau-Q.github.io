(function () {
  'use strict';

  function init() {
    var container = document.getElementById('toc');
    if (!container) return;

    var content = document.querySelector('.post-md');
    if (!content) return;

    var levels = [];
    for (var level = 1; level <= 6; level++) {
      if (content.querySelectorAll('h' + level).length > 1) {
        levels.push('h' + level);
      }
    }
    if (levels.length === 0) return;

    var headings = Array.prototype.slice.call(
      content.querySelectorAll(levels.join(','))
    );
    if (headings.length === 0) return;

    container.classList.add('tocify');

    var rootList = document.createElement('ul');
    rootList.className = 'nav nav-list';

    var entries = [];
    var stack = [{ level: 0, list: rootList, item: null }];

    headings.forEach(function (heading) {
      var level = parseInt(heading.tagName.substring(1), 10);

      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      var parent = stack[stack.length - 1];
      var list = parent.list;
      if (parent.item) {
        list = parent.item.querySelector('ul');
        if (!list) {
          list = document.createElement('ul');
          list.className = 'nav nav-list';
          parent.item.appendChild(list);
        }
      }

      var item = document.createElement('li');
      var link = document.createElement('a');
      link.textContent = heading.textContent;
      link.href = heading.id ? '#' + encodeURIComponent(heading.id) : '#';
      link.addEventListener('click', function (event) {
        event.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (heading.id && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#' + encodeURIComponent(heading.id));
        }
      });
      item.appendChild(link);
      list.appendChild(item);

      entries.push({ heading: heading, item: item });
      stack.push({ level: level, list: list, item: item });
    });

    container.appendChild(rootList);

    var activeItem = null;

    function setActive(item) {
      if (item === activeItem) return;
      activeItem = item;

      Array.prototype.forEach.call(
        container.querySelectorAll('li.active'),
        function (li) {
          li.classList.remove('active');
        }
      );

      var node = item;
      while (node && node !== container) {
        if (node.tagName === 'LI') node.classList.add('active');
        node = node.parentElement;
      }
    }

    var ticking = false;

    function updateActive() {
      ticking = false;
      var offset = 110;
      var current = entries[0];
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].heading.getBoundingClientRect().top <= offset) {
          current = entries[i];
        } else {
          break;
        }
      }
      if (current) setActive(current.item);
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActive);
      }
    }, { passive: true });

    updateActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
