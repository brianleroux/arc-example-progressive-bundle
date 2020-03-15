const read = require('@architect/shared/cache-read')
const { get } = require('@begin/data')
const bundle = require('./bundle')
const waterfall = require('./200')
const redirect = require('./302')
const notfound = require('./404')
const fatal = require('./500')

exports.handler = async function http(req) {
  let type = req.pathParameters.type
  let module = req.pathParameters.module
  let name = `${type}/${module}`
  let debug = process.env.DEBUG
  /*
  let table = 'module-cache'
  let theModule = c => c.key === name
  // query the cache
  let cache = await get({ table, key:name })
  console.log('CACHE: ', cache)
  let js = cache.some(theModule)
    ? `/_static/${ cache.find(theModule).file }`
    : `/module/${ key }`
  console.log('JS: ', js)
  */

  try {
    if (debug) {
      return waterfall(req)
    } else {
      // check the cache manifest
      let file = await read({ name })
      // if the file is not found bundle it
      if (!file) {
        file = await bundle({ name })
      }
      // redirect to the file
      return redirect(`/_static/${ file }`)
    }
  } catch(err) {
    if (err.name.startsWith('not_found')) {
      return notfound(name)
    } else {
      return fatal(err)
    }
  }
}
