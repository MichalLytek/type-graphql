#!/usr/bin/env ts-node

import { generate } from "./prisma-generator";

let dataBuffer = "";

process.stdin.on("data", async data => {
  dataBuffer += data;
  if (dataBuffer.endsWith("\n")) {
    try {
      const options = JSON.parse(dataBuffer);
      await generate(options);
      process.exit(0);
    } catch {
      process.exit(1);
    }
  }
});

process.stdin.setEncoding("utf8");
process.stdin.resume();
