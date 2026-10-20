# Report editing workspace

The Reports editor presents one editable PDF document. Charts, tables, text, and pagination remain visible together.

- The top toolbar controls whole-report typography and reset. The header keeps download and close available.
- The central surface renders the generated PDF itself with PDF.js. Text targets use page coordinates recorded by the same generator; clicking one opens its inline editor.
- The optional outline only navigates sections. On small screens it closes after selecting a destination.
- There is no separate writing view or Split view. Typography and text changes regenerate the PDF and its editable positions together, preserving charts and tables as the document reflows.
- Zoom changes the display without changing the downloaded page size. Small screens start at a readable zoom and can pan across the page or choose Fit width.
- Downloads use the displayed PDF blob. Generation cancels outdated work. Offscreen canvases are released to bound memory use on long reports.
- PDF.js 6.4.299 and its worker/fonts are served locally under `public/pdfjs`; keep those assets in sync when upgrading the pinned dependency. No PDF data is sent to an external document service.
- Drafts retain the existing Reports-page lifetime; this interface does not claim server autosave.

## Research

- [Google Docs document outline](https://support.google.com/docs/answer/6367684?co=GENIE.Platform%3DDesktop&hl=en-GB): separate section navigation from document content.
- [Notion page styling](https://www.notion.com/help/customize-and-style-your-content): edit content in place and keep formatting close to the writing workflow.
- [Adobe Acrobat text editing](https://helpx.adobe.com/acrobat/desktop/edit-documents/edit-text-in-pdfs/modify-text.html): explicit editing controls alongside a document-focused workspace.
- [21st toolbar reference](https://docs.21st.dev/@cnippet-dev/components/cnippet-toolbar/rich-text): compact groups and separators for document actions. Existing project primitives are used for implementation.

These are interaction references, adapted to SecureTanza's existing slate and sky interface. No external editor framework or source document uploads are required.
