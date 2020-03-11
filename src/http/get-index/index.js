// workaround esm for now..
require = require('esm')(module)

const { get } = require('@begin/data')
const { render } = require('@architect/views/js/app')

/** plain 'ol lambda function */
exports.handler = async function http(req) {

  let table = 'module-cache'
  let entry = { js: 'app.js', css: 'index.css' }
  let isCSS = c=> c.key == entry.css
  let isJS = c=> c.key == entry.js

  // query the cache for the css/js path
  let cache = await get([{ table, key: entry.js }, { table, key: entry.css }])
  let css = cache.some(isCSS)? `/_static/${ cache.find(isCSS).file }` : `/css/${ entry.css }`
  let js = cache.some(isJS)? `/_static/${ cache.find(isJS).file }` : `/js/${ entry.js }`

  // fallback to waterfall
  let debug = (req.queryStringParameters && !!req.queryStringParameters.debug)
  if (debug) {
    css = `/debug/${ entry.css }`
    js = `/debug/${ entry.js }`
  }

  // render the app html
  let html = await render(req)

  // respond to the browser with the doc
  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf8' },
    body: `<!doctype html>
<html>
<head>
<meta name=viewport content=width=device-width,initial-scale=1>
<link type=text/css rel=stylesheet href=${ css }>
</head>
<body>
<main>${ html }</main>
<script type=module src=${ js }></script>
</body>
</html>`
  }
}
