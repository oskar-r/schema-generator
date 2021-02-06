import Table from "./Table";

export default class Root {
  tables: Array<Table>;
  rootObjects!:Array<string>;

  constructor(tables: Array<Table>, rootObjects:Array<string>=[]) {
    this.tables = tables;
    this.rootObjects = rootObjects;
  }
}