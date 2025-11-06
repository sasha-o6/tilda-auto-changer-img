// content.js
function injectScript(file_path) {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL(file_path);
  s.onload = () => s.remove(); // при бажанні видалити тег після завантаження
  (document.head || document.documentElement).appendChild(s);
}

injectScript('injected.js'); // injected.js – твій основний скрипт
