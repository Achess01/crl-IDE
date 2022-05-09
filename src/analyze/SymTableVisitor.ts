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
  DibujarEXP
} from 'src/astMembers/Node';
import Visitor from './Visitor';
import { CheckUndefinedGlobalVisitor } from './SymTableVisitorGlobal';
import logError from 'src/errors/LogError';

class SymTableVisitor extends Visitor {
  visitBlock(node: functionDeclaration | functionMain | whileStmt | forStmt) {
    let checkUndefined = new CheckUndefinedGlobalVisitor(node.table);
    if (node.constructor.name === forStmt.name) {      
      (node as forStmt).test.accept(checkUndefined, null);
    }

    for (let child of node.body) {
      switch (child.constructor.name) {
        case IfStmt.name:
          (child as IfStmt).table.addUpperAmbit(node.table);
          (child as IfStmt).tableAlternate.addUpperAmbit(node.table);
          break;
        case forStmt.name:
          (child as forStmt).table.addUpperAmbit(node.table);
          break;
        case whileStmt.name:
          (child as whileStmt).table.addUpperAmbit(node.table);
          break;
      }
      
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
      }

      this.testChildNode(child, checkUndefined);
    }
  }

  override visitfunctionDeclaration(node: functionDeclaration): void {
    node.params.forEach((param) => {
      let variable = new VariableDeclarator(param.loc, param.id, null);
      variable.setParam();
      variable.type = param.type;
      node.table.addVariable(variable);
    });
    this.visitBlock(node);
  }

  override visitfunctionMain(node: functionMain): void {
    this.visitBlock(node);
  }

  override visitwhileStmt(node: whileStmt): void {
    this.visitBlock(node);
  }

  override visitforStmt(node: forStmt): void {
    node.table.addVariable(node.init);
    this.visitBlock(node);
  }

  override visitIfStmt(node: IfStmt): void {
    for (let child of node.consequent) {
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
      }

      this.testChildNode(child, checkUndefined);
    }

    for (let child of node.alternate) {
      let checkUndefined = new CheckUndefinedGlobalVisitor(node.tableAlternate);
      if (child.constructor.name === VariableDeclarator.name) {
        let variable = child as VariableDeclarator;
        if (!node.tableAlternate.addVariable(variable)) {
          logError(
            variable.id.loc,
            `El identificador '${variable.id.name}' ya está definido`
          );
        } else {
          variable.init?.accept(checkUndefined, null);
        }
      }

      this.testChildNode(child, checkUndefined);
    }
  }

  testChildNode(child: Node, checkUndefined: CheckUndefinedGlobalVisitor){
    switch(child.constructor.name){
      case Assignment.name:
        (child as Assignment).accept(checkUndefined, null);
        break;
      case forStmt.name:          
        (child as forStmt).init.init?.accept(checkUndefined, null);          
        break;
      case whileStmt.name:
        (child as whileStmt).test.accept(checkUndefined, null);
        break;
      case IfStmt.name:
        (child as IfStmt).test.accept(checkUndefined, null);
        break;
      case returnStmt.name:
        (child as returnStmt).argument?.accept(checkUndefined, null);
        break;
      case Mostrar.name:
        (child as Mostrar).expressions?.forEach(e => e.accept(checkUndefined, null));
        break;    
      case DibujarEXP.name:
        (child as DibujarEXP).expression.accept(checkUndefined, null);
        break;    
      case DibujarAST.name:
        checkUndefined.visit(child as DibujarAST);
        break;
    }
  }
}

export default SymTableVisitor;
