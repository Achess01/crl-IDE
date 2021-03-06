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
  Expr,
  UnaryExpression,
  BinaryExpression,
  LogicalExpression,
} from 'src/astMembers/Node';
import { SymTable } from 'src/astMembers/SymbolTable';
import ExecuteVisitor from './ExecuteVisitor';
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

export function runIf(if_stmt: IfStmt, global: SymTable): returnTypes {
  if (if_stmt.table.upperAmbit) {
    let visitor = new ExecuteVisitor('',if_stmt.table.upperAmbit).setGlobal(
      global
    );
    if_stmt.test.accept(visitor, null);
  }

  if (if_stmt.test.value) {
    let returned = runBlock(if_stmt.table, if_stmt.consequent, global);
    if (returned.isReturned) return returned;
  } else {
    let returned = runBlock(if_stmt.tableAlternate, if_stmt.alternate, global);
    if (returned.isReturned) return returned;
  }
  return new returnTypes(false);
}

export function runFor(for_stmt: forStmt, global: SymTable): returnTypes {
  let visitor = new ExecuteVisitor('',for_stmt.table).setGlobal(global);
  for_stmt.init.accept(visitor, null);
  for_stmt.test.accept(visitor, null);
  while (for_stmt.test.value) {
    let returned = runBlock(for_stmt.table, for_stmt.body, global);
    if (returned.isReturned) {
      if (returned.isBreak) break;
      if (!returned.isContinue) return returned;
    }
    let name = for_stmt.init.id.name;
    let iterator = for_stmt.table.getVariable(name);
    if (iterator) {
      switch (for_stmt.update) {
        case '++':
          iterator.value = iterator.value + 1;
          break;
        case '--':
          iterator.value = iterator.value - 1;
          break;
      }
    }
    for_stmt.test.accept(visitor, null);
  }
  return new returnTypes(false);
}

export function runWhile(while_stmt: whileStmt, global: SymTable): returnTypes {
  let visitor = new ExecuteVisitor('',while_stmt.table).setGlobal(global);
  while_stmt.test.accept(visitor, null);
  while (while_stmt.test.value) {
    let returned = runBlock(while_stmt.table, while_stmt.body, global);
    while_stmt.test.accept(visitor, null);
    if (returned.isReturned) {
      if (returned.isBreak) break;
      if (!returned.isContinue) return returned;
    }
  }
  return new returnTypes(false);
}

/* export function runFunc(
  func: functionDeclaration,
  global: SymTable
): returnTypes {
  let visitor = new ExecuteVisitor('',func.table).setGlobal(global);
  for (const child of func.body) {
    switch (child.constructor.name) {
      case returnStmt.name:
        let rt = new returnTypes(true);
        (child as returnStmt).argument?.accept(visitor, null);
        rt.value = (child as returnStmt).argument?.value;
        return rt;
      case IfStmt.name:
        let if_stmt = cloneIf(child as IfStmt);
        if_stmt.table.addUpperAmbit(func.table);
        if_stmt.tableAlternate.addUpperAmbit(func.table);
        let returnedIf = runIf(if_stmt, global);
        if (returnedIf.isReturned) return returnedIf;
        break;
      case forStmt.name:
        let for_stmt = cloneFor(child as forStmt);
        for_stmt.table.addUpperAmbit(func.table);
        let returnedFor = runFor(for_stmt, global);
        if (returnedFor.isReturned) return returnedFor;
        break;
      case whileStmt.name:
        let while_stmt = cloneWhile(child as whileStmt);
        while_stmt.table.addUpperAmbit(func.table);
        let returnedWhile = runWhile(while_stmt, global);
        if (returnedWhile.isReturned) return returnedWhile;
        break;
      default:
        child.accept(visitor, null);
    }
  }
  return new returnTypes(false);
}
 */
