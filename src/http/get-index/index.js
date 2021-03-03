let aws = require('aws-sdk')

// ask s3 if it has the entry file metadata value _bundle
async function bundled (value) {
 
  let s3 = new aws.S3
  let Bucket = process.env.ARC_STATIC_BUCKET
  let Key = value.substring(1)
  try {
    if (process.env.NODE_ENV === 'testing') {
    // look at public/dist/manfiest.json
      throw Error('local lookup of value not implemented') 
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

  return `/_bundle${ value }`
}

exports.handler = async function http () {
  let entry = await bundled('/index.js')
  let html = `<doctype html>
<html>
<body>
heyo from the htmls
</body>
<script type=module src=${ entry }></script>
</html>`
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: html
  }
}
