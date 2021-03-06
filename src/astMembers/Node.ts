import { SymTable } from './SymbolTable';
import Visitor from '../analyze/Visitor';
import SymTableVisitor from 'src/analyze/SymTableVisitor';

export abstract class Node {
  loc: any;
  nr: any;
  constructor(loc: any) {
    this.loc = loc;
  }

  abstract accept(visitor: Visitor, ambit: SymTable | null): void;
}

/* export class Project extends Node {
  files: Program[];  
  main?: Program;
  constructor(loc: any, files: Program[]) {
    super(loc);    
    this.files = files;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
  }
} */

export class Program extends Node {
  body: Node[];
  incerteza: number = 0.5;
  table: SymTable;
  main: functionMain | null;
  correct: boolean = true;
  filename: string = '';
  constructor(loc: any, body: Node[]) {
    super(loc);
    this.body = body;
    this.table = new SymTable('global');
    this.main = null;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    visitor.setAmbit(this.table);
    for (let child of this.body) {
      child.accept(visitor, this.table);
    }
    visitor.visit(this);
  }
}

export class ImportDeclaration extends Node {
  fileId: string;
  constructor(loc: any, fileId: string) {
    super(loc);
    this.fileId = fileId;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    visitor.visit(this);
  }
}

export class Incerteza extends Node {
  value: number;
  constructor(loc: any, value: number) {
    super(loc);
    this.value = value;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    visitor.visit(this);
  }
}

export class Identifier extends Node {
  name: string;
  constructor(loc: any, name: string) {
    super(loc);
    this.name = name;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    visitor.visit(this);
  }
}

export enum Type {
  String = 'String',
  Int = 'Int',
  Double = 'Double',
  Char = 'Char',
  Boolean = 'Boolean',
  Void = 'Void',
}

export class VariableDeclarator extends Node {
  id: Identifier;
  init: Expr | null;
  type: Type | null;
  value: any;
  isParam: boolean = false;
  file: string = '';
  constructor(loc: any, id: Identifier, init: Expr | null) {
    super(loc);
    this.id = id;
    this.init = init;
    this.type = null;
    this.value = null;
  }

  setParam() {
    this.isParam = true;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    if (this.init !== null) this.init.accept(visitor, ambit);
    this.id.accept(visitor, ambit);
    visitor.visit(this);
  }
}

/* export class VariableDeclaration extends Node {
  declarations: Node[];
  kind: Type;
  constructor(loc: any, declarations: Node[], kind: Type) {
    super(loc);
    this.declarations = declarations;
    this.kind = kind;
  }

  accept(visitor: Visitor, ambit:SymTable | null): void {}
} */

export abstract class Expr extends Node {
  type: Type | null;
  value: any;
  constructor(loc: any, type: Type | null) {
    super(loc);
    this.type = type;
    this.value = null;
  }
  accept(visitor: Visitor, ambit: SymTable | null): void {}
}

export class BinaryExpression extends Expr {
  left: Expr;
  operator: string;
  right: Expr;
  constructor(
    loc: any,
    type: Type | null,
    left: Expr,
    operator: string,
    right: Expr
  ) {
    super(loc, type);
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  override accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    this.left.accept(visitor, ambit);
    this.right.accept(visitor, ambit);
    visitor.visit(this);
  }
}

export class LogicalExpression extends BinaryExpression {}

export class UnaryExpression extends Expr {
  operator: string | null;
  argument: string | number | Identifier | boolean | CallFunction;
  constructor(
    loc: any,
    type: Type | null,
    operator: string | null,
    argument: string | number | Identifier | boolean | CallFunction
  ) {
    super(loc, type);
    this.operator = operator;
    this.argument = argument;
  }

  override accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    if (this.argument.constructor.name === Identifier.name) {
      (this.argument as Identifier).accept(visitor, ambit);
    } else if (this.argument.constructor.name === CallFunction.name) {
      (this.argument as CallFunction).accept(visitor, ambit);
    }
    visitor.visit(this);
  }
}

export class Assignment extends Node {
  id: Identifier;
  expression: Expr;

  constructor(loc: any, id: Identifier, expression: Expr) {
    super(loc);
    this.id = id;
    this.expression = expression;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    this.id.accept(visitor, ambit);
    this.expression.accept(visitor, ambit);
    visitor.visit(this);
  }
}

export class CallFunction extends Node {
  callee: string;
  args: Expr[];
  returnedValue: any;

  constructor(loc: any, callee: string, args: Expr[]) {
    super(loc);
    this.callee = callee;
    this.args = args;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    for (let exprs of this.args) {
      exprs.accept(visitor, ambit);
    }
    visitor.visit(this);
  }

  getTableName(): string {
    let funcTypes = this.args.reduce((previus, current) => {
      let currVal = current.type === null ? 'null' : current.type.toString();
      if (previus.length === 0) {
        return currVal;
      } else {
        return `${previus},${currVal}`;
      }
    }, '');
    return `${this.callee}(${funcTypes})`;
  }
}

export class functionParam extends Node {
  type: Type;
  id: Identifier;
  constructor(loc: any, type: Type, id: Identifier) {
    super(loc);
    this.type = type;
    this.id = id;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    this.id.accept(visitor, ambit);
    visitor.visit(this);
  }
}

