# progressive bundle demo

dynamic progressive bundle of frontend code

- frontend source is in `src/views`
- `get /` bundles html
- `get /js/:module` bundles javascript entry files
- `get /css/:module` bundles css entry files

bonus features

- `get /cache` to view and clear the cache
- add `?debug=1` to disable cache and view module waterfall
