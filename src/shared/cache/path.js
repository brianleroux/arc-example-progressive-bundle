const path = require('path')

/* get the path to a module in views */
module.exports = function cachePath({ name }) {
  return path.join(__dirname, '..', '..', 'views', name)
}