export class returnStmt extends Node {
  argument: Expr | null;
  constructor(loc: any, argument: Expr | null) {
    super(loc);
    this.argument = argument;
  }
  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    if (this.argument !== null) this.argument.accept(visitor, ambit);
    visitor.visit(this);
  }
}

export class continueStmt extends Node {
  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    visitor.visit(this);
  }
}

export class breakStmt extends Node {
  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    visitor.visit(this);
  }
}

/* With symbol table */
export class functionDeclaration extends Node {
  id: string;
  params: functionParam[];
  type: Type;
  body: Node[];
  table: SymTable;
  nameForTable: string;
  file: string = '';
  constructor(
    loc: any,
    id: string,
    params: functionParam[],
    type: Type,
    body: Node[]
  ) {
    super(loc);
    this.id = id;
    this.params = params;
    this.type = type;
    this.body = body;
    this.nameForTable = this.getNameForTable();
    this.table = new SymTable(`funcion ${id}`);
    this.table.returnedType = this.type;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    visitor.setAmbit(this.table);
    if (visitor.constructor.name === SymTableVisitor.name) {
      visitor.visit(this);
    } else {
      for (let child of this.body) {
        child.accept(visitor, this.table);
      }
      for (let child of this.params) {
        child.accept(visitor, this.table);
      }
      visitor.visit(this);
    }
  }

  private getNameForTable(): string {
    let funcTypes = this.params.reduce((previus, current) => {
      if (previus.length === 0) {
        return current.type.toString();
      } else {
        return `${previus},${current.type.toString()}`;
      }
    }, '');
    return `${this.id}(${funcTypes})`;
  }
}

export class functionMain extends Node {
  body: Node[];
  table: SymTable;
  constructor(loc: any, body: Node[]) {
    super(loc);
    this.body = body;
    this.table = new SymTable('Principal()');
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    visitor.setAmbit(this.table);
    if (visitor.constructor.name === SymTableVisitor.name) {
      visitor.visit(this);
    } else {
      for (let child of this.body) {
        child.accept(visitor, this.table);
      }
      visitor.visit(this);
    }
  }
}

export class IfStmt extends Node {
  test: Expr;
  consequent: Node[];
  alternate: Node[];
  table: SymTable;
  tableAlternate: SymTable;
  constructor(loc: any, test: Expr, consequent: Node[], alternate: Node[]) {
    super(loc);
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
    this.table = new SymTable('Si');
    this.tableAlternate = new SymTable('Sino');
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    if (visitor.constructor.name === SymTableVisitor.name) {
      visitor.visit(this);
    } else {
      for (let child of this.consequent) {
        child.accept(visitor, this.table);
      }
      for (let child of this.alternate) {
        child.accept(visitor, this.tableAlternate);
      }
      this.test.accept(visitor, ambit);
      visitor.visit(this);
    }
  }
}

export class forStmt extends Node {
  body: Node[];
  init: VariableDeclarator;
  test: Expr;
  update: string;
  table: SymTable;

  constructor(
    loc: any,
    body: Node[],
    init: VariableDeclarator,
    test: Expr,
    update: string
  ) {
    super(loc);
    this.body = body;
    this.init = init;
    this.init.type = Type.Int;
    this.test = test;
    this.update = update;
    this.table = new SymTable('Para');
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    if (visitor.constructor.name === SymTableVisitor.name) {
      visitor.visit(this);
    } else {
      for (let child of this.body) {
        child.accept(visitor, this.table);
      }
      this.init.accept(visitor, ambit);
      this.test.accept(visitor, this.table);
      visitor.visit(this);
    }
  }
}

export class whileStmt extends Node {
  body: Node[];
  test: Expr;
  table: SymTable;
  constructor(loc: any, body: Node[], test: Expr) {
    super(loc);
    this.body = body;
    this.test = test;
    this.table = new SymTable('Mientras');
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    if (visitor.constructor.name === SymTableVisitor.name) {
      visitor.visit(this);
    } else {
      for (let child of this.body) {
        child.accept(visitor, ambit);
      }
      this.test.accept(visitor, ambit);
      visitor.visit(this);
    }
  }
}

/* End with symbol table */

export class Mostrar extends Node {
  strFormat: string;
  expressions: Expr[] | null;
  constructor(loc: any, strFormat: string, expressions: Expr[] | null) {
    super(loc);
    this.strFormat = strFormat;
    this.expressions = expressions;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    if (this.expressions !== null) {
      for (let child of this.expressions) {
        child.accept(visitor, ambit);
      }
    }
    visitor.visit(this);
  }
}

export class DibujarAST extends Node {
  id: Identifier;
  constructor(loc: any, id: Identifier) {
    super(loc);
    this.id = id;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    this.id.accept(visitor, ambit);
    visitor.visit(this);
  }
}

export class DibujarEXP extends Node {
  expression: Expr;
  constructor(loc: any, expression: Expr) {
    super(loc);
    this.expression = expression;
  }

  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    this.expression.accept(visitor, ambit);
    visitor.visit(this);
  }
}

export class DibujarTS extends Node {
  accept(visitor: Visitor, ambit: SymTable | null): void {
    if (ambit !== null) visitor.setAmbit(ambit);
    visitor.visit(this);
  }
}
