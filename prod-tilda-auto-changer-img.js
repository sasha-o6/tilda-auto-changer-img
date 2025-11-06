function panel__getControlField(e = 'img', t = !1) {
  return document.querySelector(`[${t ? 'data-sbs-prop-field' : 'data-control-field'}="${e}"]`);
}

tn_uploadImageToTilda(imgUrl, e);

// test data
// _ - figma img url
// o - [data-field-bgimg-value*='figma-alpha'] id
// n - 'bgimg'
// https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/72e7155a-40d9-4467-9e1d-df88e81b2e41 {originalUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/72e7155a-40d9-4467-9e1d-df88e81b2e41', name: '72e7155a-40d9-4467-9.png', paramName: 'file', size: 1085, type: 'image/png', …} 1739625473120 bgimg

// custom function
const allElements = [];
const errorElements = [];
const bgimgAttrName = 'data-field-bgimg-value';
let interval;
let counter = 0;
document.querySelectorAll("[data-field-bgimg-value*='figma-alpha']").forEach((el) => allElements.push(el));

changeImg(allElements[0]);

document.querySelectorAll("[data-field-bgimg-value*='figma-alpha']").forEach((el) => {
  changeImg(el);
});

// var clickEvent = document.createEvent('MouseEvents');
// clickEvent.initEvent('dblclick', true, true);

const changeImg = (elGet) => {
  // clickOnElement(elGet);

  // if (!elGet.getAttribute('data-field-bgimg-value')) clickOnElement(elGet);

  const n = 'bgimg';
  // const el = elGet.getAttribute('data-field-bgimg-value') ? elGet : elGet.querySelector('');
  const el = elGet;

  const attr = el.getAttribute(bgimgAttrName);
  const g = document.querySelector(`.tn-settings [name=${n}]`);

  const c = el;

  // const l = panel__getControlField(n);
  // const v = l.querySelector('.sui-file-warning');

  tn_uploadImageToTilda(attr, (e) => {
    console.log('el, e: ', el, e);

    // if (!e.error) {
    //   (g.value = e.cdnUrl),
    //     1 < e.width && elem__setFieldValue(el, 'filewidth', e.width, '', '', window.tn.topResolution),
    //     1 < e.height && elem__setFieldValue(el, 'fileheight', e.height, '', '', window.tn.topResolution),
    //     // g.dispatchEvent(tn_emitEvent('change')),
    //     elem__emptyField(el, 'amazonsrc'),
    //     tn_updateOutlineDescription(),
    //     c();
    // }
    // // tn_setElemCSS(v, {
    // //   display: 'none',
    // // });
    // tn_set_lastChanges();

    if (!e.error) {
      el.setAttribute(bgimgAttrName, e.cdnUrl);

      const child = el.querySelector("[style*='figma-alpha']");
      child && (child.style.cssText += `background-image: url(${e.cdnUrl});`);
    }

    // console.log('e: ', el, e);

    // // counter++;
    // // if (e?.error) errorElements.push(elGet);
  });
};

// const clickOnElement = (elGet) => {
//   events__handlers__onClick({ currentTarget: elGet, target: elGet });

//   setTimeout(() => {
//     if (!panel__getControlField('bgimg')?.querySelector('.sui-file-upload'))
//       events__handlers__onGroupDoubleClick({ currentTarget: elGet, target: elGet, stopPropagation: () => {} });

//     if (!panel__getControlField('bgimg')?.querySelector('.sui-file-upload')) clickOnElement(elGet);

//     console.log(
//       "!panel__getControlField('bgimg')?.querySelector('.sui-file-warning'): ",
//       !panel__getControlField('bgimg')?.querySelector('.sui-file-warning'),
//       panel__getControlField('bgimg')?.querySelector('.sui-file-warning'),
//     );
//   }, 0);
// };

// origin

tn_uploadImageToTilda(_, (e) => {
  e.error
    ? (elem__setFieldValue(c, 'uploaderror', 'y'),
      tn_setElemCSS(S, {
        display: 'block',
      }))
    : ((g.value = e.cdnUrl),
      1 < e.width && elem__setFieldValue(c, 'filewidth', e.width, '', '', window.tn.topResolution),
      1 < e.height && elem__setFieldValue(c, 'fileheight', e.height, '', '', window.tn.topResolution),
      g.dispatchEvent(tn_emitEvent('change')),
      elem__emptyField(c, 'amazonsrc'),
      tn_updateOutlineDescription(),
      figma__checkAmazonImages(),
      tn_setElemCSS(v, {
        display: 'none',
      })),
    tn_set_lastChanges();
});

function tn_uploadImageToTilda(e, i) {
  fetch('https://upload.tildacdn.com/api/upload/', {
    method: 'POST',
    body: tn__createFormData({
      url: e,
      publickey: Tildaupload_PUBLICKEY,
      uploadkey: Tildaupload_UPLOADKEY || '',
    }),
  }).then((e) => {
    e.json().then((e) => {
      var t;
      e && 0 < e.result.length ? ((t = e.result[0]), i(t)) : tn__alert('Error. ' + e.error);
    });
  });
}
