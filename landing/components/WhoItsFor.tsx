"use client";

import RevealOnScroll from "./RevealOnScroll";

const personas = [
  {
    emoji: "💻",
    role: "Individual Developer",
    pain: "Claude writes code that works but ignores your naming conventions, error handling style, and project patterns.",
    gain: "Rules load automatically at conversation start — Claude codes the way you want, every session, without reminding.",
  },
  {
    emoji: "👥",
    role: "Tech Lead",
    pain: "Your team uses Claude Code but each person gets different output. PR reviews become style debates instead of logic reviews.",
    gain: "One shared rule set injected for the entire team. AI output is consistent, reviewable, and on-standard.",
  },
  {
    emoji: "🔐",
    role: "Security Engineer",
    pain: "Claude doesn't know your domain's vulnerability patterns. It suggests code that works but misses OWASP, DeFi exploits, or internal security policies.",
    gain: "Specialized security checklists injected on demand — OWASP, smart contract audits, cryptographic pitfalls — all available in one call.",
  },
  {
    emoji: "🔀",
    role: "Consultant / Freelancer",
    pain: "Every client project has different standards. You spend the first hour of each engagement re-explaining conventions to the AI.",
    gain: "Load project-specific rules per session. Switch clients, switch context — Claude adapts instantly.",
  },
];

export default function WhoItsFor() {
  return (
    <section
      id="who-its-for"
      aria-labelledby="who-its-for-heading"
      className="py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <RevealOnScroll className="text-center mb-16">
          <h2
            id="who-its-for-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Built for every engineer
            <br />
            <span className="text-[var(--text-secondary)]">
              who uses Claude Code
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Whether you&apos;re shipping solo or leading a team, AwesomeContext
            closes the gap between raw AI output and production-grade code.
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-6">
          {personas.map((persona, i) => (
            <RevealOnScroll key={persona.role} delay={((i % 2) + 1) as 1 | 2}>
              <div className="glass-card rounded-xl p-7 h-full flex flex-col gap-4 group hover:border-[var(--primary)]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-hidden>
                    {persona.emoji}
                  </span>
                  <span className="font-semibold text-base">{persona.role}</span>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex gap-2.5">
                    <span className="mt-0.5 text-red-400/70 shrink-0 text-sm">✗</span>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {persona.pain}
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="mt-0.5 text-emerald-400/80 shrink-0 text-sm">✓</span>
                    <p className="text-sm leading-relaxed">{persona.gain}</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
