import { SymTable } from 'src/astMembers/SymbolTable';
import {
  BinaryExpression,
  Type,
  Expr,
  LogicalExpression,
  UnaryExpression,
  CallFunction,
  VariableDeclarator,
  Assignment,
  returnStmt,
  forStmt,
  whileStmt,
  breakStmt,
  continueStmt,
} from '../astMembers/Node';
import Visitor from './Visitor';

const combinations = [
  `${Type.Boolean}-${Type.Boolean}`,
  `${Type.Boolean}-${Type.Double}`,
  `${Type.Boolean}-${Type.String}`,
  `${Type.Boolean}-${Type.Int}`,
  `${Type.Boolean}-${Type.Char}`,
  `${Type.Double}-${Type.Double}`,
  `${Type.Double}-${Type.String}`,
  `${Type.Double}-${Type.Int}`,
  `${Type.Double}-${Type.Char}`,
  `${Type.String}-${Type.String}`,
  `${Type.String}-${Type.Int}`,
  `${Type.String}-${Type.Char}`,
  `${Type.Int}-${Type.Int}`,
  `${Type.Int}-${Type.Char}`,
  `${Type.Char}-${Type.Char}`,
];

const additionCast = [
  Type.Double,
  Type.Double,
  Type.String,
  Type.Int,
  undefined,
  Type.Double,
  Type.String,
  Type.Double,
  Type.Double,
  Type.String,
  Type.String,
  Type.String,
  Type.Int,
  Type.Int,
  Type.Int,
];

const subtractionCast = [
  undefined,
  Type.Double,
  undefined,
  Type.Int,
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  Type.Double,
  undefined,
  undefined,
  undefined,
  Type.Int,
  Type.Int,
  Type.Int,
];

const divisionCast = [
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  Type.Double,
  undefined,
  undefined,
  undefined,
  Type.Double,
  Type.Double,
  Type.Double,
];

const modCast = [
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  Type.Double,
  undefined,
  undefined,
  undefined,
  Type.Double,
  Type.Double,
  Type.Double,
];

const multiplicationCast = [
  undefined,
  Type.Double,
  undefined,
  Type.Int,
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  Type.Double,
  undefined,
  undefined,
  undefined,
  Type.Int,
  Type.Int,
  Type.Int,
];

const exponentCast = [
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  undefined,
  Type.Double,
  Type.Double,
  undefined,
  undefined,
  undefined,
  Type.Int,
  Type.Int,
  Type.Double,
];

const stringErrorAssign: Type[] = [];
const doubleErrorAssign = [Type.String];
const booleanErrorAssign = [Type.String, Type.Double, Type.Int, Type.Char];
const intErrorAssign = [Type.String];
const charErrorAssign = [Type.String, Type.Double, Type.Boolean];

class ExpressionsVisitor extends Visitor {
  override visitCallFunction(node: CallFunction): void {
    if (this.ambit) {
      let func = this.ambit.getFunction(node.getTableName(), this.global);
      if (!func) {
        this.logError(node.loc, `La función ${node.getTableName()} no existe`);
      }
    }
  }

  override visitBinaryExpression(node: BinaryExpression): void {
    let newType = this.getBinaryType(node.left, node.operator, node.right);
    if (newType === null) {
      this.logError(
        node.loc,
        `La operación ${node.left.type} ${node.operator} ${node.right.type} no es posible`
      );
    } else {
      node.type = newType;
    }
  }

  override visitLogicalExpression(node: LogicalExpression): void {
    if (node.left.type !== Type.Boolean || node.right.type !== Type.Boolean) {
      this.logError(
        node.loc,
        `La operación ${node.left.type} ${node.operator} ${node.right.type} no es posible`
      );
    }
  }

  override visitreturnStmt(node: returnStmt): void {
    if (this.ambit.returnedType !== Type.Void) {
      if(!node.argument){
        this.logError(node.loc, `Debe retornar un valor`);
      }
      else if(this.ambit.returnedType !== node.argument.type) {
        this.logError(
          node.loc,
          `Tipo de retorno incorrecto. Se esperaba ${this.ambit.returnedType}. Se obtuvo ${node.argument.type}`
        );
      } 
    } 
  }

