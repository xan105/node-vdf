import test from "node:test";
import assert from "node:assert";
import { parse } from "../../lib/text.js";

const vdf =
`game	"Team Fortress 2"
//key name with uppercase
GameData	"tf.fgd"
SearchPaths
{
  //special char
  game+mod+custom_mod				tf/tf2_lv.vpk
  game				|all_source_engine_paths|hl2/hl2_textures.vpk
}
`;

test("VDF text | regex special case", () => {
  const expected = {
    game: "Team Fortress 2",
    GameData: "tf.fgd",
    SearchPaths: {
      "game+mod+custom_mod": "tf/tf2_lv.vpk",
      game: "|all_source_engine_paths|hl2/hl2_textures.vpk"
    }
  };

  const actual = parse(vdf);
  assert.deepEqual(actual, expected);
});