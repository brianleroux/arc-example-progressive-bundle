const postcss = require('postcss')
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const cssnano  = require('cssnano')
const tailwindcss = require('tailwindcss')
const cache = require('@architect/shared/cache-file')

module.exports = async function bundle(name) {

  console.time('bundle-css')

  let raw = fs.readFileSync(name)
  let plugins = process.env.NODE_ENV === 'production'? [
    precss,
    tailwindcss,
    autoprefixer,
    cssnano,
  ] : [tailwindcss] // this is unbelievablely slow!

  let result = await postcss(plugins).process(raw, { from: name })
  let source = result.css

  console.timeEnd('bundle-css')

  return cache({ name, source })
}
