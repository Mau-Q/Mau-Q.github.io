(function () {
  'use strict';

  var target = document.getElementById('targetSpan');
  if (!target) return;

  var fallback = document.querySelector('#hiddenHeaderContentArray span');
  if (fallback) target.textContent = fallback.textContent.trim();

  loadSolarTermPoem()
    .then(function (poem) {
      if (poem) {
        target.textContent = poem.term + ' · ' + poem.text;
        target.title = poem.author + '《' + poem.title + '》';
        target.setAttribute('data-solar-term', poem.term);
        return;
      }
      loadRandomPoem();
    })
    .catch(loadRandomPoem);

  function loadSolarTermPoem() {
    return fetch('/data/solar-terms.json', { cache: 'force-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('Unable to load solar-term data');
        return response.json();
      })
      .then(function (data) {
        var date = getChinaDateParts(new Date());
        var dates = data.years && data.years[String(date.year)];
        if (!Array.isArray(dates)) return null;

        var monthDay = pad(date.month) + '-' + pad(date.day);
        var index = dates.indexOf(monthDay);
        return index === -1 || !Array.isArray(data.poems) ? null : data.poems[index];
      });
  }

  function getChinaDateParts(date) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).formatToParts(date);
      var values = {};
      parts.forEach(function (part) {
        if (part.type !== 'literal') values[part.type] = Number(part.value);
      });
      return { year: values.year, month: values.month, day: values.day };
    } catch (error) {
      return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  // 诗词库在构建时被 scripts/poem-shards.js 拆成 10 片，平日只随机取一片（约 15K）。
  function loadRandomPoem() {
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
  }
})();
