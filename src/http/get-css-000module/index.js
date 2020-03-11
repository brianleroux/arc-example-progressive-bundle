const { join } = require('path')
const { existsSync } = require('fs')

const data = require('@begin/data')
const bundle = require('./bundle')
const redirect = require('./302')
const notfound = require('./404')
const fatal = require('./500')

exports.handler = async function http (req) {

  let table = 'module-cache'
  let key = req.pathParameters.module
  let ttl = (Date.now() / 1000) + (60 * 60 * 24 * 7) // 1 week from now

  try {
    // check the cache manifest
    let cache = await data.get({ table, key })

    // if the file is not found create it
    if (!cache) {

      // look for the entry file being requested                              vVVVv
      let pathToFile = join(__dirname, 'node_modules', '@architect', 'views', 'css', key)
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
