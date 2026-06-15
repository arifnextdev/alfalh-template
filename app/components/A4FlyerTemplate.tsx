/**
 * A4FlyerTemplate
 * ----------------
 * A print-perfect A4 (210mm × 297mm) flyer split into two equal vertical
 * halves (50% / 50%) with a dashed center cut/fold line.
 *
 * Each half holds:
 *   - a large text block (centered)
 *   - a logo pinned to the bottom of the half
 *
 * Side-fold design:
 *   The text + logo container of each half is rotated 90°, so when the sheet
 *   is viewed in portrait the text reads vertically. Fold along the dashed
 *   center line and the two panels read upright when held landscape.
 *
 * This is a PURE PRESENTATIONAL component: it holds no state and renders only
 * the flyer. All editing/customization (text, sizes, logo upload, rotation)
 * lives in the separate <FlyerEditor /> controls component, which feeds this
 * component via props. That keeps the printable surface clean and free of UI.
 *
 * Notes
 *   - Logos use a plain semantic <img>, so any PNG / SVG / JPG source works
 *     with zero next.config setup (unlike next/image in Next 16, which now
 *     requires `qualities` / `remotePatterns` / `dangerouslyAllowSVG`).
 *   - Sizing is in millimetres / points for true 1:1 print accuracy.
 *   - Print resets (@page, margin removal) live in app/globals.css.
 */

import type { Ref } from "react";

export interface A4FlyerTemplateProps {
  leftText: string;
  rightText: string;
  leftLogo: string;
  rightLogo: string;
  /** Optional alt text for the logos (accessibility). */
  leftLogoAlt?: string;
  rightLogoAlt?: string;
  /** Rotation direction of the side-fold panels. Defaults to 90°. */
  rotation?: 90 | -90;
  /** Text size in pt (per half). Default 42. */
  leftTextSize?: number;
  rightTextSize?: number;
  /** Logo max-height in mm (per half). Default 28. */
  leftLogoSize?: number;
  rightLogoSize?: number;
  /** Ref to the root A4 <article> (used for PNG export). */
  ref?: Ref<HTMLElement>;
}

interface HalfProps {
  text: string;
  logo: string;
  logoAlt: string;
  rotation: 90 | -90;
  textSize: number;
  logoSize: number;
}

function FlyerHalf({
  text,
  logo,
  logoAlt,
  rotation,
  textSize,
  logoSize,
}: HalfProps) {
  return (
    // Each half is exactly 105mm × 297mm. overflow-hidden keeps the rotated
    // content perfectly clipped to the panel.
    <section className="relative h-[297mm] w-[105mm] overflow-hidden">
      {/*
        Pre-rotation box is 297mm wide × 105mm tall, centred, then rotated 90°
        so it fits the 105 × 297 panel exactly after rotation.
      */}
      <div
        className={[
          "absolute left-1/2 top-1/2 flex h-[105mm] w-[297mm]",
          "-translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center",
          "px-[14mm] py-[10mm]",
          rotation === 90 ? "rotate-90" : "-rotate-90",
        ].join(" ")}
      >
        {/* Large text — centered both axes, grows to fill. */}
        <div className="flex w-full flex-1 items-center justify-center">
          <div
            style={{ fontSize: `${textSize}pt` }}
            className="w-full whitespace-pre-wrap break-words text-center font-bold leading-tight tracking-tight text-black"
          >
            {text}
          </div>
        </div>

        {/* Logo pinned to the bottom of the half. */}
        <div className="flex w-full shrink-0 items-center justify-center pt-[6mm]">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={logoAlt}
              style={{ maxHeight: `${logoSize}mm` }}
              className="w-auto max-w-[80mm] object-contain"
            />
          ) : (
            <div
              style={{ height: `${logoSize}mm` }}
              className="flex w-[60mm] items-center justify-center border border-dashed border-gray-300 text-[10pt] text-gray-400 print:hidden"
            >
              Logo area
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function A4FlyerTemplate({
  leftText,
  rightText,
  leftLogo,
  rightLogo,
  leftLogoAlt = "Al-Falah Foundation",
  rightLogoAlt = "Al-Falah Foundation",
  rotation = 90,
  leftTextSize = 42,
  rightTextSize = 42,
  leftLogoSize = 28,
  rightLogoSize = 28,
  ref,
}: A4FlyerTemplateProps) {
  return (
    <article
      ref={ref}
      // The A4 page itself: exact physical dimensions, no scaling.
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      className="relative mx-auto flex h-[297mm] w-[210mm] flex-row bg-white text-black shadow-lg print:m-0 print:shadow-none"
    >
      <FlyerHalf
        text={leftText}
        logo={leftLogo}
        logoAlt={leftLogoAlt}
        rotation={rotation}
        textSize={leftTextSize}
        logoSize={leftLogoSize}
      />
      <FlyerHalf
        text={rightText}
        logo={rightLogo}
        logoAlt={rightLogoAlt}
        rotation={rotation}
        textSize={rightTextSize}
        logoSize={rightLogoSize}
      />

      {/* Dashed center cut / fold line — thin and print-friendly. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-gray-400 print:border-gray-300"
      />
    </article>
  );
}
