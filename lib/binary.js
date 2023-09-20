/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { 
  shouldBuffer, 
  shouldSizeArrayOfIntegerPositiveOrZero 
} from "@xan105/is/assert";
import { Failure } from "@xan105/error";

const types = {
  object: 0x00, //map
  string : 0x01,
  int32 : 0x02,
  float32 : 0x03,
  pointer : 0x04,
  wstring : 0x05,
  color: 0x06,
  uint64: 0x07,
  end: 0x08, //end of map
  int64: 0xA,
  end_alt: 0x0B //end of map (alt)
};

//Read Null-terminated string
function readString(buffer, offset, wide = false){
  const encoding = wide ? "utf16le" : "utf8";
  const end = buffer.indexOf(0x00, offset[0]); //look for the end of the string (null-terminated)
  const string = buffer.toString(encoding, offset[0], end); //read the string
  offset[0] = end + 1; //update offset (including null terminator)
  return string;
};

function parse(buffer, offset = [0]) {
  
  shouldBuffer(buffer);
  shouldSizeArrayOfIntegerPositiveOrZero(offset, 1); //offset is an array because it needs to be passed by reference later

  const result = Object.create(null);

  while (offset[0] < buffer.length) {
    const type = buffer.readUInt8(offset[0]);  //first byte indicates which type of data will follow
    offset[0] += 1;
    
    if (type === types.end || type === types.end_alt) break;

    const key = readString(buffer, offset);
    let value;

    switch (type) {
      case types.object: //nested object
        value = parse(buffer, offset); //recursion
        break;
      
      case types.string:
        value = readString(buffer, offset);
        break;

      case types.int32:
      case types.color:
      case types.pointer:
        value = buffer.readInt32LE(offset[0]);
        offset[0] += 4;
        break;

      case types.float32:
        value = buffer.readFloatLE(offset[0]);
        offset[0] += 4;
        break;
        
      case types.wstring:
        value = readString(buffer, offset, true);
        break;
        
      case types.uint64:
        value = buffer.readBigUInt64LE(offset[0]);
        offset[0] += 8;
        break;
      
      case types.int64: {
        value = buffer.readBigInt64LE(offset[0]);
        offset[0] += 8;
        break;
      }
      
      default:
        throw new Failure("Unknown key value type", {
          code: "ERR_UNEXPECTED",
          info: { key, type, offset: offset[0] }
        });
    }
    
    if (key !== "__proto__") //not allowed
      result[key] = value;
  }

  return result;
};

export { parse };