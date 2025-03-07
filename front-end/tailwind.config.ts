import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
const scrollbarHide = plugin(({ addUtilities }) => {
  addUtilities({
    ".scrollbar-hide": {
      "-ms-overflow-style": "none" /* IE & Edge */,
      "scrollbar-width": "none" /* Firefox */,
    },
    ".scrollbar-hide::-webkit-scrollbar": {
      display: "none" /* Chrome, Safari & Opera */,
    },
  });
});
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [scrollbarHide],
} satisfies Config;
