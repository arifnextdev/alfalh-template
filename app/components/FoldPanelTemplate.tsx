/**
 * FoldPanelTemplate
 * -----------------
 * A print-perfect landscape reading-panel for the side-fold flyer.
 *
 * Physical size: 297mm × 105mm (a single A4 half, unfolded). At 300dpi this is
 * exactly 3508 × 1240px — the export target. On screen at 96dpi it is
 * 1123 × 397px (see FlyerEditor / ResponsiveA4).
 *
 * Each panel shows ONE centered title (the only per-copy field) above a shared
 * "foundation" strip: logo on the left, organization name + contact + address
 * stacked on the right. Multiple copies reuse this same design with only the
 * title changing — see <FlyerEditor />.
 *
 * This is a PURE PRESENTATIONAL component (no state, accepts a ref for export).
 * Rotation for the physical fold is applied at export time, not here, so the
 * capture stays a clean upright box.
 *
 * Notes
 *   - Logo uses a plain <img> so any PNG / SVG / JPG works without next/image
 *     config (matches A4FlyerTemplate / IslamicPosterTemplate).
 *   - Sizing is in mm / pt for true 1:1 print accuracy.
 */

import type { Ref } from "react";

const GREEN = "#0B5D34";
const GOLD = "#B8902F";
const BLACK = "#141414";

/* ---- Background accents (geometric pattern + mosque silhouette) ---------
 * Mirrors <IslamicPosterTemplate />'s design language: a subtle girih pattern
 * across the panel and a faint mosque silhouette anchored to the bottom edge. */

function PanelBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Subtle 8-point girih pattern — light green strokes, ink-efficient. */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="girih-fold" width="44" height="44" patternUnits="userSpaceOnUse">
            <g fill="none" stroke={GREEN} strokeWidth="0.6">
              <rect x="11" y="11" width="22" height="22" />
              <polygon points="22,4 40,22 22,40 4,22" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih-fold)" opacity="0.05" />
      </svg>

      {/* Faint mosque silhouette anchored to the bottom edge. */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full"
        viewBox="0 0 600 120"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <g fill={GREEN} opacity="0.07">
          <rect x="0" y="92" width="600" height="28" />
          {/* minarets */}
          <rect x="64" y="34" width="11" height="58" />
          <circle cx="69.5" cy="34" r="7.5" />
          <rect x="67.5" y="16" width="4" height="14" />
          <rect x="525" y="34" width="11" height="58" />
          <circle cx="530.5" cy="34" r="7.5" />
          <rect x="528.5" y="16" width="4" height="14" />
          {/* side domes */}
          <path d="M150 92 A40 48 0 0 1 230 92 Z" />
          <path d="M370 92 A40 48 0 0 1 450 92 Z" />
          {/* central onion dome */}
          <path d="M262 92 C262 50 290 28 300 16 C310 28 338 50 338 92 Z" />
          <rect x="297" y="2" width="6" height="14" />
        </g>
      </svg>
    </div>
  );
}

/* ---- Corner ornament ---------------------------------------------------- */

function Corner({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={`absolute h-[8mm] w-[8mm] ${className}`}
      fill="none"
      stroke={GOLD}
      strokeWidth="1.4"
    >
      <path d="M2 14 V2 H14" />
      <path d="M7 19 V7 H19" />
      <circle cx="7" cy="7" r="1.6" fill={GOLD} stroke="none" />
    </svg>
  );
}

export interface FoldPanelTemplateProps {
  /** The single, per-copy headline shown centered in the panel. */
  title: string;
  /** Title size in pt. Default 120. */
  titleSize?: number;
  /** Foundation / organization name. */
  orgName: string;
  /** Contact line (phone, website, email…). */
  contact?: string;
  /** Physical address line. */
  address?: string;
  /** Logo image src (blob URL, path or data URL). Empty → dashed placeholder. */
  logo?: string;
  logoAlt?: string;
  /** Ref to the root <article> (used for PNG/PDF export). */
  ref?: Ref<HTMLElement>;
}

export default function FoldPanelTemplate({
  title,
  titleSize = 120,
  orgName,
  contact,
  address,
  logo,
  logoAlt = "Logo",
  ref,
}: FoldPanelTemplateProps) {
  return (
    <article
      ref={ref}
      style={{
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        fontFamily: "var(--font-bangla), sans-serif",
        color: BLACK,
      }}
      className="relative h-[105mm] w-[297mm] overflow-hidden bg-white shadow-lg print:shadow-none"
    >
      <PanelBackground />

      {/* Decorative double frame (gold outer + green inner) with safe margin. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[6mm] border-2"
        style={{ borderColor: GOLD }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[7.5mm] border"
        style={{ borderColor: GREEN }}
      />
      <Corner className="left-[6mm] top-[6mm]" />
      <Corner className="right-[6mm] top-[6mm] rotate-90" />
      <Corner className="bottom-[6mm] right-[6mm] rotate-180" />
      <Corner className="bottom-[6mm] left-[6mm] -rotate-90" />

      {/* ---- Content (above the background, print-safe inner padding) -- */}
      <div className="relative flex h-full flex-col px-[16mm] py-[9mm]">
      {/* ---- Centered title hero -------------------------------------- */}
      <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
        {/* Top accent bar */}
        <div
          className="mb-[3mm] h-[1.4mm] w-[26mm] rounded-full"
          style={{ backgroundColor: GOLD }}
        />
        <h1
          style={{
            fontFamily: "var(--font-bangla-serif), serif",
            color: GREEN,
            fontSize: `${titleSize}pt`,
          }}
          className="w-full whitespace-pre-wrap break-words font-bold leading-tight tracking-tight"
        >
          {title}
        </h1>
        {/* Decorative divider with diamond separator */}
        <div className="mt-[3mm] flex items-center justify-center gap-[3mm]">
          <span
            className="h-[0.5mm] w-[30mm]"
            style={{ backgroundColor: GREEN }}
          />
          <span className="text-[14pt]" style={{ color: GOLD }} aria-hidden>
            ❖
          </span>
          <span
            className="h-[0.5mm] w-[30mm]"
            style={{ backgroundColor: GREEN }}
          />
        </div>
      </div>

      {/* ---- Foundation strip (compact) ------------------------------- */}
      <footer className="flex w-full shrink-0 items-center justify-between gap-[6mm] border-t border-gray-200 pt-[3mm]">
        {/* Logo (left) */}
        <div className="flex shrink-0 items-center">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={logoAlt}
              className="max-h-[13mm] w-auto max-w-[44mm] object-contain"
            />
          ) : (
            <div
              className="flex h-[12mm] w-[28mm] items-center justify-center border border-dashed text-[7pt] print:hidden"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Logo area
            </div>
          )}
        </div>

        {/* Organization name + contact + address (right) */}
        <div className="min-w-0 flex-1 text-right">
          <div
            className="text-[10.5pt] font-bold leading-tight"
            style={{ color: GREEN }}
          >
            {orgName}
          </div>
          {contact ? (
            <div className="mt-[1mm] text-[8pt] leading-snug">{contact}</div>
          ) : null}
          {address ? (
            <div className="mt-[0.3mm] text-[7.5pt] leading-snug text-gray-700">
              {address}
            </div>
          ) : null}
        </div>
      </footer>
      </div>
    </article>
  );
}
