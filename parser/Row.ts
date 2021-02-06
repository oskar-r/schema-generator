import { toSnakeCase, toPascal } from "../helpers";

export default class TblRow {
  attribute:string;
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

  public convertToGQLField() {
    return new GQLField(
      this.attribute,
      this.cardinality,
      this.dataType,
      this.enumeration,
      this.description);
  }
}

export class DBDiagramRow extends TblRow {
    referenceText:string; //Move to other class
    attributeSnake:string;
    //DB Diagram specific
    constructor(
      attribute: string = 'id',
      cardinality: string = '',
      dataType: string = 'uuid',
      enumeration: string = '',
      description: string = 'auto generated id') {
      super(attribute,cardinality, dataType, enumeration, description);
      this.referenceText = '';
      this.attributeSnake = toSnakeCase(attribute);
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

export class GQLField extends TblRow {
  referenceText:string; //Move to other class
  //DB Diagram specific
  constructor(
    attribute: string = 'id',
    cardinality: string = '',
    dataType: string = 'ID',
    enumeration: string = '',
    description: string = 'auto generated id') {
    super(attribute,cardinality, dataType, enumeration, description);
    this.referenceText = '';
  }
  //Call this for DB Diagrams specific parsing
  

  private diagramNote() {
    return this.description != '' ? `#${this.description.replace("'",'').replace('https://','')}`:  `#${this.description}']`
  }

  public mdParse() {
    super.mdParse();
    //Create description in note format
    this.diagramNote();
  }
  private diagamCardinality() {
    switch (this.cardinality) {
      case "0 - 1":
        this.cardinality =  '$1'; //One-to-One;
        break;
      case "0-1":
        this.cardinality =  '$1'; //One-to-One;
        break;
      case "1":
        this.cardinality =   '$1'; //One-to-One;
        break;
      case "1 - n":
        this.cardinality =   '[$1]';
        break;
      case "1-n":
        this.cardinality =   '[$1]';
        break;
      case "0 - n":
        this.cardinality =   '[$1]';
        break;
      default:
        this.cardinality =   '[$1]';
    }
  }

  //Need to verify that table exists before setting reference
  public setReference(referenceType: string, refVar:string = 'id') {
    this.diagamCardinality();
    this.dataType = this.cardinality.replace("$1", toPascal(referenceType, true));
  }

  public prepareDescription():string {
    return (this.reference === 'metadata') ?
    "#Metadata table relation excluded":
    "#"+this.description.replace('http://','').replace("'",'');
  }

  private fixType():string {
   switch (this.dataType) {
     case "string":
       return "String";
      case "enum":
        return "String";
      case "uInteger":
        return "Int";
      case "sInteger":
        return "Int";
      case "timestamp":
        return "Date";
      case "uuid":
        return "String";
      case "date":
        return "Date";
      case "boolean":
        return "Boolean"
    }
    return this.dataType;
  }

  public rowText() {
    const dt = this.fixType()
    return `\t${this.referenceText}\n\t${this.attribute}: ${dt}\n`;
  }
}