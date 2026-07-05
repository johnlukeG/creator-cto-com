"use client";

// FSGA workshop — the deck's reusable QR card. Used full-size on the act-4
// "qr-reveal" slide and again, smaller, on the closing "thanks" slide.
//
// `qrcode.react`'s QRCodeSVG calls React.useMemo internally, so it only
// works inside a client component tree — marked 'use client' here rather
// than assuming it's server-compatible.

import { QRCodeSVG } from "qrcode.react";
import { QR_URL } from "@/lib/fsga/config";

const DISPLAY_URL = "creatorcto.com/fsga";

export function QrBlock({ size = 520 }: { size?: number }) {
  const urlFontSize = Math.max(28, Math.round(size * 0.065));

  return (
    <div className="bg-chip rounded-[24px] p-8 flex flex-col items-center gap-5 w-fit">
      <QRCodeSVG value={QR_URL} size={size} />
      <div
        className="font-bold text-chip-ink tracking-[-0.02em] whitespace-nowrap"
        style={{ fontSize: urlFontSize }}
      >
        {DISPLAY_URL}
      </div>
    </div>
  );
}
