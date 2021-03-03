# progressive bundle demo

dynamic progressive bundle of frontend code

uses s3 only
uses esbuild for bundle
uses native crypto for fingerprint

- `get /_bundle/*` greedy bundles javascript entry files

    - user requests /_bundle/foo/bar/baz.js
    - check for the file in s3://mybucket/_bundle/manifest.json
    - if it exists redirect to that (whatever the fingerprinted value is)
    - if it does not exist 
      - bundle/fingerprint the file
      - put in s3://mybucket/_bundle
      - write the s3://mybucket/_bundle/manifest.json entry
