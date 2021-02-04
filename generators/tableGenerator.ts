import {toSnakeCase} from '../helpers';
import {DBDTable} from '../parser/Table';
import { DBDiagramRow} from '../parser/Row';
import {MDObject} from '../parser/types';

export default function generateTables(tableObjects: Array<DBDTable>):string {
  return tableObjects.map((tbl) => {
    //Fix each row
    tbl.columns.forEach((row) => {
      row.mdParse();

      //Check that the reference is valid
      const tRef = tableObjects.filter((t) => t.name == row.reference && t.dbName !== 'metadata')
      const refColName = 'id';
      if (tRef.length > 0) {
        row.setReference(row.reference, refColName);
        if (!tRef[0].haveIDCol()) {
          tRef[0].addColumn(new DBDiagramRow(refColName));
        }
      } else {
        row.referenceText = row.prepareDescription();
      }
    });
    return tbl.generateTable();
  }).join('\n');
}
  
  