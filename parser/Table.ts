import { toSnakeCase } from "../helpers";
import { ITableObj } from "./types";
import Row, { DBDiagramRow } from "./Row";

export default class Table {
  name: string;
  dbName: string;
  columns: Array<Row>

  constructor(name: string, columns: Array<Row>) {
    this.name = name;
    this.dbName = toSnakeCase(name);
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
}

export class DBDTable extends Table {
  
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
