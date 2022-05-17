const { randomNum } = require("./utils");

const reg_mark = /^(.+?)\s/;
const reg_shap = /^\#/;
const reg_crossbar = /^\-/;
const reg_number = /^\d/;

function createTree(mdArr) {
  let _htmlPool = {};
  let _lastMark = "";
  let _key = "";

  mdArr.forEach((mdFragment) => {
    const matched = mdFragment.match(reg_mark);
    // console.log(mdFragment)
    console.log(mdFragment, matched);

    if (matched) {
      const mark = matched[1];
      const input = matched["input"];

      // 标题
      if (reg_shap.test(mark)) {
        const tag = `h${mark.length}`;
        const tagContent = input.replace(reg_mark, "");

        if (_lastMark === mark) {
          _htmlPool[`${tag}-${_key}`].tags = [
            ..._htmlPool[`${tag}-${_key}`].tags,
            `<${tag}>${tagContent}</${tag}>`,
          ];
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`${tag}-${_key}`] = {
            type: "single",
            tags: [`<${tag}>${tagContent}</${tag}>`],
          };
        }
      }

      // 无序列表
      if (reg_crossbar.test(mark)) {
        // console.log(matched)
        const tag = `li`;
        const tagContent = input.replace(reg_mark, "");

        if (_lastMark === mark) {
          _htmlPool[`ul-${_key}`].tags = [
            ..._htmlPool[`ul-${_key}`].tags,
            `<${tag}>${tagContent}</${tag}>`,
          ];
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`ul-${_key}`] = {
            type: "wrap",
            tags: [`<${tag}>${tagContent}</${tag}>`],
          };
        }
      }

      // 有序列表
      if (reg_number.test(mark)) {
        const tagContent = input.replace(reg_mark, "");
        const tag = `li`;
        if (reg_number.test(_lastMark)) {
          _htmlPool[`ol-${_key}`].tags = [
            ..._htmlPool[`ol-${_key}`].tags,
            `<${tag}>${tagContent}</${tag}>`,
          ];
        } else {
          // console.log(_lastMark,mark);
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`ol-${_key}`] = {
            type: "wrap",
            tags: [`<${tag}>${tagContent}</${tag}>`],
          };
        }
      }
    }
  });

  // console.log('_htmlPool-----', _htmlPool)
  return _htmlPool;
}

function compileHTML(_mdArr) {
  // console.log(_mdArr)
  const _htmlPool = createTree(_mdArr);
  // console.log(_htmlPool);
  let _htmlStr = "";
  let item;
  for (let k in _htmlPool) {
    // console.log(k, _htmlPool[k]);
    item = _htmlPool[k];

    if (item.type === "single") {
      item.tags.forEach((tag) => {
        _htmlStr += tag;
      });
    } else if (item.type === "wrap") {
      let _list = `<${k.split("-")[0]}>`;
      item.tags.forEach((tag) => {
        _list += tag;
      });
      _list += `</${k.split("-")[0]}>`;

      _htmlStr += _list;
    }
  }

  console.log(_htmlStr)
  return _htmlStr;
}

module.exports = {
  compileHTML,
};

/* 
{
  h1: {
    type: 'single',
    tags: ['<h1>这是标题1</h1>']
  },
  ul: {
    type: 'wrap',
    tags: [
      '<li>这是标题1</li>',
      '<li>这是标题1</li>',
      '<li>这是标题1</li>',
      '<li>这是标题1</li>'
    ]
  }
}


 */
