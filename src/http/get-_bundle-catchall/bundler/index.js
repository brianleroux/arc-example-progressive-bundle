let sandbox = require('./sandbox')
let s3 = require('./s3')

/* returns a _static path to a file (eg. requesting /foo/bar.js returns /_static/foo/bar-3sd.js) */
module.exports = async function bundler (meta) {

  // waterfall / debug flow
  if (process.env.ARC_BUNDLE === 'waterfall')
    return `/_static/${meta.file}`

  // otherwise return file from sandbox or s3
  return process.env.NODE_ENV === 'testing' ? sandbox(meta) : s3(meta)
}
