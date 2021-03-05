let checkForFile = require('./check-for-file')
let bundler = require('./bundler')

/**
 * progressive bundle pattern!
 *
 * this Lambda accepts a request for a file on S3 and returns the bundled path
 */
exports.handler = async function http (req) {

  // catch a reference to our requested file
  // its worth noting we KNOW this variable exists because of IaC
  let requestedFile = req.requestContext.http.path.replace('/_bundle', '')

  // allow query param debug
  let debugging = !!(req.queryStringParameters && req.queryStringParameters.arc_waterfall)
  if (debugging) {
    return {
      statusCode: 303,
      headers: {
        location: `/_static/${requestedFile}`
      }
    }
  }

  try {
    // check the file exists at all in /public
    let exists = await checkForFile(requestedFile)
    if (exists === false) {
      return {
        statusCode: 404,
        body: `not found: ${requestedFile}`
      }
    }

    // get the bundled file and redirect to it
    let bundle = await bundler(exists)
    return {
      statusCode: 303,
      headers: {
        location: bundle
      }
    }
  }
  catch (e) {
    // fail loudly! when things break bubble the message!
    let err = JSON.stringify({ message: e.message, code: e.code, name: e.name, stack: e.stack })
    console.error(err)
    return {
      statusCode: 500,
      body: err
    }
  }
}
