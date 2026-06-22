// YouTube player mock — the production hero visual (hero=youtube default).
export function HeroYouTube() {
  return (
    <div className="relative rounded-[20px] overflow-hidden bg-chip aspect-[16/10] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      {/* Player shell */}
      <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#1a1a18_0%,#2a2a26_100%)]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0_12px,transparent_12px_24px)]" />
        <div className="flex items-center justify-center w-[88px] h-[88px] rounded-full bg-accent text-accent-ink text-[30px] pl-1.5 shadow-[0_0_0_12px_rgba(74,214,160,0.2)]">
          ▶
        </div>
      </div>
      {/* Top overlay row */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
        <div className="bg-black/55 backdrop-blur-md text-white px-2.5 py-1.5 rounded-md text-[10px] tracking-[0.04em] uppercase whitespace-nowrap">
          ● Live build
        </div>
        <div className="text-white/60 text-[11px] whitespace-nowrap">coming soon</div>
      </div>
      {/* Bottom title overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-[18px] pt-10 pb-4 bg-[linear-gradient(transparent,rgba(0,0,0,0.7))] text-white">
        <div className="text-[11px] opacity-70 mb-1">Creator CTO · on YouTube</div>
        <div className="text-[16px] font-semibold tracking-[-0.01em]">
          Building AI-native products, start to finish
        </div>
      </div>
      {/* Scrub bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15">
        <div className="w-[34%] h-full bg-accent" />
      </div>
    </div>
  );
}
