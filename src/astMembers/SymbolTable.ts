import { functionDeclaration, VariableDeclarator } from './Node';

export class SymTable {
  name: string;
  private symbolVars: { [id: string]: VariableDeclarator } = {};
  private symbolFuncs: { [id: string]: {[id:string]:functionDeclaration} } = {};
  upperAmbit: SymTable | null;
  constructor(name: string) {
    this.name = name;
    this.upperAmbit = null;
  }

  addUpperAmbit(upperTable: SymTable) {
    this.upperAmbit = upperTable;
  }

  getVariable(id: string): VariableDeclarator | undefined {
    let variable = this.symbolVars[id];
    if (variable !== undefined) {
      return variable;
    } else if (this.upperAmbit !== null) {
      let higherVariable = this.upperAmbit.getVariable(id);
      return higherVariable;
    }
    return undefined;
  }

  getFunction(id: string): functionDeclaration | undefined {
    let reg = /\(.+\)/;
    let generalId = id.replace(reg, '');
    let funcs = this.symbolFuncs[generalId];
    if (funcs !== undefined && funcs[id] !== undefined) {
      return funcs[id];
    } else if (this.upperAmbit !== null) {
      let higherFunc = this.upperAmbit.getFunction(id);
      return higherFunc;
    }
    return undefined;
  }
  addVariable(variable: VariableDeclarator): boolean {

    if (this.isInsertableVar(variable.id.name)) {
      this.symbolVars[variable.id.name] = variable;
      return true;
    }
    return false;
  }

  addFunc(func: functionDeclaration): boolean {        
    if (this.isInsertableFunc(func.nameForTable)) {    
      if(this.symbolFuncs[func.id] === undefined){
        this.symbolFuncs[func.id] = {};
      }
      this.symbolFuncs[func.id][func.nameForTable] = func;      
      return true;
    }
    return false;
  }

  isInsertableVar(id: string): boolean {
    return this.symbolVars[id] === undefined;
  }

  isInsertableFunc(id: string): boolean {
    let reg = /\(.+\)/;
    let generalId = id.replace(reg, '');
    let funcs = this.symbolFuncs[generalId];
    if(funcs === undefined) return true;
    return funcs[id] === undefined;
  }

  itExistsThisFunctionId(id:string):boolean{
    let funcs = this.symbolFuncs[id];
    if(funcs !== undefined){
      return true;
    }
    if(this.upperAmbit === null) return false;
    return this.upperAmbit.itExistsThisFunctionId(id);
  }
}
