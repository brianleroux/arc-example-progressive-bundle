let sandbox = require('./sandbox')
let s3 = require('./s3')

/**
 * returns a _static path to a bundle
 *
 * eg. GET /foo/bar.js responds with 303: /_static/foo/bar-3sd.js
 */
module.exports = async function bundler (meta) {
  return process.env.NODE_ENV === 'testing' ? sandbox(meta) : s3(meta)
}
