import {createMarkdownArrayTable} from 'parse-markdown-table';
import {MDObject, ITableObj} from './types';
import {toSnakeCase} from '../helpers';

export default async function mdParser(mdCont: string): Promise<MDObject>  {
    const table = await createMarkdownArrayTable(mdCont);
    const tableObjects: MDObject = {};
    let currentHeadline = '';
    const tblMatchRE = /^###\s/gm;
    for await (const row of table.rows) {
      if (row[0].match(tblMatchRE)) {
        currentHeadline = toSnakeCase(row[0].replace("### ",'').trim());
        tableObjects[currentHeadline] = [];
        continue;
      }
      if(row.length > 1) {
        if (row[1].includes('Sub-property') || row[1].includes('Property')) {
          continue;
        }
        if(row[1].includes(':-----')) {
          continue;
        }
      }
  
      if (row.length > 5) {
        if (tableObjects[currentHeadline]) {
          tableObjects[currentHeadline].push({
            attribute: row[1],
            mult: row[2],
            typ: row[3] ? row[3] : '',
            enum: row[4] ? row[4] : '',
            desc: row[5] ? row[5] : ''
          } as ITableObj);
        }
      }
    }
    //Filter out all elements with ### that aren´t tablenames
    return Object.entries(tableObjects).filter((prop:[key: string, value: Array<ITableObj>]) => {
      return prop[1].length > 1;
    }).map((obj)=> {
     return obj[0];
    }).reduce((obj, key) => ({ ...obj, [key]: tableObjects[key] }), {});
  }