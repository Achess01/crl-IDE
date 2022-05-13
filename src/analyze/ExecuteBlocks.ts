import {
  functionDeclaration,
  VariableDeclarator,
  Assignment,
  functionMain,
  whileStmt,
  forStmt,
  IfStmt,
  returnStmt,
  Mostrar,
  DibujarAST,
  Node,
  DibujarEXP,
  CallFunction,
  Type,
  breakStmt,
  continueStmt,
} from 'src/astMembers/Node';
import { SymTable } from 'src/astMembers/SymbolTable';
import Visitor from './Visitor';

export class returnTypes {
  isContinue: boolean = false;
  isBreak: boolean = false;
  isReturned: boolean;
  value: any;
  constructor(isReturned: boolean) {
    this.isReturned = isReturned;
  }
}

export function runIf(if_stmt: IfStmt, visitor: Visitor): returnTypes {  
  if (if_stmt.test.value) {
    visitor.ambit = if_stmt.table;
    let returned = runBlock(if_stmt.table, if_stmt.consequent, visitor);
    if (returned.isReturned) return returned;
  } else {
    visitor.ambit = if_stmt.tableAlternate;
    let returned = runBlock(if_stmt.tableAlternate, if_stmt.alternate, visitor);
    if (returned.isReturned) return returned;
  }
  return new returnTypes(false);
}

export function runFor(for_stmt: forStmt, visitor: Visitor): returnTypes {  
  visitor.ambit = for_stmt.table;
  while(for_stmt.test.value){
    let returned = runBlock(for_stmt.table, for_stmt.body, visitor);
    if(returned.isReturned){
      if(returned.isBreak) break;
      if(returned.isContinue) continue;
      return returned;
    }
    let name= for_stmt.init.id.name;
    let iterator = for_stmt.table.getVariable(name);
    if(iterator){
      switch(for_stmt.update){
        case '++': iterator.value = iterator.value + 1; break;
        case '--': iterator.value = iterator.value - 1; break;
      }
    }
  }
  return new returnTypes(false);
}

export function runWhile(while_stmt: whileStmt, visitor: Visitor): returnTypes {
  visitor.ambit = while_stmt.table;
  while(while_stmt.test.value){
    let returned = runBlock(while_stmt.table, while_stmt.body, visitor);
    if(returned.isReturned){
      if(returned.isBreak) break;
      if(returned.isContinue) continue;
      return returned;
    }    
  }
  return new returnTypes(false);
}

export function runFunc(
  func: functionDeclaration,
  visitor: Visitor
): returnTypes {  
  visitor.ambit = func.table;
  for (const child of func.body) {
    switch (child.constructor.name) {
      case returnStmt.name:
        let rt = new returnTypes(true);
        rt.value = (child as returnStmt).argument?.value;
        return rt;
      case IfStmt.name:
        let if_stmt = cloneIf(child as IfStmt);
        if_stmt.table.addUpperAmbit(func.table);
        if_stmt.tableAlternate.addUpperAmbit(func.table);
        let returnedIf = runIf(if_stmt, visitor);
        if (returnedIf.isReturned) return returnedIf;
        break;
      case forStmt.name:
        let for_stmt = cloneFor(child as forStmt);
        for_stmt.table.addUpperAmbit(func.table);
        let returnedFor = runFor(for_stmt, visitor);
        if (returnedFor.isReturned) return returnedFor;
        break;
      case whileStmt.name:
        let while_stmt = cloneWhile(child as whileStmt);
        while_stmt.table.addUpperAmbit(func.table);
        let returnedWhile = runWhile(while_stmt, visitor);
        if (returnedWhile.isReturned) return returnedWhile;
        break;
      default:
        visitor.setAmbit(func.table);
        visitor.visit(child);
    }
  }
  return new returnTypes(false);
}

function runBlock(
  table: SymTable,
  body: Node[],
  visitor: Visitor
): returnTypes {
  for (const child of body) {
    switch (child.constructor.name) {
      case returnStmt.name:
        let rt = new returnTypes(true);
        rt.value = (child as returnStmt).argument?.value;
        return rt;
      case breakStmt.name:
        let rt_break = new returnTypes(true);
        rt_break.isBreak = true;
        return rt_break;
      case continueStmt.name:
        let rt_continue = new returnTypes(true);
        rt_continue.isContinue = true;
        return rt_continue;
      case IfStmt.name:
        let if_stmt = cloneIf(child as IfStmt);
        if_stmt.table.addUpperAmbit(table);
        if_stmt.tableAlternate.addUpperAmbit(table);
        let returnedIf = runIf(if_stmt, visitor);
        if (returnedIf.isReturned) return returnedIf;
        break;
      case forStmt.name:
        let for_stmt = cloneFor(child as forStmt);
        for_stmt.table.addUpperAmbit(table);
        let returnedFor = runFor(for_stmt, visitor);
        if (returnedFor.isReturned) return returnedFor;
        break;
      case whileStmt.name:
        let while_stmt = cloneWhile(child as whileStmt);
        while_stmt.table.addUpperAmbit(table);
        let returnedWhile = runWhile(while_stmt, visitor);
        if (returnedWhile.isReturned) return returnedWhile;
        break;
      default:
        visitor.setAmbit(table);
        visitor.visit(child);
    }
  }
  return new returnTypes(false);
}

export function cloneFunction(func: functionDeclaration): functionDeclaration {
  let nf = Object.assign(
    new functionDeclaration({}, '', [], Type.Void, []),
    func
  );
  cloneTable(func, nf);
  return nf;
}

export function cloneFor(old: forStmt) {
  let nf = Object.assign(
    new forStmt({}, [], old.init, old.test, old.update),
    old
  );
  cloneTable(old, nf);
  return nf;
}

export function cloneWhile(old: whileStmt) {
  let nf = Object.assign(new whileStmt({}, [], old.test), old);
  cloneTable(old, nf);
  return nf;
}

export function cloneIf(old: IfStmt) {
  let nf = Object.assign(new IfStmt({}, old.test, [], []), old);
  cloneTableIf(old, nf);
  return nf;
}
function cloneTable(
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

function cloneTableIf(oldB: IfStmt, newB: IfStmt) {
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