export function runBlock(
  table: SymTable,
  body: Node[],
  global: SymTable
): returnTypes {
  let visitor = new ExecuteVisitor('',table).setGlobal(global);
  for (const child of body) {
    switch (child.constructor.name) {
      case returnStmt.name:
        let rt = new returnTypes(true);
        let rt_cloned = cloneReturn(child as returnStmt);
        rt_cloned.argument?.accept(visitor, null);
        rt.value = rt_cloned.argument?.value;
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
        let returnedIf = runIf(if_stmt, global);
        if (returnedIf.isReturned) return returnedIf;
        break;
      case forStmt.name:
        let for_stmt = cloneFor(child as forStmt);
        for_stmt.table.addUpperAmbit(table);
        let returnedFor = runFor(for_stmt, global);
        if (returnedFor.isReturned) return returnedFor;
        break;
      case whileStmt.name:
        let while_stmt = cloneWhile(child as whileStmt);
        while_stmt.table.addUpperAmbit(table);
        let returnedWhile = runWhile(while_stmt, global);
        if (returnedWhile.isReturned) return returnedWhile;
        break;
      default:
        let clonedChild = cloneChild(child);
        if(clonedChild.constructor.name === DibujarEXP.name){
          visitor.visit(clonedChild);
        }else{
          clonedChild.accept(visitor, null);
        }        
        break;
    }
  }
  return new returnTypes(false);
}

function cloneChild(node: Node): Node {
  switch (node.constructor.name) {
    case VariableDeclarator.name:
      return cloneVarDec(node as VariableDeclarator);
    case Assignment.name:
      return cloneAssign(node as Assignment);
    case CallFunction.name:
      return cloneCallFunc(node as CallFunction);
    case DibujarEXP.name:
      return cloneDibujarEXP(node as DibujarEXP);
    case Mostrar.name:
      return cloneMostrar(node as Mostrar);
  }

  return node;
}

function cloneVarDec(node: VariableDeclarator): VariableDeclarator {
  let varDec = Object.assign(new VariableDeclarator({}, node.id, null), node);
  if (node.init) varDec.init = cloneExpr(node.init);
  return varDec;
}

function cloneAssign(node: Assignment): Assignment {
  let assign = Object.assign(
    new Assignment({}, node.id, new UnaryExpression({}, null, null, false))
  );
  assign.expression = cloneExpr(node.expression);
  return assign;
}

function cloneCallFunc(node: CallFunction): CallFunction {
  let call = Object.assign(new CallFunction({}, '', []), node);
  let expresisons: Expr[] = [];
  for (const index in node.args) {
    expresisons.push(cloneExpr(node.args[index]));
  }
  call.args = expresisons;
  return call;
}

function cloneDibujarEXP(node: DibujarEXP): DibujarEXP {
  let dibujar = Object.assign(
    new DibujarEXP({}, new UnaryExpression({}, null, null, false)),
    node
  );
  dibujar.expression = cloneExpr(node.expression);
  return dibujar;
}

function cloneMostrar(node: Mostrar): Mostrar {
  let mostrar = Object.assign(new Mostrar({}, '', []), node);
  if (node.expressions) {
    let expresisons: Expr[] = [];
    for (const index in node.expressions) {
      expresisons.push(cloneExpr(node.expressions[index]));
    }
    mostrar.expressions = expresisons;
  }
  return mostrar;
}

function cloneReturn(node: returnStmt): returnStmt {
  let rt = Object.assign(new returnStmt({}, null), node);
  if (node.argument) rt.argument = cloneExpr(node.argument);
  return rt;
}

function cloneExpr(node: Expr): Expr {
  switch (node.constructor.name) {
    case BinaryExpression.name:
    case LogicalExpression.name:
      return cloneBinary(node as BinaryExpression);

    case UnaryExpression.name:
      return cloneUnary(node as UnaryExpression);
  }
  return node;
}

function cloneBinary(node: BinaryExpression): BinaryExpression {
  let binary = Object.assign(
    new BinaryExpression(
      {},
      null,
      new UnaryExpression({}, null, null, false),
      '',
      new UnaryExpression({}, null, null, false)
    ),
    node
  );
  binary.left = cloneExpr(node.left);
  binary.right = cloneExpr(node.right);
  return binary;
}

function cloneUnary(node: UnaryExpression): UnaryExpression {
  let unary = Object.assign(new UnaryExpression({}, null, null, ''), node);
  if (node.argument.constructor.name === CallFunction.name)
    unary.argument = cloneCallFunc(node.argument as CallFunction);
  return unary;
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
  newB.table = Object.assign(new SymTable('base'), oldB.table);
  let vars = oldB.table.symbolVars;
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
  newB.table = Object.assign(new SymTable('base'), oldB.table);
  let vars = oldB.table.symbolVars;
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
  newB.tableAlternate = Object.assign(
    new SymTable('base'),
    oldB.tableAlternate
  );
  let varsAlt = oldB.tableAlternate.symbolVars;
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
  newB.tableAlternate.symbolVars = newVarsAlt;
}
