import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

function findDir(cwd: string, dir: string): string | undefined {
  const paths = [join(cwd, dir), join(cwd, "src", dir)];
  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }
}

export function getPagesDirectory(cwd: string): string | undefined {
  return findDir(cwd, "pages");
}

export function getAppDirectory(cwd: string): string | undefined {
  return findDir(cwd, "app");
}

export function findFiles(entry: string): string[] {
  return readdirSync(entry).flatMap((file) => {
    const filepath = join(entry, file);
    if (filepath.includes("node_modules")) {
      return [];
    }
    if (statSync(filepath).isDirectory()) {
      return findFiles(filepath);
    }
    return filepath;
  });
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
