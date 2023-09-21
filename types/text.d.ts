declare interface Translate {
  bool?: boolean, 
  number?: boolean,
  unsafe?: boolean
}

declare interface Options {
  translate?: boolean | Translate
}

export function parse(string: string, option?: Options): object;
