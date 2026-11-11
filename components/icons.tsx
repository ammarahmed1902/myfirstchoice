import { ArrowUpRight } from "lucide-react";
export const Arrow = () => <ArrowUpRight size={17} aria-hidden="true" />;
export function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="brand-mark">
      <path d="M5 23 25 7v49H13V28l-8 5z" fill="currentColor" />
      <path
        d="M59 9H43a22 22 0 0 0 0 45h16V42H44a10 10 0 0 1 0-21h15z"
        fill="currentColor"
      />
      <path d="M34 7h25v10H34z" fill="#bfa06a" />
    </svg>
  );
}
