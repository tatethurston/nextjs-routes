import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

// istanbul ignore next: io mocking not worthwhile
function findDir(dir: string, cwd: string): string | undefined {
  const dirs = [dir, join("src", dir)];
  for (const d of dirs) {
    const path = join(cwd, d);
    if (existsSync(path)) {
      return path;
    }
  }
}

// istanbul ignore next: io mocking not worthwhile
export function getPagesDirectory(cwd: string): string | undefined {
  return findDir("pages", cwd);
}

// istanbul ignore next: io mocking not worthwhile
export function getAppDirectory(cwd: string): string | undefined {
  return findDir("app", cwd);
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

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
