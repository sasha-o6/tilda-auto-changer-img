let allImagesElements = [];
const errorElements = [];

const uploadAllImages = () => {
  allImagesElements = Array.from(document.querySelectorAll("[data-field-bgimg-value*='figma-alpha']"));

  Promise.all(allImagesElements.map((el, index) => changeImg(el, index, allImagesElements.length)))
    .then(() => {
      if (errorElements.length > 0) {
        onErrorImages.addErrorButton();
      } else {
        setTimeout(() => {
          ab__saveToDataBase('');
          alert('Importing is finished successfully. Thank you!');
          // alert('Please reload the page and make sure that all is okay.');
        }, 0);
      }
    })
    .catch((err) => alert('Unspecified error. Contact the plugin developer.'))
    .finally(() => document.querySelector('#uploadAllImagesBtn')?.remove());
};

const bgimgAttrName = 'data-field-bgimg-value';

const changeImg = (el, index, allImagesElementsLength) => {
  return new Promise((resolve, reject) => {
    const attr = el.getAttribute(bgimgAttrName);

    tn_uploadImageToTilda(attr, (e) => {
      if (!e.error) {
        el.setAttribute(bgimgAttrName, e.cdnUrl);
        elem__setFieldValue(el, 'bgimg', e.cdnUrl);

        const child = el.querySelector("[style*='figma-alpha']");
        if (child) {
          child.style.cssText += `background-image: url(${e.cdnUrl});`;
        }

        const attr = el.getAttribute('data-fields');
        const array = attr.split(',');
        const filtered = array.filter((word) => word != 'amazonsrc');

        el.setAttribute('data-fields', filtered.join(','));
        elem__emptyField(el, 'amazonsrc');

        el.removeAttribute('data-field-amazonsrc-value');
        tn_updateOutlineDescription();
        figma__checkAmazonImages();
        tn_set_lastChanges();
      } else {
        console.error('error: ', e.error);
        errorElements.push(el);
      }
      resolve(e);
    });
  });
};

const onErrorImages = {
  addErrorButton: () => {
    const button = document.createElement('button');
    button.innerText = `[${errorElements.length}] Next ->`;
    button.id = 'nextImagesBtn';

    button.style.cssText = `padding-top: 2px; color: #fff; text-align: center; line-height: 38px; text-transform: uppercase; font-weight: 400; font-size: 13px; border-radius: 50px; background-color: #f06847; border: none; white-space: nowrap;`;

    button.addEventListener('click', () => {
      if (errorElements?.length > 0) {
        clickOnElement(errorElements[0]);
        errorElements.shift();
        button.innerText = `[${errorElements.length}] Next ->`;
      } else {
        button.remove();
        ab__saveToDataBase('');
        // alert("Please click 'Save' button.");
      }
    });

    document.querySelector('.tn-mainmenu__leftside')?.appendChild(button);
  },
};

// ==========================================

const addButton = () => {
  // Перевіряємо, чи кнопка вже додана, щоб уникнути дублювання
  if (document.getElementById('uploadAllImagesBtn')) {
    console.error('button already have');
    return;
  }

  // if (!(document.querySelectorAll("[data-field-bgimg-value*='figma-alpha']").length > 0)) {
  //   // console.error("element didn't find");
  //   // return;
  // }

  const button = document.createElement('button');
  button.innerText = 'Upload Images';
  button.id = 'uploadAllImagesBtn';
  button.style.cssText = `padding: 0 12px; cursor: pointer; margin-left: 10px; color: #fff; text-align: center; line-height: 38px; font-weight: 400; font-size: 13px; border-radius: 50px; background-color: #f06847; border: none; white-space: nowrap;`;

  button.addEventListener('click', uploadAllImages);
  button.addEventListener('click', () => {
    button.disabled = true;
    button.style.cssText += 'pointer-events: none;';
    button.textContent = 'Loading...';
  });

  if (!document.querySelector('.tn-mainmenu__leftside')) {
    console.error("don't have .tn-mainmenu__leftside element");
    button.style.position = 'fixed';
    button.style.left = '12px';
    button.style.bottom = '12px';
    button.style.zIndex = '1001';
    document.querySelector('body')?.appendChild(button);
  } else {
    document.querySelector('.tn-mainmenu__leftside')?.appendChild(button);
  }
};

if (
  (window.location.host == 'tilda.cc' || window.location.host == 'tilda.ru') &&
  window.location.href.includes('/zero/')
  // &&
  // document.querySelectorAll("[data-field-bgimg-value*='figma-alpha']").length > 0
) {
  // Додаємо кнопку після завантаження сторінки
  document.addEventListener('DOMContentLoaded', addButton);
  addButton();
}

// ==========================================

const clickOnElement = (elGet) => {
  events__handlers__onClick({ currentTarget: elGet, target: elGet });

  setTimeout(() => {
    if (!panel__getControlField('bgimg')?.querySelector('.sui-file-upload'))
      events__handlers__onGroupDoubleClick({ currentTarget: elGet, target: elGet, stopPropagation: () => {} });

    if (!panel__getControlField('bgimg')?.querySelector('.sui-file-upload')) clickOnElement(elGet);
  }, 0);
};
