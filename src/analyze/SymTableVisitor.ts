import {
  functionDeclaration,
  VariableDeclarator,
  Assignment,
  functionMain,
  whileStmt,
  forStmt,
  IfStmt,
} from 'src/astMembers/Node';
import Visitor from './Visitor';
import { CheckUndefinedGlobalVisitor } from './SymTableVisitorGlobal';
import logError from 'src/errors/LogError';

class SymTableVisitor extends Visitor {
  visitBlock(node: functionDeclaration | functionMain | whileStmt | forStmt) {
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

      let checkUndefined = new CheckUndefinedGlobalVisitor(node.table);
      if (child.constructor.name === VariableDeclarator.name) {
        let variable = child as VariableDeclarator;
        if (!node.table.addVariable(variable)) {
          logError(
            variable.id.loc,
            `El identificador '${variable.id.name}' ya está definido`
          );
        } else {
          variable.init?.accept(checkUndefined);
        }
      } else if (child.constructor.name === Assignment.name) {
        (child as Assignment).accept(checkUndefined);
      }
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
          variable.init?.accept(checkUndefined);
        }
      } else if (child.constructor.name === Assignment.name) {
        (child as Assignment).accept(checkUndefined);
      }
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
            variable.init?.accept(checkUndefined);
          }
        } else if (child.constructor.name === Assignment.name) {
          (child as Assignment).accept(checkUndefined);
        }
      }
  }
}

export default SymTableVisitor;
