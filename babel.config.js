module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"],
  plugins: [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-syntax-decorators", { legacy: true }],
  ],
};
