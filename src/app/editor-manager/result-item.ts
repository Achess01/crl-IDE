import { Type } from "@angular/core";


export class ResultItem{
  constructor(public component: Type<any>, public data:any){}
}