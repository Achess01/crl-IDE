import {
  Node,
  Program,
  ImportDeclaration,
  Incerteza,
  Identifier,
  Type,
  VariableDeclarator,
  VariableDeclaration,
  BinaryExpression,
  LogicalExpression,
  UnaryExpression,
  Assignment,
  CallFunction,
  functionParam,
  returnStmt,
  continueStmt,
  breakStmt,
  functionDeclaration,
  functionMain,
  IfStmt,
  forStmt,
  whileStmt,
  Mostrar,
  DibujarAST,
  DibujarEXP,
  DibujarTS,
} from '../astMembers/Node';

abstract class Visitor {
  visit(node: Node): void {
    switch (node.constructor.name) {
      case Program.name:
        this.visitProgram(node as Program);
        break;
      case ImportDeclaration.name:
        this.visitImportDeclaration(node as ImportDeclaration);
        break;
      case Incerteza.name:
        this.visitIncerteza(node as Incerteza);
        break;
      case Identifier.name:
        this.visitIdentifier(node as Identifier);
        break;
      case VariableDeclarator.name:
        this.visitVariableDeclarator(node as VariableDeclarator);
        break;
      case VariableDeclaration.name:
        this.visitVariableDeclaration(node as VariableDeclaration);
        break;
      case BinaryExpression.name:
        this.visitBinaryExpression(node as BinaryExpression);
        break;
      case LogicalExpression.name:
        this.visitLogicalExpression(node as LogicalExpression);
        break;
      case UnaryExpression.name:
        this.visitUnaryExpression(node as UnaryExpression);
        break;
      case Assignment.name:
        this.visitAssignment(node as Assignment);
        break;
      case CallFunction.name:
        this.visitCallFunction(node as CallFunction);
        break;
      case functionParam.name:
        this.visitfunctionParam(node as functionParam);
        break;
      case returnStmt.name:
        this.visitreturnStmt(node as returnStmt);
        break;
      case continueStmt.name:
        this.visitcontinueStmt(node as continueStmt);
        break;
      case breakStmt.name:
        this.visitbreakStmt(node as breakStmt);
        break;
      case functionDeclaration.name:
        this.visitfunctionDeclaration(node as functionDeclaration);
        break;
      case functionMain.name:
        this.visitfunctionMain(node as functionMain);
        break;
      case IfStmt.name:
        this.visitIfStmt(node as IfStmt);
        break;
      case forStmt.name:
        this.visitforStmt(node as forStmt);
        break;
      case whileStmt.name:
        this.visitwhileStmt(node as whileStmt);
        break;
      case Mostrar.name:
        this.visitMostrar(node as Mostrar);
        break;
      case DibujarAST.name:
        this.visitDibujarAST(node as DibujarAST);
        break;
      case DibujarEXP.name:
        this.visitDibujarEXP(node as DibujarEXP);
        break;
      case DibujarTS.name:
        this.visitDibujarTS(node as DibujarTS);
        break;
    }
  }
  visitbreakStmt(node: breakStmt) {}
  visitfunctionDeclaration(node: functionDeclaration) {}
  visitfunctionMain(node: functionMain) {}
  visitIfStmt(node: IfStmt) {}
  visitforStmt(node: forStmt) {}
  visitwhileStmt(node: whileStmt) {}
  visitMostrar(node: Mostrar) {}
  visitDibujarAST(node: DibujarAST) {}
  visitDibujarEXP(node: DibujarEXP) {}
  visitDibujarTS(node: DibujarTS) {}
  visitBinaryExpression(node: BinaryExpression) {}
  visitLogicalExpression(node: LogicalExpression) {}
  visitUnaryExpression(node: UnaryExpression) {}
  visitAssignment(node: Assignment) {}
  visitCallFunction(node: CallFunction) {}
  visitfunctionParam(node: functionParam) {}
  visitreturnStmt(node: returnStmt) {}
  visitcontinueStmt(node: continueStmt) {}
  visitIdentifier(node: Identifier) {}
  visitVariableDeclarator(node: VariableDeclarator) {}
  visitVariableDeclaration(node: VariableDeclaration) {}
  visitProgram(node: Program) {}
  visitImportDeclaration(node: ImportDeclaration) {}
  visitIncerteza(node: Incerteza) {}
}

export default Visitor;
