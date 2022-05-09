import logError from 'src/errors/LogError';
import {
  BinaryExpression,
  Type,
  Expr,
  LogicalExpression,
  UnaryExpression,
  CallFunction,
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

const stringErrorAssign = [];
const doubleErrorAssign = [];
const booleanErrorAssign = [Type.String, Type.Double, Type.Int, Type.Char];
const intErrorAssign = [Type.String];
const charErrorAssign = [Type.String, Type.Double, Type.Boolean];

class ExpressionsVisitor extends Visitor {
  override visitBinaryExpression(node: BinaryExpression): void {
    let newType = this.getBinaryType(node.left, node.operator, node.right);
    if (newType === null) {
      logError(
        node.loc,
        `La operación ${node.left.type} ${node.operator} ${node.right.type} no es posible`
      );
    }
  }

  override visitLogicalExpression(node: LogicalExpression): void {
    if (node.left.type !== Type.Boolean || node.right.type !== Type.Boolean) {
      logError(
        node.loc,
        `La operación ${node.left.type} ${node.operator} ${node.right.type} no es posible`
      );
    }
  }

  override visitUnaryExpression(node: UnaryExpression): void {
    if (node.argument.constructor.name === CallFunction.name) {
      if (this.ambit !== undefined) {
        let cf = node.argument as CallFunction;
        let func = this.ambit.getFunction(cf.getTableName());
        if (func !== undefined) {
          node.type = func.type;
        }
      }
    }
    switch (node.operator) {
      case '!':
        if (node.type !== Type.Boolean)
          logError(
            node.loc,
            `La operación ${node.operator} ${node.type} es inválida`
          );
        break;
      case '-':
        let tp = this.getBinaryType(new UnaryExpression(null, Type.Int, '', 0), '-', node);
        if(tp !== null){
          node.type = tp;
        }else{
          logError(
            node.loc,
            `La operación ${node.operator} ${node.type} es inválida`
          );
        }
        break;
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
      if (left.type === right.type) {
        return Type.Boolean;
      }
    }
    return null;
  }
}

export default ExpressionsVisitor;
