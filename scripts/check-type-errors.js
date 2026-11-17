#!/usr/bin/env node
// Type-error ratchet.
//
// The app has a backlog of TypeScript errors, and next.config.js lets builds
// ignore them. Rather than block every PR on the whole backlog, this script
// fails only when a change makes the error count go UP, overall or in any one
// file. Fixing errors is always allowed; when the count drops, lower the
// baseline so it can't creep back up:
//
//   yarn typecheck            check against .tsc-baseline.json
//   yarn typecheck --update   rewrite the baseline to the current counts
//
// When the total reaches 0, delete this script and the baseline, run plain
// `tsc` in CI, and set typescript.ignoreBuildErrors to false in next.config.js.

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const baselinePath = path.join(root, ".tsc-baseline.json");
const update = process.argv.includes("--update");

const tsc = require.resolve("typescript/bin/tsc", { paths: [root] });
const run = spawnSync(process.execPath, [tsc, "--noEmit", "--pretty", "false"], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
if (run.error) {
  console.error("Could not run tsc:", run.error.message);
  process.exit(2);
}

const errorLines = (run.stdout + run.stderr)
  .split(/\r?\n/)
  .filter((line) => /error TS\d+:/.test(line));

const files = {};
for (const line of errorLines) {
  const file = line.slice(0, line.indexOf("(")).replace(/\\/g, "/");
  files[file] = (files[file] || 0) + 1;
}
const current = { total: errorLines.length, files: sortKeys(files) };

if (update) {
  fs.writeFileSync(baselinePath, JSON.stringify(current, null, 2) + "\n");
  console.log(`Baseline updated: ${current.total} type errors.`);
  process.exit(0);
}

if (!fs.existsSync(baselinePath)) {
  console.error("No .tsc-baseline.json found. Run `yarn typecheck --update` to create it.");
  process.exit(2);
}
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

const worse = Object.keys(current.files)
  .filter((f) => current.files[f] > (baseline.files[f] || 0))
  .map((f) => ({ file: f, was: baseline.files[f] || 0, now: current.files[f] }));

if (worse.length > 0) {
  console.error(`Type errors went up (baseline ${baseline.total}, now ${current.total}).`);
  console.error("Files with more errors than before:");
  for (const w of worse) console.error(`  ${w.file}: ${w.was} -> ${w.now}`);
  console.error("\nNew errors in those files:");
  const worseFiles = new Set(worse.map((w) => w.file));
  for (const line of errorLines) {
    const file = line.slice(0, line.indexOf("(")).replace(/\\/g, "/");
    if (worseFiles.has(file)) console.error("  " + line);
  }
  console.error("\nFix these, or run `yarn tscheck` to see every error.");
  process.exit(1);
}

if (current.total < baseline.total) {
  console.log(
    `Type errors went down: ${baseline.total} -> ${current.total}. ` +
      "Run `yarn typecheck --update` and commit .tsc-baseline.json to lock in the progress.",
  );
} else {
  console.log(`No new type errors (${current.total}, same as baseline).`);
}

function sortKeys(obj) {
  return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
}
