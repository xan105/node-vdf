import { join } from "node:path";
import { dirname } from "@xan105/fs/path";
import { parse } from "../lib/binary.js";
import { readFile, writeJSON } from "@xan105/fs";

const buffer = await readFile(join(dirname(import.meta.url), "sample/UserGameStatsSchema_218620.bin"));
const vdf = parse(buffer);
await writeJSON(join(dirname(import.meta.url), "temp/UserGameStatsSchema_218620.json"), vdf);