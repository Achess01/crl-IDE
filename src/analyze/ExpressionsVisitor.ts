import { BinaryExpression, Type } from '../astMembers/Node';
import Visitor from './Visitor';

export const combinations = [
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

export const additionCast = [
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
  Type.Int 
];
class ExpressionsVisitor extends Visitor {
  override visitBinaryExpression(node: BinaryExpression): void {}
}

export default ExpressionsVisitor;
