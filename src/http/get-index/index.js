exports.handler = async function http () {
  let html = `<doctype html>
<html>
heyo from the htmls
<script type=module src=/_bundle/index.js></script>
</html>`
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: html
  }
}
