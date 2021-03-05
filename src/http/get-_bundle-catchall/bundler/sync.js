let aws = require('aws-sdk')
let fs = require('fs')
let getDist = require('../get-static-bundle')

module.exports = sync

/**
 * downloads the entire static bucket minus the 'dist/' key to /tmp
 *
 * @param {object} options
 * @param {string} options.Bucket
 * @param {string} options.ContinuationToken
 */
async function sync (params) {

  let s3 = new aws.S3
  let Bucket = params.Bucket
  let dist = await getDist()
  let result = await s3.listObjectsV2(params).promise()

  // read from s3 and write to /tmp
  for (let { Key } of result.Contents) {
    if (Key.startsWith(dist.value) === false) {
      let result = await s3.getObject({ Bucket, Key }).promise()
      fs.writeFileSync(`/tmp/${Key}`, result.Body)
    }
  }

  // if neccessary grab more files
  if (result.IsTruncated) {
    let ContinuationToken = result.NextContinuationToken
    await sync({ Bucket, ContinuationToken })
  }
}
