module.exports = function notfound({ type, key }) {
  let body
  if (type == 'css') {
    body = `/* not found: ${ key } */`
  }
  else {
    body = `console.error('404 not found: ', "${ key }")`
  }
  return {
    headers: {
      'content-type': type == 'css'? 'text/css' : 'text/javascript'
    },
  }
}
