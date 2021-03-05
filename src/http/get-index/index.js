let bundle = require('./get-bundle')

exports.handler = async function http () {

  // see if we have a bundle for this entry file
  let entry = await bundle('/index.js')

  // load the htmls
  let html = `<!doctype html>
<html>
<body>
heyo from the htmls
</body>
<script type=module src=${entry}></script>
</html>`

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: html
  }
}
