import {createMarkdownArrayTable, iterateRows} from 'parse-markdown-table';
import {MDObject, ITableObj} from './types';
import {toSnakeCase} from '../helpers';
import Table from './Table';
import Row from '../parser/Row';

export default async function mdParser(mdCont: string): Promise<Array<Table>>  {
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
        if (row[1].includes('Sub-property')
        || row[1].includes('Property')
        || row[1].includes(':-----')) {
          continue;
        }
      }
  
      if (row.length > 5 && tableObjects[currentHeadline]) {
        tableObjects[currentHeadline].push({
          attribute: row[1],
          mult: row[2],
          typ: row[3] ? row[3] : '',
          enum: row[4] ? row[4] : '',
          desc: row[5] ? row[5] : ''
        } as ITableObj);
      }
    }
    //Filter out all elements with ### that aren´t tablenames
    return Object.entries(tableObjects).filter((prop:[key: string, value: Array<ITableObj>]) => {
      return prop[1].length > 1;
    }).map((obj)=> {
     return new Table(obj[0], obj[1].filter((i) => i.attribute !== '').map((item) => new Row(
      item.attribute,
      item.mult,
      item.typ,
      item.enum,
      item.desc,
      )));
    });
  }