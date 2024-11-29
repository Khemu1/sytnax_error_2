import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        default: ["Arial, Helvetica, sans-serif"],
        arial: ["Arial, Helvetica, sans-serif"],
        courier: ['"Courier New", Courier, monospace'],
        georgia: ["Georgia, serif"],
        times: ['"Times New Roman", Times, serif'],
        tahoma: ["Tahoma, Geneva, sans-serif"],
        verdana: ["Verdana, Geneva, sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["night"],
  },
};
export default config;
