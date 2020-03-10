const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const aws = require('aws-sdk')
const rollup = require('rollup')

module.exports = async function bundle(input) {

  // generate the bundle
  console.time('bundle') 
  let bundle = await rollup.rollup({ input })
  let bundled = await bundle.generate({ format: 'esm' })
  let source = bundled.output[0].code
  console.timeEnd('bundle') 

  // fingerprint it
  console.time('fingerprint') 
  let hash = crypto.createHash('sha1')
  hash.update(Buffer.from(source))
  let sha = hash.digest('hex').substr(0, 7)
  let fingerprint = input.split('/').slice(0).reverse().shift().replace('.js', `-${ sha }.js`) 
  console.timeEnd('fingerprint') 

  // write local when running local
  console.time('write') 
  if (process.env.NODE_ENV === 'testing') {
    let pathToPublic = path.join(__dirname, '..', '..', '..',  'public', fingerprint)
    fs.writeFileSync(pathToPublic, source)
  }
  else {
    // write to s3
    let s3 = new aws.S3
    let result = await s3.putObject({
      ACL: 'public-read',
      Bucket: process.env.ARC_STATIC_BUCKET,
      Key: `${ process.env.ARC_STATIC_FOLDER }/${ fingerprint }`,
      Body: source,
      ContentType: 'text/javascript; charset=UTF-8',
      CacheControl: 'max-age=315360000',
    }).promise()
  }
  console.timeEnd('write') 
   
  return fingerprint
}
