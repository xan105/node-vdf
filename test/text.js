import { join } from "node:path";
import { dirname } from "@xan105/fs/path";
import { parse } from "../lib/text.js";
import { readFile, writeJSON } from "@xan105/fs";

const buffer = await readFile(join(dirname(import.meta.url), "sample/steam_input_for_ps4_controller.vdf"), "utf8");
const vdf = parse(buffer);
await writeJSON(join(dirname(import.meta.url), "temp/steam_input_for_ps4_controller.json"), vdf);