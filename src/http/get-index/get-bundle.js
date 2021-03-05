let inventory = require('@architect/inventory')
let path = require('path')
let fs = require('fs')
let aws = require('aws-sdk')

// ask s3 if it has the entry file metadata value _bundle
module.exports = async function bundled (value) {

  let s3 = new aws.S3
  let Bucket = process.env.ARC_STATIC_BUCKET
  let Key = value.substring(1)

  try {
    if (process.env.NODE_ENV === 'testing') {
      let folder = await getStaticFolder()
      let manifestBase = path.join(folder, 'dist')
      let manifestPath = path.join(manifestBase, 'manifest.json')
      let exists = fs.existsSync(manifestPath)
      if (exists) {
        let manifest = JSON.parse(fs.readFileSync(manifestPath).toString())
        if (manifest[value]) {
          return manifest[value]
        }
      }
    }
    else {
      let result = await s3.headObject({ Bucket, Key }).promise()
      if (result.Metadata._bundle) {
        return result.Metadata._bundle
      }
    }
  }
  catch (e) {
    console.error(e)
  }

  return `/_bundle${value}`
}

/** get absolute path to static folder */
async function getStaticFolder () {
  let base =  path.join(process.cwd(), '..', '..', '..')
  let { inv } = await inventory({ cwd: base  })
  return path.join(base, inv.static.folder)
}
