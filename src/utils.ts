import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

// istanbul ignore next: io mocking not worthwhile
export function getPagesDirectory(): string | undefined {
  const dirs = ["pages", join("src", "pages")];
  for (const dir of dirs) {
    if (existsSync(dir)) {
      return dir;
    }
  }
}

// istanbul ignore next: io mocking not worthwhile
export function findFiles(entry: string): string[] {
  return readdirSync(entry).flatMap((file) => {
    const filepath = join(entry, file);
    if (
      statSync(filepath).isDirectory() &&
      !filepath.includes("node_modules")
    ) {
      return findFiles(filepath);
    }
    return filepath;
  });
}
