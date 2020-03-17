import { html, render } from '../vendor/preact.js'
import Header from '../components/header.js'
import Footer from '../components/footer.js'

export default function Home() {
  return html`
<section>
  <${Header}>
    <a href="/about">About</a>
  <//>
  <h1>Progressive Bundling</h1>
  <${Footer}><//>
</section>
  `
}

if (typeof window !== 'undefined') {
  let content = document.getElementById('root')
  render(
    html`<${Home}><//>`,
    content,
    content.firstElementChild
  )
}
