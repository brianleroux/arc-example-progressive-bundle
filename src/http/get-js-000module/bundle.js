const rollup = require('rollup')
const cache = require('@architect/shared/cache-file')

module.exports = async function bundle(name) {

  console.time('bundle') 

  let bundle = await rollup.rollup({ input: name })
  let bundled = await bundle.generate({ format: 'esm' })
  let source = bundled.output[0].code

  console.timeEnd('bundle')

  return cache({ name, source })
}
