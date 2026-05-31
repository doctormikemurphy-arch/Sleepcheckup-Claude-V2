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

      {/* Navy rounded-square container — light variant only */}
      {variant === "light" && (
        <rect width="44" height="44" rx="9" fill="#1e3a5f" />
      )}

      {/* Crescent moon — dominant, upper area */}
      <circle cx="21" cy="12" r="11" fill="white" mask={`url(#${id})`} />

      {/* Stars in the navy sky */}
      <circle cx="36" cy="4"  r="1.5" fill="white" />
      <circle cx="40" cy="11" r="1.0" fill="white" />
      <circle cx="37" cy="20" r="1.2" fill="white" />

      {/* Stethoscope — hanging below the crescent */}
      {/* Earpiece dots — positioned just under the crescent arc */}
      <circle cx="14" cy="26" r="2"   fill="white" />
      <circle cx="28" cy="26" r="2"   fill="white" />
      {/* Y-tube from earpieces down to junction */}
      <path
        d="M 14,26 Q 17,31 21,32 Q 25,31 28,26"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Main tube down from junction to chest piece */}
      <line
        x1="21" y1="32" x2="21" y2="36"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Chest piece — outer ring */}
      <circle cx="21" cy="39" r="3.5" fill="none" stroke="white" strokeWidth="2" />
      {/* Chest piece — center dot (diaphragm) */}
      <circle cx="21" cy="39" r="1.2" fill="white" />
    </svg>
  );
}
