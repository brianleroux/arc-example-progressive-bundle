module.exports = function notfound(file) {
  return {
    //statusCode: 404,
    headers: {
      'content-type': 'text/css'
    },
    body: `/* not found: ${ file } */`
  }
}

