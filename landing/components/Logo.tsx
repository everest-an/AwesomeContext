/**
 * AwesomeContext brand mark — isometric hexagonal crystal.
 * Represents a compressed block of latent knowledge.
 */
export default function Logo({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ac-top" x1="3.9" y1="9" x2="28.1" y2="9">
          <stop stopColor="#b4a4f4" />
          <stop offset="1" stopColor="#9b8ce8" />
        </linearGradient>
        <linearGradient id="ac-left" x1="3.9" y1="9" x2="16" y2="30">
          <stop stopColor="#6e56cf" />
          <stop offset="1" stopColor="#4a3a9e" />
        </linearGradient>
        <linearGradient id="ac-right" x1="28.1" y1="9" x2="16" y2="30">
          <stop stopColor="#5a46b5" />
          <stop offset="1" stopColor="#3d2e8a" />
        </linearGradient>
      </defs>
      {/* Top face — lightest */}
      <path d="M16 2 L28.1 9 L16 16 L3.9 9 Z" fill="url(#ac-top)" />
      {/* Left face */}
      <path d="M3.9 9 L16 16 L16 30 L3.9 23 Z" fill="url(#ac-left)" />
      {/* Right face — darkest */}
      <path d="M16 16 L28.1 9 L28.1 23 L16 30 Z" fill="url(#ac-right)" />
    </svg>
  );
}
