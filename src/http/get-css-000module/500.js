module.exports = function error(err) {
  return {
    //statusCode: 500,
    headers: {
      'content-type': 'text/css'
    }, 
    body: `/* css bundle error: ${ err.message }\n\n${ err.stack }\n\n*/`
  }
}

