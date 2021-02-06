import {createMarkdownArrayTable} from 'parse-markdown-table';
import {MDObject, ITableObj} from './types';
import {toSnakeCase} from '../helpers';
import Table from './Table';
import Root from './Root';
import Row from './Row';

export default async function mdParser(mdCont: string): Promise<Root>  {
    const table = await createMarkdownArrayTable(mdCont);
    const tableObjects: MDObject = {};
    const rootObjects:Array<string> = [];
    let currentHeadline = '';
    const tblMatchRE = /^###\s/gm;
    const rootObjectRe = /^\* \[(?<ro>[a-zA-z]{1,})\]\(\#[a-zA-z]{1,}\)/;
    let saveRootProps = false;
    for await (const row of table.rows) {
      //BusinessProp is a list of root objects
      if(row[0].includes('## Business properties')) {
        saveRootProps = true;
      }
      if(saveRootProps && row[0].match(rootObjectRe)) {
        const ro = row[0].match(rootObjectRe)?.groups?.ro;
        if(ro) {
          rootObjects.push(ro);
        }
      }
      if (row[0].match(tblMatchRE)) {
        saveRootProps = false; //all root props should be harvested by now
        currentHeadline = row[0].replace("### ",'').trim();
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
    const tables = Object.entries(tableObjects).filter((prop:[key: string, value: Array<ITableObj>]) => {
      return prop[1].length > 0;
    }).map((obj)=> {
     return new Table(obj[0], obj[1].filter((i) => i.attribute !== '').map((item) => new Row(
      item.attribute,
      item.mult,
      item.typ,
      item.enum,
      item.desc,
      )));
    });
    return new Root(tables, rootObjects);
  }