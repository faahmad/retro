module.exports = {
  "web/src/**/*.{js,jsx,ts,tsx}": [
    "yarn workspace web run lint",
    "yarn workspace web run prettier",
  ],
};
