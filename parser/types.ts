export type MDObject = {[table: string]: Array<ITableObj>};

export interface ITableObj {
  attribute:string;
  mult:string;
  typ:string;
  enum:string;
  desc:string;
}
