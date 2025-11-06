// contentScript.js

// Слухаємо повідомлення від popup.html
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'UPLOAD_IMAGES') {
    // Запускаємо нашу логіку «підвантаження» зображень
    uploadImagesToTilda();
  }
});

// Прикладна функція, що буде імітувати «забирає картинки з Figma» і «завантажує» на Tilda
async function uploadImagesToTilda() {
  // 1. Знайдемо всі <img>, які ще «сидять» на Figma
  const figmaImages = document.querySelectorAll('img[src*="figma.com"]');

  if (!figmaImages.length) {
    alert('Не знайдено зображень з Figma у поточному проєкті.');
    return;
  }

  // 2. Далі *теоретично* можна виконати:
  // - або СИМУЛЮВАТИ клік: зайти в кожен елемент редактора Tilda,
  //   відкрити «налаштування» зображення, натиснути «Upload», «Replace» тощо.
  // - або напряму викликати внутрішній endpoint Tilda, якщо він існує і доступний.

  // Приклад псевдо-коду для імітації. Все залежить від структури DOM в редакторі:
  for (let i = 0; i < figmaImages.length; i++) {
    const img = figmaImages[i];

    try {
      // 2.1. Натискаємо на блок, який відповідає за зображення (псевдо)
      // Знайдемо, наприклад, найближчий контейнер .js-image-tool (вигадана назва)
      const imageBlock = img.closest('.js-image-tool');
      if (imageBlock) {
        // Емулюємо клік по ньому
        imageBlock.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // 2.2. Шукаємо кнопку "Replace image" або "Upload"
        const replaceBtn = imageBlock.querySelector('.js-replace-image');
        if (replaceBtn) {
          replaceBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }

        // 2.3. Тут, можливо, буде відкрито модальне вікно Tilda
        //      Доведеться шукати інпут для завантаження файлу або щось подібне.
        //      Усе це дуже залежить від того, як Tilda реалізовує вікно налаштувань.
      }

      // 2.4. Можна поставити штучну затримку, щоб редактор встиг відкрити вікно/завантажити
      await waitFor(1000);

      // Повторювати для кожного зображення
    } catch (e) {
      console.error('Помилка при заміні зображення:', e);
    }
  }

  // 3. Після циклу можна видати повідомлення про завершення
  alert('Спроба автоматичної заміни зображень завершена!');
}

// Допоміжна функція для примусової затримки
function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// .tn-figma-warning
