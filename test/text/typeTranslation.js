import test from "node:test";
import assert from "node:assert";
import { parse } from "../../lib/text.js";

const vdf =
`"description"		"This is an example object!"
"types"
{
  "string"		"string"
  "boolean"		"true"
  "number"		"529"
  "float"		"2307.1997"
  "int64"   "9007199254740991"
  "empty"		""
}
`;

test("VDF text | translate type | default", (t) => {
  const expected = {
    description: "This is an example object!",
    types: {
      string: "string",
      boolean: true,
      number: "529",
      float: "2307.1997",
      int64: "9007199254740991",
      empty: ""
    }
  };

  const actual = parse(vdf);
  assert.deepEqual(actual, expected);
});

test("VDF text | translate type | on", (t) => {
  const expected = {
    description: "This is an example object!",
    types: {
      string: "string",
      boolean: true,
      number: 529,
      float: 2307.1997,
      int64: 9007199254740991n,
      empty: ""
    }
  };

  const actual = parse(vdf, { translate: true });
  assert.deepEqual(actual, expected);
});

test("VDF text | translate type | off", (t) => {
  const expected = {
    description: "This is an example object!",
    types: {
      string: "string",
      boolean: "true",
      number: "529",
      float: "2307.1997",
      int64: "9007199254740991",
      empty: ""
    }
  };

  const actual = parse(vdf, { translate: false });
  assert.deepEqual(actual, expected);
});