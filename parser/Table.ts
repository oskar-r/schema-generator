import { toSnakeCase, toPascal } from "../helpers";
import { ITableObj } from "./types";
import Row, { DBDiagramRow, GQLField } from "./Row";

export default class Table {
  name: string;
  columns: Array<Row>

  constructor(name: string, columns: Array<Row>) {
    this.name = name;
    this.columns = columns;
  }

  public toSnake():string {
    return toSnakeCase(this.name);
  }

  public haveIDCol() {
    return this.columns.filter((c) => c.attribute === 'id').length > 0;
  }

  public addColumn(col: Row) {
    this.columns.push(col);
  }

  public convertToDBDTable() {
    return new DBDTable(this.name, this.columns.map((item) => item.convertToDBRow()));
  }

  public convertToGQLType() {
    return new GQLType(this.name, this.columns.map((item) => item.convertToGQLField()));
  }
}

export class DBDTable extends Table {
  dbName: string;
  columns: Array<DBDiagramRow>;

  constructor(name: string, columns: Array<DBDiagramRow>) {
    super(name, []);
    this.name = name;
    this.dbName = toSnakeCase(name);
    this.columns = columns;
  }
  public generateTable(): string {
    const tbls = this.columns.filter((c)=>c.attributeSnake !== '').map((c) => c.rowText()).join('');
    return`Table ${this.dbName} {\n${tbls}}`
  }
  public addColumn(col: DBDiagramRow) {
    this.columns.push(col);
  }
}

export class GQLType extends Table {
  
  fields: Array<GQLField>;

  constructor(name: string, fields: Array<GQLField>) {
    super(name, []);
    this.name = name;
    this.fields = fields;
  }
  public generateTable(): string {
    const fields = this.fields.filter((c)=>c.attribute !== '').map((c) => c.rowText()).join('');
    //const typeName = toPascal(this.dbName, true);
    return`type ${this.name} {\n${fields}}`
  }
  public addColumn(field: GQLField) {
    this.columns.push(field);
  }
}