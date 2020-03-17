require = require('esm')(module) // eslint-disable-line

const toString = require('preact-render-to-string')
const lookup = require('@architect/shared/cache/entry.js')
const { html } = require('@architect/views/vendor/preact.js')
const HTML = require('@architect/views/document/html.js').default

module.exports = async function render(page) {

  let entry = await lookup({ name: `pages/${ page }.js` })
  let Component = require(`@architect/views/pages/${ page }.js`).default // eslint-disable-line

  return HTML({
    children: toString(html`<${Component}><//>`),
    scripts: [ entry ]
  })
}
