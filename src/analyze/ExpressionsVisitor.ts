import { BinaryExpression } from "src/astMembers/Node";
import Visitor from "./Visitor";

class ExpressionsVisitor extends Visitor{
  override visitBinaryExpression(node: BinaryExpression): void {
       
  }
}

export default ExpressionsVisitor;