  override visitbreakStmt(node: breakStmt): void {
      let inCicle = false;
      let upper: SymTable | null = this.ambit;
      while(upper !== null){
        if(upper.name === 'Mientras' || upper.name === 'Para'){
          inCicle = true;
          break;
        }
        upper = upper.upperAmbit;        
      }
      if(!inCicle){
        this.logError(node.loc, `La instrucción 'Detener' debe de ir dentro de un ciclo`);
      }      
  }

  override visitcontinueStmt(node: continueStmt): void {
    let inCicle = false;
    let upper: SymTable | null = this.ambit;
    while(upper !== null){
      if(upper.name === 'Mientras' || upper.name === 'Para'){
        inCicle = true;
        break;
      }
      upper = upper.upperAmbit;        
    }
    if(!inCicle){
      this.logError(node.loc, `La instrucción 'Continuar' debe de ir dentro de un ciclo`);
    }    
  }

  override visitUnaryExpression(node: UnaryExpression): void {
    if (node.argument.constructor.name === CallFunction.name) {
      let cf = node.argument as CallFunction;
      if (this.ambit !== undefined) {
        let func = this.ambit.getFunction(cf.getTableName(), this.global);
        if (func !== undefined) {
          node.type = func.type;
        }
      }
    }
    switch (node.operator) {
      case '!':
        if (node.type !== Type.Boolean)
          this.logError(
            node.loc,
            `La operación ${node.operator} ${node.type} es inválida`
          );
        break;
      case '-':
        let tp = this.getBinaryType(
          new UnaryExpression(null, Type.Int, '', 0),
          '-',
          node
        );
        if (tp !== null) {
          node.type = tp;
        } else {
          this.logError(
            node.loc,
            `La operación ${node.operator} ${node.type} es inválida`
          );
        }
        break;
    }
  }

  override visitAssignment(node: Assignment): void {
    let variable = this.ambit?.getVariable(node.id.name, this.global);
    if (variable !== undefined) {
      let errorType: (Type | null)[] = [];
      switch (variable.type) {
        case Type.String:
          errorType = stringErrorAssign;
          break;
        case Type.Int:
          errorType = intErrorAssign;
          break;
        case Type.Double:
          errorType = doubleErrorAssign;
          break;
        case Type.Boolean:
          errorType = booleanErrorAssign;
          break;
        case Type.Char:
          errorType = charErrorAssign;
          break;
      }
      if (
        errorType.length > 0 &&
        node.expression.type !== null &&
        errorType.includes(node.expression.type)
      ) {
        this.logError(
          node.loc,
          `La asignación ${variable.type} = ${node.expression.type} no está permitida`
        );
      }
    }
  }

  override visitVariableDeclarator(node: VariableDeclarator): void {
    if (node.init !== null) {
      let errorType: (Type | null)[] = [];
      switch (node.type) {
        case Type.String:
          errorType = stringErrorAssign;
          break;
        case Type.Int:
          errorType = intErrorAssign;
          break;
        case Type.Double:
          errorType = doubleErrorAssign;
          break;
        case Type.Boolean:
          errorType = booleanErrorAssign;
          break;
        case Type.Char:
          errorType = charErrorAssign;
          break;
      }
      if (
        errorType.length > 0 &&
        node.init !== null &&
        node.init.type !== null &&
        errorType.includes(node.init.type)
      ) {
        this.logError(
          node.loc,
          `La asignación ${node.type} = ${node.init.type} no está permitida`
        );
      }
    }
  }

  getBinaryType(left: Expr, op: string, right: Expr): Type | null {
    let castingList: (Type | undefined)[] = [];
    switch (op) {
      case '+':
        castingList = additionCast;
        break;
      case '-':
        castingList = subtractionCast;
        break;
      case '*':
        castingList = multiplicationCast;
        break;
      case '/':
        castingList = divisionCast;
        break;
      case '%':
        castingList = modCast;
        break;
      case '^':
        castingList = exponentCast;
        break;
    }

    if (castingList.length > 0) {
      let index = combinations.findIndex((combination) => {
        return (
          `${left.type}-${right.type}` === combination ||
          `${right.type}-${left.type}` === combination
        );
      });
      if (index !== -1) {
        let type = castingList[index];
        if (type !== undefined) {
          return type;
        }
      }
    } else {
      if (
        left.type === right.type ||
        (left.type === Type.Int && right.type === Type.Double) ||
        (left.type === Type.Double && right.type === Type.Int)
      ) {
        return Type.Boolean;
      }
    }
    return null;
  }
}

export default ExpressionsVisitor;
