import test from "node:test";
import assert from "node:assert";
import { join } from "node:path";
import { dirname } from "@xan105/fs/path";
import { readJSON, readFile } from "@xan105/fs";
import { parse } from "../../lib/text.js";

const dir = join(dirname(import.meta.url), "sample");

const files = [
  join(dir, "example.vdf"),
  join(dir, "gameinfo.vdf"),
  join(dir, "localization.vdf"),
  join(dir, "steam_input_for_ps4_controller.vdf"),
];

test("VDF text | real samples", async (t) => {
  for (const file of files){
    const vdf = await readFile(file, "utf8");
    const actual = parse(vdf);
    const expected = await readJSON(file.replace(".vdf",".json"));
    assert.deepEqual(actual, expected);
  }
});