import {
  Program,
  ImportDeclaration,
  Incerteza,
  Identifier,
  VariableDeclarator,
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
import Visitor from './Visitor';
import logError from '../errors/LogError';

class SymTableGlobalVisitor extends Visitor {
  override visitProgram(node: Program): void {
    /* First add all globla methods to Symbol Table */
    for (let child of node.body) {
      if (child.constructor.name === functionDeclaration.name) {
        let func = child as functionDeclaration;
        if (!node.table.addFunc(func)) {
          logError(
            func.loc,
            `La función ${
              func.nameForTable
            }:${func.type.toString()} ya está definida`
          );
        }
      } else if (child.constructor.name === functionMain.name) {
        let func = child as functionMain;
        if (node.main !== null) {
          logError(
            func.loc,
            'Este archivo ya tiene una función Principal():Void'
          );
        } else {
          node.main = func;
        }
      } else if (child.constructor.name === Incerteza.name) {
        let value = (child as Incerteza).value;
        node.incerteza = value;
      }

      /* switch (child.constructor.name) {
        case functionDeclaration.name:
          (child as functionDeclaration).table.addUpperAmbit(node.table);
          break;
        case functionMain.name:
          (child as functionMain).table.addUpperAmbit(node.table);
          break;        
      } */
    }
    /* Then adding variables and comprobing the use of undefined variables */
    for (let child of node.body) {
      let checkUndefined = new CheckUndefinedGlobalVisitor(node.table);
      if (child.constructor.name === VariableDeclarator.name) {
        let variable = child as VariableDeclarator;
        if (!node.table.addVariable(variable)) {
          logError(
            variable.id.loc,
            `El identificador '${variable.id.name}' ya está definido`
          );
        } else {
          variable.init?.accept(checkUndefined, null);
        }
      } else if (child.constructor.name === Assignment.name) {
        checkUndefined.visit(child as Assignment);
        //(child as Assignment).accept(checkUndefined, null);        
      }
    }
  }
}

export class CheckUndefinedGlobalVisitor extends Visitor {
    
  override visitIdentifier(node: Identifier): void {
    let variable = this.ambit?.getVariable(node.name, this.global);     
    if (variable === undefined) {
      logError(node.loc, `La variable '${node.name}' no existe`);
    } else if (variable.init === null && !variable.isParam) {
      logError(node.loc, `La variable '${node.name}' no está inicializada`);
    }    
  }

  override visitAssignment(node: Assignment): void {
    let variable = this.ambit?.getVariable(node.id.name, this.global);
    if (variable === undefined) {
      logError(node.loc, `La variable '${node.id.name}' no existe`);
    }else{
      if(variable.init === null) variable.init = node.expression;
    }
    node.expression.accept(this, null);
  }

  override visitDibujarAST(node: DibujarAST): void {
      let name = node.id.name;
      if(!this.ambit?.itExistsThisFunctionId(name)){
        logError(node.loc, `No existe ninguna función '${name}'`);
      }
  }

  override visitUnaryExpression(node: UnaryExpression): void {
      if(node.argument.constructor.name === Identifier.name){
        let name = (node.argument as Identifier).name;
        let variable = this.ambit?.getVariable(name, this.global);
        if(variable !== undefined){
          node.type = variable.type;
        }
      }
  }
}

export default SymTableGlobalVisitor;
