const { get } = require('@begin/data')

module.exports = async function lookup(name) {

  let debug = process.env.DEBUG
  let entry = `/modules/${ name }`

  let cache = await get({
    table: 'module-cache',
    key: name
  })

  if (!debug && cache) {
    entry = `/_static/${ cache.file }`
  }

  return entry
}
