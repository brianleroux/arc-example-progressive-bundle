# progressive bundle demo

Automatically bundle esmodules in `/public`.

## Usage    

Example `app.arc`; enable bundling by declaring the `bundle` folder for build output:

```arc
@app
myapp

@static
bundle dist # this puts bundle output locally in public/dist and in s3://static-bucket/dist when deployed
entry index.js # pre bundle file(s) at deploy time for max speeds
```

# todo

- [ ] add `src/http/get-index/get-bundle` to `@architect/functions`
- [ ] investigate using internal dynamo table locally to hide local manifest.json fugly
- [ ] speed up sync
- [ ] is many buckets possible? (seems no because local dev)
