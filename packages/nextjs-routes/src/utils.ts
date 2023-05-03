import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

// istanbul ignore next: io mocking not worthwhile
function findDir(cwd: string, dir: string): string | undefined {
  const paths = [join(cwd, dir), join(cwd, "src", dir)];
  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }
}

// istanbul ignore next: io mocking not worthwhile
export function getPagesDirectory(cwd: string): string | undefined {
  return findDir(cwd, "pages");
}

// istanbul ignore next: io mocking not worthwhile
export function getAppDirectory(cwd: string): string | undefined {
  return findDir(cwd, "app");
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
