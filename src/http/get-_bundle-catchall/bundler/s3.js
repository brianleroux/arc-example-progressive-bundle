//let esbuild = require('esbuild-linux-32')
let aws = require('aws-sdk')
let path = require('path')
let crypto = require('crypto')
let util = require('util')
let exec = util.promisify(require('child_process').exec)
let sync = require('./sync')

/** implement progressive bundle with s3 */
module.exports = async function _s3 ({ file, _bundle }) {

  // read the file metadata from s3
  // if the key _bundle exists; use it!
  // fresh deploys remove _bundle key from new entry files (auto invalidating)
  if (_bundle)
    return _bundle

  let Bucket = process.env.ARC_STATIC_BUCKET

  // the key _bundle does not exist so we need ALL the files to bundle..
  console.time('sync')
  await sync({ Bucket })
  console.timeEnd('sync')

  // bundle
  console.time('bundle')
  let bin = path.join(process.cwd(), 'bundler', 'esbuild-linux-32', 'bin', 'esbuild')
  const o = await exec(`${ bin } /tmp${ file } --bundle --outfile=/tmp/dist.js`)
  console.log('stdout:', o.stdout);
  console.error('stderr:', o.stderr);
  console.log(o)
  /*
  let filePath = path.join('/tmp', file)
  let source = esbuild.buildSync({
    entryPoints: [ filePath ],
    write: false,
    outdir: 'out',
  }).outputFiles[0].contents
  */
  console.timeEnd('bundle')

  // fingerprint
  console.time('fingerprint')
  let hash = crypto.createHash('sha1')
  let source = fs.readFileSync(`/tmp/dist.js`)
  hash.update(source)
  let sha = hash.digest('hex').substr(0, 7)
  let parts = file.split('/')
  let last = parts.pop()
  let [ filename, extension ] = last.split('.')
  let fingerprint = `dist/${ parts.join('/') }/${ filename }-${ sha }.${ extension }`
  _bundle = `/_static/${ fingerprint }`
  console.timeEnd('fingerprint')

  console.time('write')
  let s3 = new aws.S3
  await Promise.all([
    // write bundled file to s3://bucket/dist
    s3.putObject({
      Bucket,
      Key: fingerprint,
      Body: source
    }).promise(),
    // update the metadata to orig file on s3
    s3.copyObject({
      Bucket,
      Key: file,
      CopySource: file,
      Metadata: { _bundle }
    }).promise(),
  ])
  console.timeEnd('write')

  return _bundle
}
