import home from './pages/home.js'
import about from './pages/about.js'
import contact from './pages/contact.js'


if (typeof window != 'undefined') {
  ;(async function main() {
    let main = document.getElementsByTagName('main')[0]
    main.innerHTML = await render({ path: window.location })
  })();
}

export async function render({ path }) {
  return 'hello world from the render function'
}
