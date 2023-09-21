import test from "node:test";
import assert from "node:assert";
import { parse } from "../../lib/text.js";

const vdf =
`"description"		"This is an example object!"
/*
block
*/
"float"		"2307.1997"
//
// blabla
// blabla
// blabla
//
"number"		"200" //inline
#base another.file
"string"		"string"
"map"     //inline
{
}
`;

test("VDF text | ignoring comment", (t) => {
  const expected = {
    description: "This is an example object!",
    float: "2307.1997",
    number: "200",
    string: "string",
    map: {}
  };

  const actual = parse(vdf);
  assert.deepEqual(actual, expected);
});