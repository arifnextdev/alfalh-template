"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ResponsiveA4
 * ------------
 * Scales a fixed-size A4 child down to fit the available width on small
 * screens (so the preview never overflows a phone), while leaving the printed
 * output at true 1:1 A4. On print the scaling is reset (see globals.css:
 * `.a4-fit-*` rules) so nothing is shrunk on paper.
 *
 * The outer box reserves the *scaled* height so the layout doesn't leave a
 * large gap below the shrunk preview.
 */

// A4 at 96 CSS dpi: 210mm = 793.7px, 297mm = 1122.5px.
const A4_W = 794;
const A4_H = 1123;

export default function ResponsiveA4({
  children,
  width = A4_W,
  height = A4_H,
}: {
  children: React.ReactNode;
  /** Natural (1:1) pixel width of the child sheet. Defaults to A4. */
  width?: number;
  /** Natural (1:1) pixel height of the child sheet. Defaults to A4. */
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / width));
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Reserves the scaled footprint so following content isn't overlapped. */}
      <div
        className="a4-fit-outer mx-auto"
        style={{ width: width * scale, height: height * scale }}
      >
        {/* Actual sheet box, scaled from its top-left corner. */}
        <div
          className="a4-fit-inner origin-top-left"
          style={{ width, height, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
