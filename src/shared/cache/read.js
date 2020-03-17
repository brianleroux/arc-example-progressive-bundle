const { join } = require('path')
const { existsSync } = require('fs')

const data = require('@begin/data')
const path = require('./path')

/** returns the cached module or false if it has not been cached; throws on non existent entry files */
module.exports = async function read({ name }) {

  // check the cache manifest
  let cache = await data.get({
    table: 'module-cache',
    key: name
  })

  // look for the entry file in the path
  if (cache == false && existsSync(path({ name })) == false)
      throw ReferenceError(`not_found: ${ name }`)

  return cache? cache.file : false
}
