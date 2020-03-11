const postcss = require('postcss')
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const cssnano  = require('cssnano')
const tailwindcss = require('tailwindcss')

module.exports = async function bundle(pathToFile) {

  console.time('bundle-css')
  let raw = fs.readFileSync(pathToFile)
  let args = { from: pathToFile }
  let plugins = process.env.NODE_ENV === 'production'? [
    precss,
    tailwindcss,
    autoprefixer,
    cssnano,
  ] : [tailwindcss]
  let result = await postcss(plugins).process(raw, args)
  let source = result.css
  console.timeEnd('bundle-css')

  // fingerprint it
  console.time('fingerprint-css') 
  let hash = crypto.createHash('sha1')
  hash.update(Buffer.from(source))
  let sha = hash.digest('hex').substr(0, 7)
  let fingerprint = pathToFile.split('/').slice(0).reverse().shift().replace('.css', `-${ sha }.css`) 
  console.timeEnd('fingerprint-css') 

  // write local when running local
  console.time('write-css') 
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
      ContentType: 'text/css; charset=UTF-8',
      CacheControl: 'max-age=315360000',
    }).promise()
  }
  console.timeEnd('write-css') 
   
  return fingerprint
}
