require = require('esm')(module)
const HTML = require('@architect/views/document/html.js').default
const renderToString = require('preact-render-to-string')
const { html } = require('@architect/views/modules/vendor/preact.js')
const About = require('@architect/views/modules/pages/about.js').default

/** plain 'ol lambda function */
exports.handler = async function http(req) {
  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf8' },
    body: HTML({
        children: renderToString(
          html`<${About}><//>`
        ),
        scripts: ['/modules/entry/about.js']
      }
    )
  }
}

