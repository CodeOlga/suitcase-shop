module.exports = {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["stylelint-scss"],
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
};
