const path = require('path')

module.exports = function cachePath({ name }) {
  let extension = name.split('/').slice(0).reverse().shift().split('.')[1]
  return path.join(__dirname, '..', 'views', extension, name)
}
