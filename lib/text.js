/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.

Based on "simple-vdf" | MIT License
Copyright (c) 2014 Rossen Georgiev
https://github.com/rossengeorgiev/vdf-parser
*/

import { isBoolean, isArray } from "@xan105/is";
import { shouldString, shouldObj } from "@xan105/is/assert";
import { asBoolean } from "@xan105/is/opt";
import { Failure } from "@xan105/error";

function parse(string, option = {}){
  shouldString(string);
  shouldObj(option);
  
  if (isBoolean(option.translate)) {
    option.translate = {
      bool: option.translate, 
      number: option.translate, 
      unsafe: option.translate
    };
  }
  
  const options = {
    translate: {
      bool: asBoolean(option.translate?.bool) ?? true,
      number: asBoolean(option.translate?.number) ?? false,
      unsafe: asBoolean(option.translate?.unsafe) ?? false
    }
  };
  
  const result = Object.create(null);
  const lines = string.split(/[\r\n]+/g);
  
  const stack = [result];
  let expectBracket = false, commentBlock = false;

  //https://github.com/ValvePython/vdf/blob/d76292623e326fb165fe3bdb684832cdf30959d4/vdf/__init__.py#L89
  const regex = new RegExp(
    '^("((?:\\\\.|[^\\\\"])+)"|([A-z0-9\\-\\_\\\\\?\+$%<>]+))' +
    '([ \t]*(' +
    '"((?:\\\\.|[^\\\\"])*)(")?' +
    '|([A-z0-9\\-\\_\\\\\?\*\.\|$<>\/]+)' +
    '))?'
  );

  for (let i = 0; i < lines.length; i++)
  {
    let line = lines[i].trim();

    // skip empty and comment
    if (!line) continue
    
    if (line.startsWith("/*")) { 
      commentBlock = true;
    } 
    
    if (line.endsWith("*/")) {
       commentBlock = false;
       continue;
    }

    if (line.at(0) === "/" || commentBlock) continue;
    
    if (line.at(0) === "#") continue; //Skip file import
    
    //Map: one level deep
    if (line.at(0) === "{") {
      expectBracket = false;
      continue;
    }
    
    if (expectBracket) {
      throw new Failure("Expected bracket", { code: "ERR_SYNTAX", info: {
        atLine: i + 1
      }});
    }
    
    //Map: one level back
    if (line.at(0) === "}") {
      stack.pop();
      continue;
    }
    
    let parsed = false;
    while (!parsed) 
    {
      const kv = regex.exec(line);
      if (kv === null) throw new Failure("Unknown key/value type", { code: "ERR_UNEXPECTED", info: {
        atLine: i + 1,
        line
      }});

      const key = kv[2] ?? kv[3];
      if(key === "__proto__") break; //not allowed
      const val = kv[6] ?? kv[8];

      if (typeof val === "undefined") {
        //New map
        if (isArray(stack.at(-1))){ //nested map inside grouped key
          stack.at(-1).at(-1)[key] ??= Object.create(null);
          stack.push(stack.at(-1).at(-1)[key]);
        }
        else if (Object.hasOwn(stack.at(-1), key)){ //group same key
          if (!isArray(stack.at(-1)[key])) stack.at(-1)[key] = [stack.at(-1)[key]]; //1st time transform into array
          stack.at(-1)[key].push(Object.create(null));
          stack.push(stack.at(-1)[key]);
        } else { //default
          stack.at(-1)[key] ??= Object.create(null);
          stack.push(stack.at(-1)[key]);
        }
        expectBracket = true;
      } else {
        if (!kv[7] && !kv[8]) {
           if (i + 1 >= lines.length) throw new Failure("Unclosed quotes", "ERR_SYNTAX");
           line += "\n" + lines[++i];
           continue;
        }
        
        if (isArray(stack.at(-1))){ //nested map inside grouped key
          stack.at(-1).at(-1)[key] = translate(val, options.translate);
        }
        else if (Object.hasOwn(stack.at(-1), key)){ //group same value
          if (!isArray(stack.at(-1)[key])) stack.at(-1)[key] = [stack.at(-1)[key]]; //1st time transform into array
          stack.at(-1)[key].push(translate(val, options.translate));
        } else { //default
          stack.at(-1)[key] = translate(val, options.translate);
        }
      }
      parsed = true;
    }
  }
  
   if (stack.length !== 1) throw new Failure("Unclosed parenthese", "ERR_SYNTAX");
   return result;
}

function translate(string, options){

  //To Boolean
  if(options.bool === true) {
    if (string.toLowerCase() === "true") return true;
    if (string.toLowerCase() === "false") return false;
  }

  //To Number/BigInt
  if(
    options.number === true &&
    string && !isNaN(string)
  ){
    const number = Number(string);
    return (options.unsafe === false && 
            Number.isInteger(number) && 
            !Number.isSafeInteger(number)) ? BigInt(string) : number;
  }

  //default
  return string;
}

export { parse };