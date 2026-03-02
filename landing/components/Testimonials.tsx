"use client";

const testimonials = [
  {
    quote:
      "My team used to paste 3,000-token rule docs every session. Now it just works.",
    name: "Alex Chen",
    role: "Senior Engineer, Fintech",
    avatar: "AC",
  },
  {
    quote:
      "I set it up in 5 minutes. Claude now catches security issues I used to miss entirely.",
    name: "Sarah K.",
    role: "Freelance Developer",
    avatar: "SK",
  },
  {
    quote:
      "The DeFi security audit skill saved me hours on a smart contract review.",
    name: "Marcus T.",
    role: "Blockchain Developer",
    avatar: "MT",
  },
  {
    quote:
      "As a tech lead, it's the missing piece between AI coding and consistent team standards.",
    name: "Priya R.",
    role: "Engineering Lead",
    avatar: "PR",
  },
  {
    quote:
      "Compliance verify caught an SQL injection I almost shipped. Literal zero-day saver.",
    name: "David W.",
    role: "Backend Developer",
    avatar: "DW",
  },
  {
    quote:
      "I use it on every project now. The architecture consult alone is worth it.",
    name: "Jamie L.",
    role: "Full Stack Developer",
    avatar: "JL",
  },
  {
    quote:
      "Switching between client projects is seamless — each one loads the right rules.",
    name: "Chen Wei",
    role: "Consultant",
    avatar: "CW",
  },
  {
    quote:
      "96% token savings sounds like marketing but it's genuinely accurate. Mind blown.",
    name: "Ana S.",
    role: "Staff Engineer",
    avatar: "AS",
  },
];

function TestimonialCard({
  quote,
  name,
  role,
  avatar,
}: {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}) {
  return (
    <div className="glass-card rounded-xl p-5 w-80 shrink-0 flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
          style={{ background: "var(--primary)", color: "#fff" }}
          aria-hidden
        >
          {avatar}
        </div>
        <div>
          <p className="text-sm font-medium leading-none mb-0.5">{name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof testimonials;
  reverse?: boolean;
}) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-4 ${reverse ? "marquee-reverse" : "marquee"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-24 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 text-center mb-12">
        <h2
          id="testimonials-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
        >
          Loved by developers
        </h2>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
          Engineers who use Claude Code every day — here&apos;s what they say.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>
    </section>
  );
}
