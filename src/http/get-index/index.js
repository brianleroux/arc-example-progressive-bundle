let html = `<!doctype html>
<html>
<head>
<meta name=viewport content=width=device-width,initial-scale=1>
<link href=https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css rel=stylesheet type=text/css>
</head>
<body>
<main>loading...</main>
<script type=module src=/js/app.js></script>
</body>
</html>`

exports.handler = async function http(req) {
  return {
    headers: { 
      'content-type': 'text/html; charset=utf8' 
    },
    body: html
  }
}
