import type { Ref } from "react";

/**
 * SingleHadithPoster
 * ------------------
 * A print-perfect 2:3 portrait poster (140mm × 210mm — exactly 2:3, and fits
 * within A4 for clean printing) built for ONE hadith as the hero element.
 *
 * Shares the design language of <IslamicPosterTemplate />:
 *   - Palette: deep green / white / black / gold (high contrast, ink-efficient).
 *   - No human or animal imagery — subtle girih pattern + mosque silhouette.
 *   - Hierarchy: headline → single large hadith → reference → optional message
 *     box → footer (logo / organization / QR).
 *
 * The single hadith's body font size is customizable (`hadith.fontSize`, pt).
 * Pure presentational component — all editing lives in <SingleHadithPosterEditor />.
 */

const GREEN = "#0B5D34";
const GREEN_SOFT = "#EEF5EF";
const GOLD = "#B8902F";
const BLACK = "#141414";

/** Default hadith body font size (pt) used when the hadith has none set. */
export const DEFAULT_HADITH_FONT_SIZE = 22;

export interface SingleHadith {
  text: string;
  reference: string;
  /** Body font size in points. Defaults to DEFAULT_HADITH_FONT_SIZE when unset. */
  fontSize?: number;
}

export type PosterOrientation = "portrait" | "landscape";

export interface SingleHadithPosterProps {
  title: string;
  hadith: SingleHadith;
  /** Sheet orientation: portrait 2:3 (140×210mm) or landscape 3:2 (210×140mm). */
  orientation?: PosterOrientation;
  importantMessage?: string;
  importantLabel?: string;
  footerMessage?: string;
  organizationName: string;
  contact?: string;
  /** Logo image src (PNG / SVG / JPG). */
  logo: string;
  logoAlt?: string;
  /** QR code image src; a styled placeholder is shown when empty. */
  qrCode?: string;
  /** Ref to the root poster <article> (used for PNG export). */
  ref?: Ref<HTMLElement>;
}

/* ---- Background accents (geometric pattern + mosque silhouette) --------- */

function PosterBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Subtle 8-point girih pattern — light green strokes, ink-efficient. */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern
            id="girih-single"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke={GREEN} strokeWidth="0.6">
              <rect x="11" y="11" width="22" height="22" />
              <polygon points="22,4 40,22 22,40 4,22" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih-single)" opacity="0.05" />
      </svg>

      {/* Faint mosque silhouette behind the footer. */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full"
        viewBox="0 0 600 160"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <g fill={GREEN} opacity="0.07">
          <rect x="0" y="120" width="600" height="40" />
          <rect x="70" y="44" width="13" height="76" />
          <circle cx="76.5" cy="44" r="9" />
          <rect x="74.5" y="22" width="4" height="16" />
          <rect x="517" y="44" width="13" height="76" />
          <circle cx="523.5" cy="44" r="9" />
          <rect x="521.5" y="22" width="4" height="16" />
          <path d="M150 120 A46 56 0 0 1 242 120 Z" />
          <path d="M358 120 A46 56 0 0 1 450 120 Z" />
          <path d="M256 120 C256 68 288 40 300 24 C312 40 344 68 344 120 Z" />
          <rect x="297" y="6" width="6" height="20" />
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
      className={`absolute h-[9mm] w-[9mm] ${className}`}
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

export default function SingleHadithPoster({
  title,
  hadith,
  orientation = "portrait",
  importantMessage,
  importantLabel = "গুরুত্বপূর্ণ বার্তা",
  footerMessage,
  organizationName,
  contact,
  logo,
  logoAlt = "Logo",
  qrCode,
  ref,
}: SingleHadithPosterProps) {
  const isLandscape = orientation === "landscape";
  const sizeCls = isLandscape ? "h-[140mm] w-[210mm]" : "h-[210mm] w-[140mm]";
  // Landscape is shorter — trim vertical padding so header/hero/footer fit.
  const padCls = isLandscape ? "px-[16mm] py-[10mm]" : "px-[14mm] py-[13mm]";

  return (
    <article
      ref={ref}
      style={{
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        fontFamily: "var(--font-bangla), sans-serif",
        color: BLACK,
      }}
      className={`relative overflow-hidden bg-white shadow-lg print:shadow-none ${sizeCls}`}
    >
      <PosterBackground />

      {/* Decorative double frame (gold outer + green inner) with safe margin. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[6mm] border-2"
        style={{ borderColor: GOLD }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8mm] border"
        style={{ borderColor: GREEN }}
      />
      <Corner className="left-[6mm] top-[6mm]" />
      <Corner className="right-[6mm] top-[6mm] rotate-90" />
      <Corner className="bottom-[6mm] right-[6mm] rotate-180" />
      <Corner className="bottom-[6mm] left-[6mm] -rotate-90" />

      {/* ---- Content (print-safe inner padding) ---------------------------- */}
      <div className={`relative flex h-full flex-col ${padCls}`}>
        {/* Header */}
        <header className="text-center">
          <div
            className="mx-auto mb-[2.5mm] h-[1.2mm] w-[22mm] rounded-full"
            style={{ backgroundColor: GOLD }}
          />
          <h1
            style={{
              fontFamily: "var(--font-bangla-serif), serif",
              color: GREEN,
              fontSize: "24pt",
            }}
            className="font-bold leading-tight"
          >
            {title}
          </h1>
          <div className="mt-[2.5mm] flex items-center justify-center gap-[3mm]">
            <span
              className="h-[0.5mm] w-[22mm]"
              style={{ backgroundColor: GREEN }}
            />
            <span className="text-[13pt]" style={{ color: GOLD }} aria-hidden>
              ❖
            </span>
            <span
              className="h-[0.5mm] w-[22mm]"
              style={{ backgroundColor: GREEN }}
            />
          </div>
        </header>

        {/* Single hadith — hero element */}
        <section className="flex flex-1 flex-col justify-center py-[6mm] text-center">
          <figure>
            <blockquote
              className="font-medium leading-snug"
              style={{
                color: BLACK,
                fontSize: `${hadith.fontSize ?? DEFAULT_HADITH_FONT_SIZE}pt`,
              }}
            >
              {hadith.text}
            </blockquote>
            <figcaption
              className="mt-[5mm] text-[13pt] font-semibold"
              style={{ color: GOLD }}
            >
              — {hadith.reference}
            </figcaption>
          </figure>
        </section>

        {/* Important highlighted message box */}
        {importantMessage ? (
          <section
            className="rounded-[2mm] border-2 px-[7mm] py-[4mm] text-center"
            style={{ borderColor: GREEN, backgroundColor: GREEN_SOFT }}
          >
            <div
              className="mb-[2mm] inline-block rounded-full px-[5mm] py-[1mm] text-[9.5pt] font-bold text-white"
              style={{ backgroundColor: GREEN }}
            >
              {importantLabel}
            </div>
            <p
              className="text-[12pt] font-bold leading-snug"
              style={{ color: GREEN }}
            >
              {importantMessage}
            </p>
          </section>
        ) : null}

        {/* Footer message */}
        {footerMessage ? (
          <p
            className="mt-[5mm] text-center text-[11pt] font-semibold"
            style={{ color: BLACK }}
          >
            {footerMessage}
          </p>
        ) : null}

        {/* Bottom row: logo · organization · QR */}
        <footer className="mt-[5mm] flex items-end justify-between gap-[5mm]">
          <div className="flex w-[34mm] flex-col items-center gap-[1.5mm]">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={logoAlt}
                className="max-h-[16mm] w-auto max-w-[32mm] object-contain"
              />
            ) : (
              <div
                className="flex h-[14mm] w-[28mm] items-center justify-center border border-dashed text-[8pt]"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                লোগো
              </div>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="text-[11pt] font-bold" style={{ color: GREEN }}>
              {organizationName}
            </div>
            {contact ? (
              <div className="mt-[1mm] text-[8.5pt]" style={{ color: BLACK }}>
                {contact}
              </div>
            ) : null}
          </div>

          <div className="flex w-[34mm] flex-col items-center gap-[1.5mm]">
            {qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCode}
                alt="QR code"
                className="h-[20mm] w-[20mm] object-contain"
              />
            ) : (
              <div
                className="flex h-[20mm] w-[20mm] flex-col items-center justify-center border-2 border-dashed text-center text-[7pt] leading-tight"
                style={{ borderColor: GREEN, color: GREEN }}
              >
                <span className="text-[11pt]" aria-hidden>
                  ▣
                </span>
                QR কোড
              </div>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
