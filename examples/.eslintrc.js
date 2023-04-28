// const path = require("node:path");
module.exports = {
  rules: {
    "no-console": "off",
    "class-methods-use-this": "off",
    // FIXME: make this rule works in vscode and CLI (relative paths issue)
    // "import/no-extraneous-dependencies": ["error", { packageDir: ["../", "./"] }],
    // "import/no-extraneous-dependencies": [
    //   "error",
    //   // { packageDir: [path.resolve(__dirname, "../"), path.resolve(__dirname, "./")] },
    //   { packageDir: [path.resolve(__dirname, "./")] },
    // ],
    "import/no-extraneous-dependencies": "off",
  },
};
