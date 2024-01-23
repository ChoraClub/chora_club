import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "blue-shade-100": "#004DFF",
        "blue-shade-200": "#0500FF",
        "blue-shade-300": "#0238B3",
      },
      fontFamily: {
        quanty: ["var(--font-quanty)"],
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};
export default config;
