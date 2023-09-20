import { Buffer } from "node:buffer";
import { join } from "node:path";
import { dirname } from "@xan105/fs/path";
import { parse } from "../lib/index.js";
import { readFile } from "@xan105/fs";

const buffer = await readFile(join(dirname(import.meta.url), "sample/meta.txt"));
const vdf = parse(buffer);
console.log(vdf);

