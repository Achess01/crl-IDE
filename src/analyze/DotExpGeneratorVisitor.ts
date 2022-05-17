import {
  BinaryExpression,
  CallFunction,
  Identifier,
  UnaryExpression,
} from 'src/astMembers/Node';
import { attribute, graph, Graph } from 'ts-graphviz';
import Visitor from './Visitor';

class DotExpGeneratorVisitor extends Visitor {
  expG: Graph = graph('Expresion', { [attribute.label]: 'Expresión' });
  counter = 0;

  override visitBinaryExpression(node: BinaryExpression): void {
    let oplabel;
    switch (node.operator) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '^':
        oplabel = 'Aritmético';
        break;
      case '==':
      case '!=':
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '~':
        oplabel = 'Relacional';
        break;
      default:
        oplabel = 'Lógico';
    }

    node.nr = this.createNode(`${oplabel}: ${node.operator}`);
    this.expG.createEdge([node.nr, node.left.nr]);
    this.expG.createEdge([node.nr, node.right.nr]);
  }

  override visitUnaryExpression(node: UnaryExpression): void {
    let val;
    switch (node.argument.constructor.name) {
      case Identifier.name:
        let id = node.argument as Identifier;
        val = this.createNode(`Variable: ${node.type} ${id.name}]`);
        break;
      case CallFunction.name:
        let callee = node.argument as CallFunction;
        val = this.createNode(
          `Llamada: ${callee.getTableName()}:${node.type}]`
        );
        break;
      default:
        val = this.createNode(`${node.type}: ${node.argument}`);
    }

    if (node.operator) {
      node.nr = this.createNode(node.operator);
      this.expG.createEdge([node.nr, val]);
    } else {
      node.nr = val;
    }
  }

  createNode(label: string) {
    this.counter++;
    return this.expG.createNode(`node${this.counter}`, {
      [attribute.label]: label,
    });
  }
}

export default DotExpGeneratorVisitor;
