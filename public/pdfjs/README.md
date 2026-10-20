# Local PDF.js assets

These worker and standard-font assets match the pinned `pdfjs-dist@6.4.299` dependency. The report editor renders PDF bytes locally in the browser.

When updating that dependency, refresh these assets from the same installed version:

```sh
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdfjs/pdf.worker.min.mjs
cp node_modules/pdfjs-dist/standard_fonts/* public/pdfjs/standard_fonts/
```

Keep the accompanying font license files. Worker source includes its Apache license notice. See [PDF.js documentation](https://mozilla.github.io/pdf.js/examples/).
