import test from "node:test";
import assert from "node:assert";
import { join } from "node:path";
import { dirname } from "@xan105/fs/path";
import { readJSON, readFile } from "@xan105/fs";
import { parse } from "../../lib/binary.js";

const dir = join(dirname(import.meta.url), "sample");

const files = [
  join(dir, "meta.bin"),
  join(dir, "UserGameStats_10794168_221380.bin"),
  join(dir, "UserGameStatsSchema_218620.bin")
];

test("VDF binary | real samples", async (t) => {
  for (const file of files){
    try{
      const buffer = await readFile(file);
      const actual = parse(buffer);
      const expected = await readJSON(file.replace(".bin",".json"));
      assert.deepEqual(actual, expected);
    }catch(err){
      err.file = file;
      throw err;
    }
  }
});