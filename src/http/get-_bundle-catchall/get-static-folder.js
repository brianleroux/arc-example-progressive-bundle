let inventory = require('@architect/inventory')
let path = require('path')

/** get absolute path to static folder */
module.exports = async function getStaticFolder () {
  let base =  path.join(process.cwd(), '..', '..', '..')
  let { inv } = await inventory({ cwd: base  })
  return path.join(base, inv.static.folder)
}
