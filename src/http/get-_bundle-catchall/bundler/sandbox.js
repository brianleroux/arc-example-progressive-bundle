let rollup = require('rollup')
let crypto = require('crypto')
let path = require('path')
let fs = require('fs')

let getFolder = require('../get-static-folder')
let getDist = require('../get-static-bundle')

/** implements progressive bundle locally */
module.exports = async function sandbox ({ file }) {

  // ensure public/_bundle/manifest.json
  let dist = await getDist()
  let folder = await getFolder()
  let manifestBase = dist.path
  let manifestPath = path.join(manifestBase, 'manifest.json')
  let exists = fs.existsSync(manifestPath)
  if (exists === false) {
    fs.mkdirSync(manifestBase)
    fs.writeFileSync(manifestPath, JSON.stringify({}))
  }

  // check for cached value
  let manifest = JSON.parse(fs.readFileSync(manifestPath).toString())
  if (!!manifest[file] === false) {

    // bundle
    console.time('bundle')
    let input = path.join(folder, file)
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
    let [ filename, extension ] = last.split('.')
    let fingerprint = `${parts.join('/')}/${filename}-${sha}.${extension}`
    console.timeEnd('fingerprint')

    // write file and update manifest.json
    console.time('write')
    manifest[file] = `/_static/${dist.value}${fingerprint}`
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))
    fs.writeFileSync(path.join(dist.path, fingerprint), source)
    console.timeEnd('write')
  }

  return manifest[file]
}
