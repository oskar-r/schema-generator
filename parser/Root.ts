import { cleanUpDescriptions } from "../helpers";
import Table from "./Table";

export default class Root {
  tables: Array<Table>;
  rootObjects!:Array<RootObject>;

  constructor(tables: Array<Table>, rootObjects:Array<RootObject>=[]) {
    this.tables = tables;
    this.rootObjects = rootObjects;
  }

  public removeDuplicates() {
    this.rootObjects = this.rootObjects.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.name === thing.name
      ))
    );
  }

  public updateCardForRootObject(name: string, cardinality: string) {
    this.rootObjects.forEach((item, index) => {
      if(item.name === name) {
        this.rootObjects[index].cardinality = cardinality;
      }
    });
  }
}

export class RootObject {
  name: string;
  desc: string;
  cardinality: string;

  constructor(name:string, cardinality:string, desc:string='') {
    this.name = name;
    this.cardinality = cardinality;
    this.desc = desc;
  }

  //Todo move to own class
  public gqlType() {
    if (this.cardinality.includes("many")) {
      return '\t'+cleanUpDescriptions(this.desc)+'\n\t'+this.name.charAt(0).toLowerCase()+this.name.slice(1)+': ['+this.name+']';
    }
    return '\t'+cleanUpDescriptions(this.desc)+'\n\t'+this.name.charAt(0).toLowerCase()+this.name.slice(1)+': '+this.name;
  }
}