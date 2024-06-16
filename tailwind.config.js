/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {},
    extend: {
      animation: {
        "ping-slow": "ping 0.5s reverse",
      },
    },
  },
  plugins: [],
};
