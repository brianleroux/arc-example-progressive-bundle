import { html } from '../vendor/preact.js'

export default function Footer(props) {
  props = props || {}
  return html`
<footer ...${props}></footer>
  `
}
