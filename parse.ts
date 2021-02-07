import {readFileSync, writeFileSync} from 'fs';
import fetch from 'node-fetch';
import mdParser from './parser/mdParser';
import generateDBDTables from './generators/generateDBDTables';
import generateGQLTypes, { generateTSSchema } from './generators/generateGQL';

(async () => {
  var myArgs = process.argv.slice(2);
  const output = (myArgs[0] && myArgs[0].length > 0)?myArgs[0]:'dbd';
  const source = (myArgs[1] && myArgs[1].length > 0)?myArgs[1]:'mdm.md';
  let mdCont = '';
  if (source && source.includes("http")) {
    const resp = await fetch(source);
    mdCont = await resp.text();
  } else {
    mdCont = readFileSync(source, {encoding:'utf8', flag:'r'});
  }
  //If the 
  const tableRoot = await mdParser(mdCont);
  switch (output) {
    case 'dbd':
      const dbdTables = tableRoot.tables.map((item) => item.convertToDBDTable());
      writeFileSync('schema.db', generateDBDTables(dbdTables), {encoding:'utf8', flag:'w'});
      break;
    case 'graphql':
      const gqlTypes = tableRoot.tables.map((item) => item.convertToGQLType());
      writeFileSync('schema.gql', generateGQLTypes(gqlTypes, tableRoot), {encoding:'utf8', flag:'w'});
      writeFileSync('schema.ts', generateTSSchema(gqlTypes, tableRoot), {encoding:'utf8', flag:'w'});
      break;
    default:
      console.log('Unknown output '+output +'use db or graphql');
  }
})().catch(e => {
  console.error(e);
});