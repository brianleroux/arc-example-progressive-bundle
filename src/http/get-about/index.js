const render = require('@architect/views/ssr')

/** plain 'ol lambda function */
exports.handler = async function http(req) {
  return {
    headers: { 
      'content-type': 'text/html; charset=utf8' 
    },
    body: await render('about')
  }
}
