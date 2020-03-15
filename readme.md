# progressive bundle demo

dynamic progressive bundle of frontend code

- frontend source is in `src/views`
- `get /` returns home page
- `get /modules/:type/:module` bundles javascript entry files

bonus features

- `get /cache` to view and clear the cache

usage

- `npm start` to run with bundling enabled
- `npm run debug` to run in debug mode to view module source and waterfall loading
