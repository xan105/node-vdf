import test from "node:test";
import assert from "node:assert";
import { parse } from "../../lib/text.js";

const vdf =
`"game"
{
  name	"Team Fortress 2"
  files
  {
    vpk			tf/tf2_textures.vpk
    vpk			tf/tf2_sound_vo_english.vpk
    vpk			tf/tf2_sound_misc.vpk
  }
  "group"
  {
    "id"		"0"
    "inputs"
    {
      "button_a"
      {
        "binding"		"xinput_button A, , "
      }
      "button_b"
      {
        "binding"		"xinput_button B, , "
      }
    }
  }
  "group"
  {
    "id"		"1"
    "inputs"
    {
    }
  }
  "group"
  {
    "id"		"2"
    "inputs"
    {
      "button_a"
      {
        "bindings"
        {
          "binding"		"xinput_button JOYSTICK_RIGHT, , "
        }
        "settings"
        {
          "haptic_intensity"		"2"
          "haptic_intensity"		"4"
        }
      }
    }
  }
}
`;

test("VDF text | grouping duplicate keys", () => {
  const expected = {
    game: {
      name: "Team Fortress 2",
      files: {
        vpk: [
          "tf/tf2_textures.vpk",
          "tf/tf2_sound_vo_english.vpk",
          "tf/tf2_sound_misc.vpk"
        ]
      },
      group: [
        {
          id: "0",
          inputs: {
            button_a: {
              binding: "xinput_button A, , "
            },
            button_b: {
              binding: "xinput_button B, , "
            }
          }
        },
        {
          id: "1",
          inputs: {}
        },
        {
          id: "2",
          inputs: {
            button_a: {
              bindings: {
                binding: "xinput_button JOYSTICK_RIGHT, , "
              },
              settings: {
                haptic_intensity:	["2", "4"]
              }
            }
          }
        } 
      ]
    }
  };

  const actual = parse(vdf);
  assert.deepEqual(actual, expected);
});