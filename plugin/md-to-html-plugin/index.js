const { readFileSync } = require('fs');
const { resolve } = require('path')
const { compileHTML } = require('./compiler')

const INNER_MARK = '<-- !inner -->'

class MdToHtmlPlugin {
  constructor({ template, filename }) {

    if(!template) {
      throw Error('需要传template文件')
    }
    this.template = template;
    this.filename = filename ? filename : '1.md';
  }


  apply(compiler) {
    compiler.hooks.emit.tap('md-to-html-plugin', compilation => {
      const _assets = compilation.assets;
      const _mdContent = readFileSync(this.template, 'utf8');
      const _templateHtml = readFileSync(resolve(__dirname, './template.html'), 'utf8');
      const _mdList = _mdContent.split('\n');
      const _htmlStr = compileHTML(_mdList);


      console.log('_mdContent====', _mdContent)


      const _fileHtml = _templateHtml.replace(INNER_MARK,_htmlStr)


      _assets[this.filename]={
        source(){
          return _fileHtml
        },
        size(){
          return _fileHtml.length
        }
      }
    })
  }
}

module.exports = MdToHtmlPlugin;