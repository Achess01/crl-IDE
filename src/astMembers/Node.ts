export abstract class Node {
  loc: any;
  constructor(loc: any) {
    this.loc = loc;
  }

  abstract accept(): void;
}

export class Project extends Node{
    extraFiles: Program[];
    main: Program;
    constructor(loc: any, main: Program, extraFiles: Program[]){
        super(loc);
        this.main = main;
        this.extraFiles = extraFiles;
    }

    accept(): void {
        
    }
}

export class Program extends Node {
  body: Node[];
  incerteza:number = 0.5;
  constructor(loc: any, body: Node[]) {
    super(loc);
    this.body = body;
  }

  accept(): void {
      
  }
}

export class ImportDeclaration extends Node {
  fileId: string;
  constructor(loc: any, fileId: string) {
    super(loc);
    this.fileId = fileId;
  }

  accept(): void {}
}

export class Incerteza extends Node{
    value:number
    constructor(loc:any, value:number){
        super(loc);
        this.value = value;
    }

    accept(): void {
        
    }
}

export class Identifier extends Node{
    name: string;
    constructor(loc: any, name:string){
        super(loc);
        this.name = name;
    }

    accept(): void {
        
    }
}

export enum Type{
    String = "String",
    Int = "Int",
    Double = "Double",
    Char = "Char",
    Boolean = "Boolean",
    Void = "Void"        
}

export class VariableDeclarator extends Node {
    id: Identifier;
    init: Expr | null;
    constructor(loc: any, id: Identifier, init: Expr | null){
        super(loc);
        this.id = id;
        this.init = init;        
    }
  accept(): void {}
}

export class VariableDeclaration extends Node {
  declarations: Node[];
  kind: Type;
  constructor(loc: any, declarations: Node[], kind: Type) {
    super(loc);
    this.declarations = declarations;
    this.kind = kind;
  }

  accept(): void {}
}

abstract class Expr extends Node{
    type: Type | null;
    constructor(loc: any, type: Type | null){
        super(loc);
        this.type = type;
    }
    accept(): void {

    }
}

export class BinaryExpression extends Expr{
    left: Expr;
    operator: string;
    right: Expr;    
    constructor(loc: any, type: Type | null, left: Expr, operator: string, right: Expr){
        super(loc, type);
        this.left = left;
        this.operator = operator;
        this.right = right;        
    }
    override accept(): void {
        
    }
} 

export class LogicalExpression extends BinaryExpression{    
    override accept(): void {
        
    }
}

export class UnaryExpression extends Expr{
    operator:string | null;
    argument:string | number | Identifier | boolean | CallFunction;
    constructor(loc: any, type: Type | null, operator: string, argument: string | number | Identifier | boolean | CallFunction){
        super(loc, type);
        this.operator = operator;
        this.argument = argument
    }

    override accept(): void {
        
    }
}


export class Assignment extends Node{
    id: Identifier;
    expression: Expr;

    constructor(loc: any, id: Identifier, expression: Expr){
        super(loc);
        this.id = id;
        this.expression = expression;
    }

    accept(): void {
        
    }
}

export class CallFunction extends Node{
    callee: Identifier;
    args: Expr[];

    constructor(loc: any, callee: Identifier, args: Expr[]){
        super(loc);
        this.callee = callee;
        this.args = args;
    }

    accept(): void {
        
    }
}

export class functionParam extends Node{
    type: Type;
    id: Identifier;
    constructor(loc: any, type: Type, id: Identifier){
        super(loc);
        this.type = type;
        this.id = id;
    }

    accept(): void {
        
    }
}

export class returnStmt extends Node{
    argument: Expr | null;    
    constructor(loc: any, argument: Expr | null){
        super(loc);
        this.argument = argument;
    }
    accept(): void {
        
    }
}

export class continueStmt extends Node{
    accept(): void {
        
    }
}

export class breakStmt extends Node{
    accept(): void {
        
    }
}

/* With symbol table */
export class functionDeclaration extends Node{
    id: string;
    params: functionParam[];
    type: Type;
    body: Node[];
    constructor(loc: any, id:string, params: functionParam[], type: Type, body: Node[]){
        super(loc);
        this.id = id;
        this.params = params;        
        this.type = type;
        this.body = body;        
    }

    accept(): void {
        
    }
    
}

export class functionMain extends Node{
    body: Node[];
    constructor(loc: any, body: Node[]){
        super(loc);
        this.body = body;
    }

    accept(): void {
        
    }
}

export class IfStmt extends Node{
    test: Expr;
    consequent: Node[];
    alternate: Node[];
    constructor(loc: any, test:Expr, consequent: Node[], alternate: Node[]){
        super(loc);
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }

    accept(): void {
        
    }
}

export class forStmt extends Node{
    body: Node[];
    init: VariableDeclarator;
    test: Expr;
    update: string;

    constructor(loc: any, body: Node[], init: VariableDeclarator, test:Expr, update:string){
        super(loc);
        this.body = body;
        this.init = init;
        this.test = test;
        this.update = update;        
    }

    accept(): void {
        
    }
}

export class whileStmt extends Node{
    body: Node[];
    test: Expr;

    constructor(loc:any, body: Node[], test: Expr){
        super(loc);
        this.body = body;
        this.test = test;
    }

    accept(): void {
        
    }
}

/* End with symbol table */

export class Mostrar extends Node{
    strFormat: string;
    expressions: Expr[] | null;
    constructor(loc:any, strFormat: string, expressions: Expr[] | null){
        super(loc);
        this.strFormat = strFormat;
        this.expressions = expressions;
    }

    accept(): void {
        
    }
}

export class DibujarAST extends Node{
    id: Identifier
    constructor(loc: any, id: Identifier){
        super(loc);
        this.id = id;
    }

    accept(): void {
        
    }
}

export class DibujarEXP extends Node{
    expression: Expr;
    constructor(loc:any, expression: Expr){
        super(loc);
        this.expression = expression;
    }

    accept(): void {
        
    }
}

export class DibujarTS extends Node{


    accept(): void {
        
    }
}