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

```js
import { parse } from "@xan105/vdf";
import { readFile } from "node:fs/promises";

const filePath = "C:\\Program Files (x86)\\Steam\\appcache\\localization.vdf";
const string = await readFile(filePath, "utf8");
const vdf = parse(string);
```

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

- translate?: boolean | object 

  translate option accepts the following object for granular control or a boolean which force all options to true/false:
  
|name|type|default|description|
|----|----|-------|-----------|
|bool|boolean|true|String to boolean|
|number|boolean|false|String to number or [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)|
|unsafe|boolean|false|Set to true to keep unsafe integer instead of bigint|

❌ Throws on error

Example:

```js
import { parse } from "@xan105/vdf";
import { readFile } from "node:fs/promises";

const filePath = "steam_input_for_ps4_controller.vdf";
const string = await readFile(filePath, "utf8");

const vdf = parse(string, { translate: {
  bool: true,
  number: true,
  unsafe: false
}});

//All values will be string
const vdf = parse(string, { translate: false });
```

<details>
<summary>⚠️ JSON compatibility</summary>

Some integers will be represented as **BigInt** due to their size if the related translate options are used.<br/>
**BigInt is not a valid value in the JSON spec**.<br/>
As such when stringify-ing the returned object you'll need to handle the JSON stringify replacer function to prevent it to fail.

A common workaround is to represent them as a string:

```js
JSON.stringify(data, function(key, value) {
  if(typeof value === "bigint")
    return value.toString();
  else
    return value;
});
```

</details>

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

<details>
<summary>⚠️ JSON compatibility</summary>

Some numbers will be represented as **BigInt** due to their size ((u)int64).<br/>
**BigInt is not a valid value in the JSON spec**.<br/>
As such when stringify-ing the returned object you'll need to handle the JSON stringify replacer function to prevent it to fail.

A common workaround is to represent them as a string:

```js
JSON.stringify(data, function(key, value) {
  if(typeof value === "bigint")
    return value.toString();
  else
    return value;
});
```

</details>