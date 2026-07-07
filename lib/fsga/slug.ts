// FSGA workshop — slug helpers.
//
// `publicSlug` is embedded in the QR-scanned URL for a given attendee's skill
// pack. It is assigned ONCE at insert time and must never change afterward —
// changing it would break already-printed/scanned QR codes. Callers (see
// scripts/fsga/import-attendees.ts) must only call makePublicSlug() when
// inserting a brand-new attendee row, never on update.

import { randomInt } from "node:crypto";

const SUFFIX_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // no ambiguous chars (0/o, 1/l/i)
const SUFFIX_LENGTH = 4;
const COMBINING_DIACRITICS = /[̀-ͯ]/g;

export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "") // strip diacritics left behind by NFKD decomposition
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function randomSuffix(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += SUFFIX_ALPHABET[randomInt(SUFFIX_ALPHABET.length)];
  }
  return out;
}

export function makePublicSlug(name: string): string {
  const base = slugify(name) || "attendee";
  return `${base}-${randomSuffix(SUFFIX_LENGTH)}`;
}
