<h1 align="center">now-next-routes</h1>

## examples-into-existing-json
This example is for `--merge` option. If your `now.json` already has custom `routes` property, it is possible to merge generated
routes to it.

```bash
$ npx now-next-routes generate --merge --input now.template.json routes.ts
```

now-next-routes provides `--merge` or `-m` options, it merges new routes into existing `now.json` and generate a new file.
