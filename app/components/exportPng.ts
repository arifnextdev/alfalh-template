import { toPng } from "html-to-image";

/**
 * Shared client-side helper to rasterize a fixed A4 element to a downloadable
 * PNG at print-quality resolution. Used by the template editors.
 *
 * Captures at true A4 (794 × 1123px @ 96dpi) regardless of any on-screen
 * responsive scale, and strips the preview's shadow/transform from the clone.
 */

// A4 at 96 CSS dpi.
export const A4_PX = { width: 794, height: 1123 } as const;

// ~2382 × 3369px output — crisp for print.
const DEFAULT_PIXEL_RATIO = 3;

export async function exportA4Png(
  node: HTMLElement,
  filename: string,
  pixelRatio: number = DEFAULT_PIXEL_RATIO,
): Promise<void> {
  const dataUrl = await toPng(node, {
    width: A4_PX.width,
    height: A4_PX.height,
    pixelRatio,
    cacheBust: true,
    backgroundColor: "#ffffff",
    style: { transform: "none", margin: "0", boxShadow: "none" },
  });

  const link = document.createElement("a");
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  link.href = dataUrl;
  link.click();
}
