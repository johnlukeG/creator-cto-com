// FSGA workshop — pack page header: attendee identity + intro copy.

export function PackHeader({
  attendee,
  customIntro,
  summary,
}: {
  attendee: { name: string; company: string; title: string | null };
  customIntro?: string | null;
  summary?: string | null;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] leading-[1.1] text-balance">
        {attendee.name}&rsquo;s AI Skill Pack
      </h1>
      <p className="text-[13px] text-ink-muted mt-2.5">
        {attendee.title ? `${attendee.title} · ` : ""}
        {attendee.company}
      </p>
      {customIntro && <p className="text-[14px] text-accent mt-4 leading-[1.6]">{customIntro}</p>}
      {summary && <p className="text-[13px] text-ink-muted mt-3 leading-[1.6]">{summary}</p>}
    </div>
  );
}
