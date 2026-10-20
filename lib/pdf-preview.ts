import type { PDFDocumentProxy } from "pdfjs-dist";

export interface PDFPageSize {
  width: number;
  height: number;
}
export interface LoadedReportPDF {
  pdf: PDFDocumentProxy;
  pageSizes: PDFPageSize[];
}

/** Keep the browser-only renderer out of server evaluation and use local assets. */
export async function loadReportPDF(blob: Blob): Promise<LoadedReportPDF> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({
    data: new Uint8Array(await blob.arrayBuffer()),
    standardFontDataUrl: "/pdfjs/standard_fonts/",
    useSystemFonts: false,
    useWasm: false,
  });
  const pdf = await task.promise;
  try {
    const pageSizes = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, index) => {
        const page = await pdf.getPage(index + 1);
        const viewport = page.getViewport({ scale: 1 });
        return { width: viewport.width, height: viewport.height };
      }),
    );
    return { pdf, pageSizes };
  } catch (error) {
    await task.destroy();
    throw error;
  }
}
