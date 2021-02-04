import {readFileSync, writeFileSync} from 'fs';
import fetch from 'node-fetch';
import mdParser from './parser/mdParser';
import generateDBDTables from './generators/generateDBDTables';

(async () => {
  var myArgs = process.argv.slice(2);
  let mdCont = '';
  if (myArgs[0] && myArgs[0].includes("http")) {
    const resp = await fetch(myArgs[0]);
    mdCont = await resp.text();
  } else {
    const filename = (myArgs[0] && myArgs[0].length > 0) ? myArgs[0] : 'mdm.md'
    mdCont = readFileSync(filename, {encoding:'utf8', flag:'r'});
  }
  const tableObjects = await mdParser(mdCont);
  const dbdTables = tableObjects.map((item) => item.convertToDBDTable());

  writeFileSync('schema.db', generateDBDTables(dbdTables), {encoding:'utf8', flag:'w'});
})().catch(e => {
  console.error(e);
});