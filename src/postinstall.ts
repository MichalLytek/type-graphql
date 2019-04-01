// tslint:disable
/* Adapted from nodemon's postinstall: https://github.com/remy/nodemon/blob/master/bin/postinstall.js */

function printSupportMessage() {
  console.log(
    "\u001b[32mLove TypeGraphQL or use it at work? \nYou can now support the project via the Open Collective:\u001b[22m\u001b[39m\n > \u001b[96m\u001b[1mhttps://opencollective.com/typegraphql\u001b[0m\n",
  );
}

if (!process.env.SUPPRESS_SUPPORT) {
  try {
    const Configstore = require("configstore");
    const pkg = require("../package.json");

    const now = Date.now();
    const week = 1000 * 60 * 60 * 24 * 7;
    const conf = new Configstore(pkg.name);
    const last = conf.get("lastCheck");

    if (!last || now - week > last) {
      printSupportMessage();
      conf.set("lastCheck", now);
    }
  } catch (e) {
    printSupportMessage();
  }
}
