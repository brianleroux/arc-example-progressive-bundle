let aws = require('aws-sdk')
let path = require('path')
let fs = require('fs')
let getFolder = require('./get-static-folder')

/**
 * checks for file in static folder
 *
 * @typedef {Object} Result
 * @property {string} file - the requested file (eg. /foo.js)
 * @property {string?} _bundle - the bundled file path (eg. /foo-ea2.js)
 *
 * @returns {false | Result}
 */
module.exports = async function checkForFile (file) {
  if (process.env.NODE_ENV === 'testing') {
    // look for file in static folder on local disk
    let folder = await getFolder()
    return fs.existsSync(path.join(folder, file)) ? { file } : false
  }
  else {
    // look at live infa
    try {
      let s3 = new aws.S3
      let Bucket = process.env.ARC_STATIC_BUCKET
      let Key = file.substring(1)
      let meta = await s3.headObject({ Bucket, Key }).promise()
      // return the file and any metadata
      return { file, ...meta.Metadata }
    }
    catch (e) {
      if (e.code != 'NotFound') {
        console.log('err in check-for-file', e)
      }
      return false
    }
  }
}
