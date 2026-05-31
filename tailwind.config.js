/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens from brief
        primary: {
          DEFAULT: "#1D4ED8",
          hover: "#1E40AF",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          soft: "#64748B",
        },
        bg: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
          tint: "#EFF6FF",
        },
        border: "#E2E8F0",
        success: "#15803D",
        warning: "#B45309",
        danger: "#B91C1C",
        // shadcn/ui compatibility (HSL-based CSS vars)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      fontSize: {
        display: ["44px", { lineHeight: "1.15", fontWeight: "700" }],
        h1: ["34px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["26px", { lineHeight: "1.25", fontWeight: "700" }],
        h3: ["20px", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["17px", { lineHeight: "1.65" }],
        small: ["15px", { lineHeight: "1.55" }],
        tiny: ["13px", { lineHeight: "1.5" }],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        DEFAULT: "6px",
        // shadcn compat
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      borderColor: {
        DEFAULT: "#E2E8F0",
      },
      spacing: {
        "section-desktop": "80px",
        "section-mobile": "56px",
        "tap": "48px",
      },
      minHeight: {
        tap: "48px",
      },
      minWidth: {
        tap: "48px",
      },
    },
  },
  plugins: [],
};
