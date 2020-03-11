module.exports = function error({ type, err }) {
  let body 
  if (type == 'css') {
    body = `/* css bundle error: ${ err.message }\n\n${ err.stack }\n\n*/`
  }
  else {
    body = `console.error('render error: ', "${err.message}")`
  }
  return {
    headers: {
      'content-type': type == 'css'? 'text/css' : 'text/javascript'
    }, 
    body
  }
}
