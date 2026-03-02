"use client";

import RevealOnScroll from "./RevealOnScroll";

const problems = [
  {
    icon: "🔄",
    title: "Back to square one — every session",
    description:
      "Every new Claude Code conversation starts with zero context. You re-explain your tech stack, remind it about your patterns, and paste the same guidelines you pasted yesterday.",
  },
  {
    icon: "📋",
    title: "Manual copy-paste is expensive",
    description:
      "Pasting your coding standards doc costs 3,000–5,000 tokens before you write a single line. That's wasted budget, slower responses, and a smaller window for your actual work.",
  },
  {
    icon: "🧠",
    title: "Long contexts forget your rules",
    description:
      "Even when you do inject rules at the start, Claude gradually deprioritizes them as the conversation grows. The code quality drifts. You catch it in review — or you don't.",
  },
];

export default function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <RevealOnScroll className="text-center mb-16">
          <h2
            id="problem-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Claude Code is powerful.
            <br />
            <span className="text-[var(--text-secondary)]">
              But it doesn&apos;t know your rules.
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Every session, you start over. Manually. The AI that&apos;s supposed
            to accelerate your team ends up needing constant hand-holding.
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <RevealOnScroll key={problem.title} delay={(i + 1) as 1 | 2 | 3}>
              <div className="glass-card rounded-xl p-6 h-full flex flex-col gap-4">
                <span className="text-3xl" role="img" aria-hidden>
                  {problem.icon}
                </span>
                <h3 className="font-semibold text-lg leading-snug">
                  {problem.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1">
                  {problem.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
