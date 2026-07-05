"use client";

// FSGA workshop — attendee search box (landing page + pack not-found page).
//
// Debounced (250ms), min 2 chars, AbortController cancels stale in-flight
// fetches so a fast typer never has an older response clobber a newer one.

import Link from "next/link";
import { useEffect, useState } from "react";

interface SearchResult {
  name: string;
  company: string;
  slug: string;
}

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults(null);
      setLoading(false);
      setErrored(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setErrored(false);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/fsga/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`search failed: ${res.status}`);
        const data: SearchResult[] = await res.json();
        setResults(data);
        setLoading(false);
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrored(true);
        setResults([]);
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const trimmed = query.trim();
  const showIdleHint = trimmed.length < 2;
  const showEmpty = !loading && !showIdleHint && (errored || (results !== null && results.length === 0));
  const visibleResults = !loading && !showIdleHint && results !== null && results.length > 0 ? results : null;

  return (
    <div className="max-w-[480px] mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your name or company…"
        aria-label="Search your name or company"
        className="bg-bg-card border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none w-full font-mono text-sm"
      />

      <div className="mt-3 grid gap-2">
        {showIdleHint && (
          <p className="text-[12px] text-ink-faint text-center">Type at least 2 characters to search.</p>
        )}

        {!showIdleHint && loading && (
          <p className="text-[12px] text-ink-faint text-center">searching…</p>
        )}

        {visibleResults &&
          visibleResults.map((r) => (
            <Link
              key={r.slug}
              href={`/fsga/pack/${r.slug}`}
              className="bg-bg-card border border-line rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-accent transition-colors no-underline"
            >
              <span className="text-[13px] text-ink font-medium">{r.name}</span>
              <span className="text-[12px] text-ink-muted">{r.company}</span>
            </Link>
          ))}

        {showEmpty && (
          <Link
            href="/fsga/starter"
            className="bg-bg-card border border-line rounded-xl px-4 py-4 text-center no-underline hover:border-accent transition-colors"
          >
            <div className="text-[13px] text-ink font-medium">Not on the list?</div>
            <div className="text-[12px] text-ink-muted mt-1">Build a starter Skill Pack in 30 seconds →</div>
          </Link>
        )}
      </div>
    </div>
  );
}
