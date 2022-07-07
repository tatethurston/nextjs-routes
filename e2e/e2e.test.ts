import { spawnSync } from "child_process";

function run(cmd: string) {
  return spawnSync(cmd, { shell: true, encoding: "utf8" });
}

describe("e2e", () => {
  process.chdir(__dirname);

  it.each(["node ../dist/cli.js", "yarn tsc --noEmit"])("%s", (cmd) => {
    const result = run(cmd);
    if (result.status !== 0) {
      console.log(result.output);
    }
    expect(result.status).toEqual(0);
  });
});
