import {
  CallFunction,
  forStmt,
  functionDeclaration,
  functionMain,
  IfStmt,
  Mostrar,
  Type,
  UnaryExpression,
  VariableDeclarator,
  whileStmt,
} from 'src/astMembers/Node';
import Visitor from './Visitor';
import * as deepAssign from 'object-assign-deep';

class ExecuteVisitor extends Visitor {
  override visitCallFunction(node: CallFunction): void {
    if (this.ambit) {
      let func = this.ambit.getFunction(node.getTableName(), this.global);
      if (func) {
        let nf = this.cloneFunction(func);                
      }
    }
  }

  cloneFunction(func: functionDeclaration): functionDeclaration {
    let nf = Object.assign(
      new functionDeclaration({}, '', [], Type.Void, []),
      func
    );
    this.cloneTable(func, nf);
    return nf;
  }

  cloneFor(old: forStmt){
    let nf = Object.assign(
      new forStmt({},[],old.init,old.test,old.update),
      old
    );
    this.cloneTable(old, nf);
    return nf;
  }

  cloneWhile(old: whileStmt){
    let nf = Object.assign(
      new whileStmt({},[],old.test),
      old
    );
    this.cloneTable(old, nf);
    return nf;
  }

  cloneIf(old: IfStmt){
    let nf = Object.assign(
      new IfStmt({},old.test,[],[]),
      old
    );
    this.cloneTableIf(old, nf);
    return nf;
  }

  cloneTable(
    oldB: functionDeclaration | whileStmt | forStmt,
    newB: functionDeclaration | whileStmt | forStmt
  ) {
    newB.table = Object.assign({}, oldB.table);
    let vars = newB.table.symbolVars;
    let newVars: { [id: string]: VariableDeclarator } = {};
    for (const key in vars) {
      const old_var = vars[key];
      const cloned_var = Object.assign(
        new VariableDeclarator({}, old_var.id, null),
        old_var
      );
      newVars[key] = cloned_var;
      //cloned_var.init = new UnaryExpression({},Type.Void,'0',`logrado ${key}`);
    }
    newB.table.symbolVars = newVars;
  }

  cloneTableIf(
    oldB: IfStmt,
    newB: IfStmt
  ) {
    /* Consequent table */    
    newB.table = Object.assign({}, oldB.table);
    let vars = newB.table.symbolVars;
    let newVars: { [id: string]: VariableDeclarator } = {};
    for (const key in vars) {
      const old_var = vars[key];
      const cloned_var = Object.assign(
        new VariableDeclarator({}, old_var.id, null),
        old_var
      );
      newVars[key] = cloned_var;
      //cloned_var.init = new UnaryExpression({},Type.Void,'0',`logrado ${key}`);
    }
    newB.table.symbolVars = newVars;

    /* Alternate table */
    newB.tableAlternate = Object.assign({}, oldB.tableAlternate);
    let varsAlt = newB.tableAlternate.symbolVars;
    let newVarsAlt: { [id: string]: VariableDeclarator } = {};
    for (const key in varsAlt) {
      const old_var = varsAlt[key];
      const cloned_var = Object.assign(
        new VariableDeclarator({}, old_var.id, null),
        old_var
      );
      newVarsAlt[key] = cloned_var;
      //cloned_var.init = new UnaryExpression({},Type.Void,'0',`logrado ${key}`);
    }
    newB.tableAlternate.symbolVars = newVars;
  }


  override visitIfStmt(node: IfStmt): void {
    console.log(this.ambit);
  }

  override visitMostrar(node: Mostrar): void {
    console.log('Mostrar ambit');
    console.log(this.ambit);
  }

  override visitfunctionMain(node: functionMain): void {}
}

export default ExecuteVisitor;
