import {
  Assignment,
  breakStmt,
  CallFunction,
  continueStmt,
  DibujarAST,
  DibujarEXP,
  DibujarTS,
  forStmt,
  functionDeclaration,
  IfStmt,
  returnStmt,
  VariableDeclarator,
  whileStmt,
} from 'src/astMembers/Node';
import { attribute, Digraph, digraph } from 'ts-graphviz';
import Visitor from './Visitor';

class DotGeneratorVisitor extends Visitor {
  digraphGenerated: Digraph = digraph('func', {
    [attribute.label]: 'Función',
  });
  counter = 0;

  override visitfunctionDeclaration(node: functionDeclaration): void {
    const nodeG = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `${node.nameForTable}:${node.type}`,
    });
    this.counter++;
    for (const child of node.body) {
      if (child.nr) this.digraphGenerated.createEdge([nodeG, child.nr]);
    }
  }

  override visitVariableDeclarator(node: VariableDeclarator): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `VarDec ${node.id.name}`,
    });
    this.counter++;
    if (node.init) {
      let nInit = this.digraphGenerated.createNode(`node${this.counter}`, {
        [attribute.label]: 'Expresión',
      });
      this.counter++;
      this.digraphGenerated.createEdge([node.nr, nInit]);
    }
  }

  override visitIfStmt(node: IfStmt): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Si',
    });
    this.counter++;
    let expr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Expresion',
    });
    this.counter++;
    let body = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Cuerpo',
    });
    this.counter++;
    this.counter++;
    this.digraphGenerated.createEdge([node.nr, expr]);
    this.digraphGenerated.createEdge([node.nr, body]);
    for (const child of node.consequent) {
      if (child.nr) this.digraphGenerated.createEdge([body, child.nr]);
    }

    if (node.alternate.length > 0) {
      let bodyAlternate = this.digraphGenerated.createNode(
        `node${this.counter}`,
        { [attribute.label]: 'Cuerpo' }
      );
      for (const child of node.alternate) {
        if (child.nr)
          this.digraphGenerated.createEdge([bodyAlternate, child.nr]);
      }
    }
  }

  override visitCallFunction(node: CallFunction): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `Llamar ${node.callee}`,
    });
    this.counter++;
  }

  override visitDibujarAST(node: DibujarAST): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `DibujarAST`,
    });
    this.counter++;
  }

  override visitDibujarEXP(node: DibujarEXP): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `DibujarEXP`,
    });
    this.counter++;
  }

  override visitDibujarTS(node: DibujarTS): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `DibujarTS`,
    });
    this.counter++;
  }

  override visitcontinueStmt(node: continueStmt): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `Continuar`,
    });
    this.counter++;
  }

  override visitbreakStmt(node: breakStmt): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `Detener`,
    });
    this.counter++;
  }

  override visitforStmt(node: forStmt): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Para',
    });
    this.counter++;
    let init = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Init',
    });
    this.counter++;
    let update = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: node.update,
    });
    this.counter++;
    let expr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Expresion',
    });
    this.counter++;
    let body = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Cuerpo',
    });
    this.counter++;
    this.digraphGenerated.createEdge([node.nr, init]);
    this.digraphGenerated.createEdge([node.nr, update]);
    this.digraphGenerated.createEdge([node.nr, expr]);
    this.digraphGenerated.createEdge([node.nr, body]);
    for (const child of node.body) {
      if (child.nr) this.digraphGenerated.createEdge([body, child.nr]);
    }
  }

  override visitwhileStmt(node: whileStmt): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Mientras',
    });
    this.counter++;
    let expr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Expresion',
    });
    this.counter++;
    let body = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Cuerpo',
    });
    this.counter++;
    this.digraphGenerated.createEdge([node.nr, expr]);
    this.counter++;
    this.digraphGenerated.createEdge([node.nr, body]);
    this.counter++;
    for (const child of node.body) {
      if (child.nr) this.digraphGenerated.createEdge([body, child.nr]);
    }
  }

  override visitreturnStmt(node: returnStmt): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Retorno',
    });
    this.counter++;
    if (node.argument) {
      let expr = this.digraphGenerated.createNode(`node${this.counter}`, {
        [attribute.label]: 'Expresion',
      });
      this.counter++;
      this.digraphGenerated.createEdge([node.nr, expr]);
    }
  }

  override visitAssignment(node: Assignment): void {
    node.nr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Asignación',
    });
    this.counter++;
    let vName = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: `var ${node.id.name}`,
    });
    this.counter++;
    let eq = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: '=',
    });
    this.counter++;
    let expr = this.digraphGenerated.createNode(`node${this.counter}`, {
      [attribute.label]: 'Expresión',
    });
    this.counter++;
    this.digraphGenerated.createEdge([node.nr, vName]);
    this.digraphGenerated.createEdge([node.nr, eq]);
    this.digraphGenerated.createEdge([node.nr, expr]);
  }
}

export default DotGeneratorVisitor;
