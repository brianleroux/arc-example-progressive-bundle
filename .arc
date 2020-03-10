@app
arc-example-progressive-bundle

@static
folder public

@http
get /
get /js/:module

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
