export const toSnakeCase = (str: string):string => 
  str && str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
    .map(x => x.toLowerCase())
    .join('_');

export const toPascal = (str: string, firstUpper: boolean):string => {
  const regex = /^.?$|_([a-z])/gm;
  const regexFirstToUpper = /^([a-z])/gm;
  const trans =  (firstUpper) ?
  str.replace(regex, (m, chr) => chr.toUpperCase()).replace(regexFirstToUpper, (m, chr) => chr.toUpperCase()) :
  str.replace(regex, (m, chr) => chr.toUpperCase());
  return trans;
}

export const cleanUpDescriptions = (str: string): string => {
  const regex = /\"(.*)\"/gm;
    return '"'+str.replace('http://','').replace("'",'').replace(regex,'$1')+'"';
}