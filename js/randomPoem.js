(function () {
  'use strict';

  var target = document.getElementById('targetSpan');
  if (!target) return;

  var fallback = document.querySelector('#hiddenHeaderContentArray span');
  if (fallback) target.textContent = fallback.textContent.trim();

  // 诗词库在构建时被 scripts/poem-shards.js 拆成 10 片，这里只随机取一片（约 15K）。
  var SHARD_COUNT = 10;
  var shard = Math.floor(Math.random() * SHARD_COUNT);

  fetch('/data/poems/' + shard + '.json', { cache: 'force-cache' })
    .then(function (response) {
      if (!response.ok) throw new Error('Unable to load local poetry data');
      return response.json();
    })
    .then(function (data) {
      var poems = Array.isArray(data.poems) ? data.poems : [];
      if (poems.length === 0) return;

      var previous = '';
      try {
        previous = sessionStorage.getItem('lastHomePoem') || '';
      } catch (error) {
        previous = '';
      }

      var index = Math.floor(Math.random() * poems.length);
      if (poems.length > 1 && poems[index].text === previous) {
        index = (index + 1 + Math.floor(Math.random() * (poems.length - 1))) % poems.length;
      }

      var poem = poems[index];
      target.textContent = poem.text;
      target.title = poem.author + '《' + poem.title + '》';

      try {
        sessionStorage.setItem('lastHomePoem', poem.text);
      } catch (error) {
        // Storage can be unavailable in privacy-restricted browsing modes.
      }
    })
    .catch(function () {
      // Keep the local fallback from _config.a4.yml when loading fails.
    });
})();
