let inventory = require('@architect/inventory')
let path = require('path')

module.exports = async function getStaticBundle () {
  let base =  path.join(process.cwd(), '..', '..', '..')
  let { inv } = await inventory({ cwd: base  })
  let bundle = inv._project.arc.static.find(v => v[0] === 'bundle')
  let value =  Array.isArray(bundle) ? bundle[1] : 'dist'
  let folder = inv.static.folder
  return { value, path: path.join(base, folder, value) }
}
