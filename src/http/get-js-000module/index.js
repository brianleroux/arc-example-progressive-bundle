let { join } = require('path')
let { existsSync } = require('fs')

let data = require('@begin/data')
let bundle = require('./bundle')
let redirect = require('./302')
let notfound = require('./404')
let fatal = require('./500')

exports.handler = async function http(req) {

  let table = 'module-cache'
  let key = req.pathParameters.module
  let ttl = (Date.now() / 1000) + (60 * 60 * 24 * 7) // 1 week from now

  try {
    // check the cache manifest
    let cache = await data.get({ table, key })

    // if the file is not found create it
    if (!cache) {

      // look for the entry file being requested
      let pathToFile = join(__dirname, 'node_modules', '@architect', 'views', key)
      if (existsSync(pathToFile) === false)
        return notfound(key)

      // bundle to s3
      let file = await bundle(pathToFile)

      // save the name in the manifest
      cache = await data.set({ table, key, file, ttl })
    }

    // redirect to the file we just wrote
    return redirect(`/_static/${ cache.file }`)
  }
  catch(err) {
    return fatal(err)
  }
}
