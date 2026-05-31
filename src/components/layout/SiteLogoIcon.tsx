interface SiteLogoIconProps {
  size?: number;
  className?: string;
  variant?: "light" | "dark";
}

export function SiteLogoIcon({ size = 36, className = "", variant = "light" }: SiteLogoIconProps) {
  const id = `crescent-mask-${size}-${variant}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id={id}>
          <rect width="44" height="44" fill="black" />
          <circle cx="21" cy="12" r="11" fill="white" />
          <circle cx="27" cy="12" r="7.5" fill="black" />
        </mask>
      </defs>
      {variant === "light" && (
        <rect width="44" height="44" rx="9" fill="#1e3a5f" />
      )}
      <circle cx="21" cy="12" r="11" fill="white" mask={`url(#${id})`} />
      <circle cx="36" cy="4"  r="1.5" fill="white" />
      <circle cx="40" cy="11" r="1.0" fill="white" />
      <circle cx="37" cy="20" r="1.2" fill="white" />
      <circle cx="14" cy="26" r="2"   fill="white" />
      <circle cx="28" cy="26" r="2"   fill="white" />
      <path
        d="M 14,26 Q 17,31 21,32 Q 25,31 28,26"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="21" y1="32" x2="21" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="21" cy="39" r="3.5" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="21" cy="39" r="1.2" fill="white" />
    </svg>
  );
}
