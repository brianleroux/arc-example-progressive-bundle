@app
arc-example-progressive-bundle

@static
# use public for local dev (added to .gitignore)
folder public

@http
get /
get /about
get /modules/:type/:module

# devtools
get /cache
post /cache

@tables
# use begin/data for the module cache
data
  scopeID *String
  dataID **String
  ttl TTL
