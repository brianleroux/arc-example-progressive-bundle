@app
arc-example-progressive-bundle

@static
# use public for local dev (added to .gitignore)
folder public

@http
# ?debug=1 to enable waterfall
get /            
get /js/:module
get /css/:module

# devtools
get /debug/:module
get /debug/:scope/:module
get /cache
post /cache

@tables
# use begin/data for the module cache
data
  scopeID *String
  dataID **String
  ttl TTL
