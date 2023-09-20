About
=====

Valve VDF Key/Value format parser (text and binary).

This format can be found in Steam protobuffer message and in the Steam Client files as well as some Source Engine stuff.

📦 Scoped `@xan105` packages are for my own personal use but feel free to use them.

Example
=======

Reading binary VDF .bin file

```js
import { parse } from "@xan105/vdf/binary";
import { readFile } from "node:fs/promises";

const filePath = "C:\\Program Files (x86)\\Steam\\appcache\\stats\\UserGameStatsSchema_218620.bin";
const buffer = await readFile(filePath);
const vdf = parse(buffer);
```

Reading text VDF file

Install
=======

```
npm install @xan105/vdf
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM).

## Named export

#### `parse(string: string, option?: object): object`

Decode the VDF key/value text formatted string into an object.

⚙️ Options

❌ Throws on error

Example:

```js
import { parse } from "@xan105/vdf";
import { readFile } from "node:fs/promises";

const filePath = "steam_input_for_ps4_controller.vdf";
const string = await readFile(filePath, "utf8");
const vdf = parse(string);
```

⚠️ JSON compatibility

Some integers will be represented as **BigInt** due to their size if the related translate option is used.
**BigInt is not a valid value in the JSON spec**.
As such when stringify-ing the returned object you'll need to handle the JSON stringify replacer function to prevent it to fail.

A common workaround is to represent it as a string:

```js
JSON.stringify(data, function(key, value) {
  if(typeof value === "bigint")
    return value.toString();
  else
    return value;
});
```

### `binary`

#### `parse(buffer: buffer, offset?: number[]): object`

Decode the VDF key/value binary formatted buffer into an object (starting at the given offset if any).

_NB: offset is an array so it can be passed by reference_

❌ Throws on error

Example:

```js
import { parse } from "@xan105/vdf/binary";
import { readFile } from "node:fs/promises";

const filePath = "C:\\Program Files (x86)\\Steam\\appcache\\stats\\UserGameStatsSchema_218620.bin";
const buffer = await readFile(filePath);
const vdf = parse(buffer);
```

💡 Note that binary ".vdf" file usually requires additional processing like handling file header.

```js

```

⚠️ JSON compatibility

Some numbers will be represented as **BigInt** due to their size ((u)int64).
**BigInt is not a valid value in the JSON spec**.
As such when stringify-ing the returned object you'll need to handle the JSON stringify replacer function to prevent it to fail.

A common workaround is to represent it as a string:

```js
JSON.stringify(data, function(key, value) {
  if(typeof value === "bigint")
    return value.toString();
  else
    return value;
});
```