// Use this link to see all the available configuration options:
// https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
module.exports = {
  theme: {
    boxShadow: (theme) => ({
      default: `${theme("spacing.1")} ${theme("spacing.1")} currentColor`,
      red: `${theme("spacing.1")} ${theme("spacing.1")} ${theme("colors.red")}`,
      blue: `${theme("spacing.1")} ${theme("spacing.1")} ${theme("colors.blue")}`,
      pink: `${theme("spacing.1")} ${theme("spacing.1")} ${theme("colors.pink")}`
    }),
    colors: {
      blue: "#11269c",
      red: "#ff596a",
      pink: "#ff94b8",
      white: "#ffffff",
      black: "#000000",
      gray: "#6b7280"
    },
    fontFamily: {
      display: ["Source Code Pro", "monospace"],
      body: ["Source Code Pro", "monospace"]
    },
    extend: {
      height: {
        72: "18rem",
        80: "20rem",
        88: "22rem",
        96: "24rem"
      },
      maxWidth: {
        "7xl": "80rem",
        "8xl": "88rem"
      },
      zIndex: {
        "-1": "-1"
      }
    }
  },
  variants: {},
  plugins: []
};
