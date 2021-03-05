let rollup = require('rollup')
let aws = require('aws-sdk')
let path = require('path')
let crypto = require('crypto')
let sync = require('./sync')
let getDist = require('../get-static-bundle')

/** implement progressive bundle with s3 */
module.exports = async function _s3 ({ file, _bundle }) {

  // read the file metadata from s3
  // if the key _bundle exists; use it!
  // fresh deploys remove _bundle key from new entry files (auto invalidating)
  if (_bundle)
    return _bundle

  let Bucket = process.env.ARC_STATIC_BUCKET
  let dist = await getDist()

  // the key _bundle does not exist so we need ALL the files to bundle..
  console.time('sync')
  await sync({ Bucket })
  console.timeEnd('sync')

  // bundle
  console.time('bundle')
  let input = path.join('/tmp', file)
  let bundle = await rollup.rollup({ input })
  let bundled = await bundle.generate({ format: 'esm' })
  let source = bundled.output[0].code
  console.timeEnd('bundle')

  // fingerprint
  console.time('fingerprint')
  let hash = crypto.createHash('sha1')
  hash.update(source)
  let sha = hash.digest('hex').substr(0, 7)
  let parts = file.split('/')
  let last = parts.pop()
  parts.unshift(dist.value)
  let [ filename, extension ] = last.split('.')
  let fingerprint = `${parts.filter(Boolean).join('/')}/${filename}-${sha}.${extension}`
  _bundle = `/_static/${fingerprint}`
  console.timeEnd('fingerprint')

  console.time('write')
  let s3 = new aws.S3
  await Promise.all([
    // write bundled file to s3://bucket/dist
    s3.putObject({
      Bucket,
      Key: fingerprint,
      ACL: 'public-read',
      ContentType: 'application/javascript',
      CacheControl: 'max-age=315360000',
      Body: source
    }).promise(),
    // update the metadata to orig file on s3
    s3.putObject({
      Bucket,
      Key: file.substring(1),
      ContentType: 'application/javascript',
      Metadata: { _bundle }
    }).promise(),
  ])
  console.timeEnd('write')

  return _bundle
}
