import process from "node:process";
import { shellcheck } from "shellcheck";
import sh from "shelljs";

shellcheck({
  stdio: "inherit",
  args: sh.find(process.argv.slice(2)),
})
  .then(result => {
    // Check error
    if (result.error) throw result.error;

    // Print stdout
    if (result.stdout) process.stdout.write(result.stdout);
    // Print stderr
    if (result.stderr) process.stderr.write(result.stderr);

    // Exit
    process.exit(result.status ?? 1);
  })
  .catch(err => {
    throw err;
  });
