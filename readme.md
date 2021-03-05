# progressive bundle demo

Automatically bundle esmodules in `/public`.

## Usage proposal    

Example `app.arc`; enable bundling by declaring the `bundle` folder for build output:

```arc
@app
myapp

@static
bundle dist # currently in this app a default value; but think if we build in this would be the toggle 'on'
entry index.js # pre bundle file(s) at deploy time for max speeds
```

# todo

- [ ] merge capability maybe instead
- [ ] auto ignore bundle folder in deploy 
- [ ] prebundle macro discuss
- [ ] add `src/http/get-index/get-bundle` to `@architect/functions`
- [ ] investigate using internal dynamo table locally to hide local manifest.json fugly
- [ ] speed up sync
- [ ] is many buckets possible? (seems no because local dev)
