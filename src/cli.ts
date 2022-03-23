import { join } from "path";
import {
  NEXTJS_PAGES_DIRECTORY_NAME,
  findFiles,
  generate,
  nextRoutes,
} from "./utils";

const NEXTJS_PAGES_DIRECTORY = join(".", NEXTJS_PAGES_DIRECTORY_NAME);

const files = findFiles(NEXTJS_PAGES_DIRECTORY);
const routes = nextRoutes(files);
const generated = generate(routes);
console.log(generated);
