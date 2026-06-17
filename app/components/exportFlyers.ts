import { nodeToDataUrl, type PxSize } from "./exportPng";

/**
 * exportFlyers
 * ------------
 * Bundling helpers for the multi-copy side-fold flyer. Each copy is captured
 * from its on-screen panel node, optionally rotated for the physical fold, then
 * combined into a single downloadable file:
 *   - downloadFlyersPdf → one multi-page PDF (one copy per page)
 *   - downloadFlyersPng → one tall PNG with every copy stacked vertically
 *
 * Capture target: the panel is 297mm × 105mm. On screen at 96dpi that is
 * 1123 × 397px; a pixelRatio of 3.125 raster-scales it to ~3508 × 1240px (300dpi).
 */

// On-screen CSS size of a FoldPanelTemplate panel (297mm × 105mm @ 96dpi).
export const PANEL_PX: PxSize = { width: 1123, height: 397 };
// 300dpi / 96dpi — lifts the capture to print resolution (~3508 × 1240px).
export const PANEL_PIXEL_RATIO = 3.125;

export type Rotation = 0 | 90 | -90;

interface RasterImage {
  url: string;
  width: number;
  height: number;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load captured image"));
    img.src = url;
  });
}

/**
 * Load a captured PNG and, when `deg` is ±90, redraw it rotated onto a canvas
 * (swapping width/height). Always resolves with the real pixel dimensions so
 * downstream stacking / paging stays exact.
 */
async function prepareImage(url: string, deg: Rotation): Promise<RasterImage> {
  const img = await loadImage(url);
  if (deg === 0) {
    return { url, width: img.naturalWidth, height: img.naturalHeight };
  }

  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = h;
  canvas.height = w;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (deg === 90) {
    ctx.translate(canvas.width, 0);
    ctx.rotate(Math.PI / 2);
  } else {
    // -90
    ctx.translate(0, canvas.height);
    ctx.rotate(-Math.PI / 2);
  }
  ctx.drawImage(img, 0, 0);

  return { url: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height };
}

/** Capture every panel node → optional rotate → real-sized raster images. */
async function captureAll(
  nodes: HTMLElement[],
  rotation: Rotation,
): Promise<RasterImage[]> {
  const images: RasterImage[] = [];
  for (const node of nodes) {
    const url = await nodeToDataUrl(node, PANEL_PX, PANEL_PIXEL_RATIO);
    images.push(await prepareImage(url, rotation));
  }
  return images;
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
}

/** Assemble all copies into one multi-page PDF (one copy per page). */
export async function downloadFlyersPdf(
  nodes: HTMLElement[],
  rotation: Rotation = 0,
  filename = "flyers.pdf",
): Promise<void> {
  if (nodes.length === 0) return;
  const images = await captureAll(nodes, rotation);
  const { jsPDF } = await import("jspdf");

  let doc: import("jspdf").jsPDF | null = null;
  for (const img of images) {
    const orientation = img.width >= img.height ? "landscape" : "portrait";
    const format: [number, number] = [img.width, img.height];
    if (!doc) {
      doc = new jsPDF({ unit: "px", format, orientation });
    } else {
      doc.addPage(format, orientation);
    }
    doc.addImage(img.url, "PNG", 0, 0, img.width, img.height);
  }
  doc?.save(filename);
}

/** Assemble all copies into one tall PNG (stacked vertically, white gutters). */
export async function downloadFlyersPng(
  nodes: HTMLElement[],
  rotation: Rotation = 0,
  filename = "flyers.png",
): Promise<void> {
  if (nodes.length === 0) return;
  const images = await captureAll(nodes, rotation);

  const GAP = 40; // px of white space between stacked panels
  const width = Math.max(...images.map((i) => i.width));
  const height =
    images.reduce((sum, i) => sum + i.height, 0) + GAP * (images.length - 1);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  let y = 0;
  for (const img of images) {
    const el = await loadImage(img.url);
    const x = Math.round((width - img.width) / 2); // center narrower panels
    ctx.drawImage(el, x, y, img.width, img.height);
    y += img.height + GAP;
  }

  triggerDownload(canvas.toDataURL("image/png"), filename);
}
