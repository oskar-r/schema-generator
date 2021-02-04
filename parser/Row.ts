import { toSnakeCase } from "../helpers";

export default class TblRow {
  attribute:string;
  attributeSnake:string;
  cardinality:string;
  dataType:string;
  enumeration:string;
  description:string;
  depreciated!:boolean;
  reference!:string;

  constructor(
    attribute: string,
    cardinality: string,
    dataType: string,
    enumeration: string,
    description: string,
  ) {
    this.attribute = attribute;
    this.attributeSnake = toSnakeCase(attribute);
    this.cardinality = cardinality;
    this.dataType = dataType;
    this.enumeration = enumeration;
    this.description = description;
  }

  public mdParse() {
    //~ indicates a deprecated property
    this.depreciated = this.dataType.includes('#') && this.dataType.includes('~');

    //# indicates that the tpe referees to another object e.g. [Metadata](#Metadata)
    this.reference = toSnakeCase(
      this.dataType.includes('#')?
        this.dataType.trim()
        .split('#')[1].replace(')','')
        .replace('~','')
      :
      ''
    );
    const t = this.dataType.includes(']') ?
    this.dataType.trim().split("]")[0].replace('[',''): this.dataType;
    //If not an reference then there is a need to fix type
    switch (t) {
      case 'KeyValues':
        this.dataType = 'json';
        break;
      case '?':
        this.dataType = 'string';
        break;
      default:
        this.dataType = (this.reference === '')?t:'uuid';
    }
  }

  public convertToDBRow() {
    return new DBDiagramRow(
      this.attribute,
      this.cardinality,
      this.dataType,
      this.enumeration,
      this.description);
  }
}

export class DBDiagramRow extends TblRow {
    referenceText:string; //Move to other class
    //DB Diagram specific
    constructor(
      attribute: string = 'id',
      cardinality: string = '',
      dataType: string = 'uuid',
      enumeration: string = '',
      description: string = 'auto generated id') {
      super(attribute,cardinality, dataType, enumeration, description);
      this.referenceText = '';
    }
    //Call this for DB Diagrams specific parsing
    

    private diagramNote() {
      return this.description != '' ? `[note: '${this.description.replace("'",'').replace('https://','')}']`:  `[note: '${this.description}']`
    }

    public mdParse() {
      super.mdParse();
      //Create description in note format
      this.diagramNote();
    }
    private diagamCardinality() {
      switch (this.cardinality) {
        case "0 - 1":
          this.cardinality =  '-'; //One-to-One;
          break;
        case "0-1":
          this.cardinality =  '-'; //One-to-One;
          break;
        case "1":
          this.cardinality =   '-'; //One-to-One;
          break;
        case "1 - n":
          this.cardinality =   '<';
          break;
        case "1-n":
          this.cardinality =   '<';
          break;
        case "0 - n":
          this.cardinality =   '<';
          break;
        default:
          this.cardinality =   '<';
      }
    }

    //Need to verify that table exists before setting reference
    public setReference(reference: string, refVar:string = 'id') {
      this.diagamCardinality();
      this.referenceText = `[ref: ${this.cardinality} ${reference}.${refVar}]`;
    }

    public prepareDescription():string {
      return (this.reference === 'metadata') ?
      "[note: 'Metadata table relation excluded']":
      "[note: '"+this.description.replace('http://','').replace("'",'')+"']";
    }

    public rowText() {
      return `\t${this.attributeSnake} ${this.dataType} ${this.referenceText}\n`;
    }

}