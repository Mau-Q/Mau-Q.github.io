const highlightParam = 'highlight';
const query = new URLSearchParams(window.location.search);

if (query.has(highlightParam)) {
  try {
    await import('/pagefind/pagefind-highlight.js');
    new window.PagefindHighlight({
      highlightParam,
      markContext: '[data-pagefind-body]',
      addStyles: false
    });
  } catch (error) {
    console.warn('Pagefind highlight could not be loaded.', error);
  }
}
