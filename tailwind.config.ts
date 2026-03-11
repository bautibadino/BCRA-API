import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bcra: {
          blue: "#003366",
          red: "#C8102E",
          gray: "#F5F5F5",
          dark: "#1A1A2E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
