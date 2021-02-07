import {GQLType} from '../parser/Table';
import { GQLField} from '../parser/Row';
import Root from '../parser/Root';

export default function generateGQLTypes(tableObjects: Array<GQLType>, root:Root):string {
  const cust = `
schema {
  query: Query
}

scalar Date
type Query {
`;
  root.removeDuplicates();
  return cust + root.rootObjects.map((item) => {
    return item.gqlType();
  }).join('\n') +'\n}\n'+ tableObjects.map((tbl) => {
    //Fix each row
    tbl.fields.forEach((row) => {
      row.mdParse();

      //Check that the reference is valid
      const tRef = tableObjects.filter((t) => t.name == row.reference && t.name !== 'Metadata')
      const refColName = 'id';
      if (tRef.length > 0) {
        row.setReference(row.reference, refColName);
        if (!tRef[0].haveIDCol()) {
          tRef[0].addColumn(new GQLField(refColName));
        }
      } else {
        row.referenceText = row.prepareDescription();
      }
    });
    return tbl.generateTable();
  }).join('\n');
}

export function generateTSSchema(tableObjects: Array<GQLType>, root:Root):string {
  const cust = `
export const mySchema = \`
  schema {
    query: Query
  }

  scalar Date
  type Query {
  `;
  root.removeDuplicates();
  return cust + root.rootObjects.map((item) => {
    return item.gqlType();
  }).join('\n') +'\n}\n'+ tableObjects.map((tbl) => {
    //Fix each row
    tbl.fields.forEach((row) => {
      row.mdParse();

      //Check that the reference is valid
      const tRef = tableObjects.filter((t) => t.name == row.reference && t.name !== 'Metadata')
      const refColName = 'id';
      if (tRef.length > 0) {
        row.setReference(row.reference, refColName);
        if (!tRef[0].haveIDCol()) {
          tRef[0].addColumn(new GQLField(refColName));
        }
      } else {
        row.referenceText = row.prepareDescription();
      }
    });
    return tbl.generateTable();
  }).join('\n')+"`\n";
}
  