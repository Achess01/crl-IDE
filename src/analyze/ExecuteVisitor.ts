import {
  Assignment,
  BinaryExpression,
  CallFunction,
  Expr,
  forStmt,
  functionDeclaration,
  functionMain,
  Identifier,
  IfStmt,
  LogicalExpression,
  Mostrar,
  Program,
  Type,
  UnaryExpression,
  VariableDeclarator,
  whileStmt,
} from 'src/astMembers/Node';
import Visitor from './Visitor';


class ExecuteVisitor extends Visitor {
  override visitProgram(node: Program): void {
    for (const child of node.body) {
      if (child.constructor.name === VariableDeclarator.name) {
        (child as VariableDeclarator).accept(this, node.table);
      } else if (child.constructor.name === Assignment.name) {
        (child as Assignment).accept(this, node.table);
      }
    }
    node.main?.accept(this, node.table);
  }

  override visitCallFunction(node: CallFunction): void {
    if (this.ambit) {
      let func = this.ambit.getFunction(node.getTableName(), this.global);
      if (func) {
        let nf = this.cloneFunction(func);
      }
    }
  }

  cloneFunction(func: functionDeclaration): functionDeclaration {
    let nf = Object.assign(
      new functionDeclaration({}, '', [], Type.Void, []),
      func
    );
    this.cloneTable(func, nf);
    return nf;
  }

  cloneFor(old: forStmt) {
    let nf = Object.assign(
      new forStmt({}, [], old.init, old.test, old.update),
      old
    );
    this.cloneTable(old, nf);
    return nf;
  }

  cloneWhile(old: whileStmt) {
    let nf = Object.assign(new whileStmt({}, [], old.test), old);
    this.cloneTable(old, nf);
    return nf;
  }

  cloneIf(old: IfStmt) {
    let nf = Object.assign(new IfStmt({}, old.test, [], []), old);
    this.cloneTableIf(old, nf);
    return nf;
  }

  cloneTable(
    oldB: functionDeclaration | whileStmt | forStmt,
    newB: functionDeclaration | whileStmt | forStmt
  ) {
    newB.table = Object.assign({}, oldB.table);
    let vars = newB.table.symbolVars;
    let newVars: { [id: string]: VariableDeclarator } = {};
    for (const key in vars) {
      const old_var = vars[key];
      const cloned_var = Object.assign(
        new VariableDeclarator({}, old_var.id, null),
        old_var
      );
      newVars[key] = cloned_var;
      //cloned_var.init = new UnaryExpression({},Type.Void,'0',`logrado ${key}`);
    }
    newB.table.symbolVars = newVars;
  }

  cloneTableIf(oldB: IfStmt, newB: IfStmt) {
    /* Consequent table */
    newB.table = Object.assign({}, oldB.table);
    let vars = newB.table.symbolVars;
    let newVars: { [id: string]: VariableDeclarator } = {};
    for (const key in vars) {
      const old_var = vars[key];
      const cloned_var = Object.assign(
        new VariableDeclarator({}, old_var.id, null),
        old_var
      );
      newVars[key] = cloned_var;
      //cloned_var.init = new UnaryExpression({},Type.Void,'0',`logrado ${key}`);
    }
    newB.table.symbolVars = newVars;

    /* Alternate table */
    newB.tableAlternate = Object.assign({}, oldB.tableAlternate);
    let varsAlt = newB.tableAlternate.symbolVars;
    let newVarsAlt: { [id: string]: VariableDeclarator } = {};
    for (const key in varsAlt) {
      const old_var = varsAlt[key];
      const cloned_var = Object.assign(
        new VariableDeclarator({}, old_var.id, null),
        old_var
      );
      newVarsAlt[key] = cloned_var;
      //cloned_var.init = new UnaryExpression({},Type.Void,'0',`logrado ${key}`);
    }
    newB.tableAlternate.symbolVars = newVars;
  }

  override visitIfStmt(node: IfStmt): void {
    console.log(this.ambit);
  }

  override visitMostrar(node: Mostrar): void {
    let expresisons = node.expressions;
    let formatInfo = node.strFormat;
    for(const index in expresisons){
      formatInfo = formatInfo.replace(`{${index}}`, expresisons[parseInt(index)].value);
    }
    console.info(formatInfo);
  }

  override visitfunctionMain(node: functionMain): void {}

  override visitVariableDeclarator(node: VariableDeclarator): void {
    if (node.init && this.ambit) {
      let variable = this.ambit.getVariable(node.id.name, this.global);
      if (variable) variable.value = this.assignmentChangeValue(variable.type, node.init);
    }
  }

  assignmentChangeValue(typeVar: Type | null, expr: Expr) {
    switch (typeVar) {
      case Type.String:
        return this.assignmentChangeString(expr);
      case Type.Double:
        return this.assignmentChangeDouble(expr);
      case Type.Boolean:
        return this.assignmentChangeBoolean(expr);
      case Type.Char:
        return this.assignmentChangeChar(expr);
      case Type.Int:
        return this.assignmentChangeInt(expr);
    }
    return expr.value;
  }

  assignmentChangeString(expr: Expr) {
    return String(expr.value);
  }

  assignmentChangeDouble(expr: Expr) {
    switch (expr.type) {
      case Type.Boolean:
        if (expr.value) return 1;
        return 0;
      case Type.Char:
        return (expr.value as string).charCodeAt(0);
    }
    return expr.value;
  }

  assignmentChangeBoolean(expr: Expr) {
    return expr.value;
  }
  assignmentChangeChar(expr: Expr) {
    switch (expr.type) {
      case Type.Int:
        return String.fromCharCode(expr.value);
    }
    return expr.value;
  }
  assignmentChangeInt(expr: Expr) {
    switch (expr.type) {
      case Type.Double:
        return parseInt(expr.value);
      case Type.Boolean:
        if (expr.value) return 1;
        return 0;
      case Type.Char:
        return (expr.value as string).charCodeAt(0);
    }

    return expr.value;
  }

  override visitAssignment(node: Assignment): void {
    if (this.ambit) {
      let variable = this.ambit.getVariable(node.id.name, this.global);
      if (variable) variable.value = this.assignmentChangeValue(variable.type, node.expression);
    }
  }

  override visitUnaryExpression(node: UnaryExpression): void {
    if (this.ambit && node.argument.constructor.name === Identifier.name) {
      let nodeId = node.argument as Identifier;
      let variable = this.ambit.getVariable(nodeId.name, this.global);
      if (variable) node.value = variable.value;
    } else if (
      this.ambit &&
      node.argument.constructor.name === CallFunction.name
    ) {
      let nodeCall = node.argument as CallFunction;
      node.value = nodeCall.returnedValue;
    } else {
      node.value = node.argument;
    }

    switch (node.operator) {
      case '!':
        node.value = !node.value;
        break;
      case '-':
        node.value = 0 - node.value;
        break;
    }
  }

  override visitBinaryExpression(node: BinaryExpression): void {
    switch (node.operator) {
      case '+':
        node.value =
          this.getValue(node.left, node.right) +
          this.getValue(node.right, node.left);
        break;
      case '-':
        node.value =
          this.getValue(node.left, node.right) -
          this.getValue(node.right, node.left);
        break;
      case '*':
        node.value =
          this.getValue(node.left, node.right) *
          this.getValue(node.right, node.left);
        break;
      case '/':
        node.value =
          this.getValue(node.left, node.right) /
          this.getValue(node.right, node.left);
        break;
      case '%':
        node.value =
          this.getValue(node.left, node.right) %
          this.getValue(node.right, node.left);
        break;
      case '^':
        node.value = Math.pow(
          this.getValue(node.left, node.right),
          this.getValue(node.right, node.left)
        );
        break;
      case '==':
        node.value =
          this.getValue(node.left, node.right) ===
          this.getValue(node.right, node.left);
        break;
      case '!=':
        node.value =
          this.getValue(node.left, node.right) !==
          this.getValue(node.right, node.left);
        break;
      case '~':
        let lval = this.getValue(node.left, node.right);
        let rval = this.getValue(node.right, node.left);
        if (node.left.type === Type.String) {
          let lv = lval as string;
          let rv = rval as string;
          lv = lv.trim().toLowerCase();
          rv = rv.trim().toLowerCase();
          node.value = lv === rv;
        } else if (
          node.left.type === Type.Int ||
          node.left.type === Type.Double          
        ) {
          let incertVal = Math.abs(lval - rval);          
          node.value = incertVal <= this.ambit.incert ? true : false;
        } else {
          node.value = lval === rval;
        }
        break;
      case '>':
        node.value =
          this.getValue(node.left, node.right) >
          this.getValue(node.right, node.left);
        break;
      case '>=':
        node.value =
          this.getValue(node.left, node.right) >=
          this.getValue(node.right, node.left);
        break;
      case '<':
        node.value =
          this.getValue(node.left, node.right) <
          this.getValue(node.right, node.left);
        break;
      case '<=':
        node.value =
          this.getValue(node.left, node.right) <=
          this.getValue(node.right, node.left);
        break;
    }
  }

  override visitLogicalExpression(node: LogicalExpression): void {
    switch (node.operator) {
      case '||':
        node.value =
          this.getValue(node.left, node.right) ||
          this.getValue(node.right, node.left);
        break;
      case '&&':
        node.value =
          this.getValue(node.left, node.right) &&
          this.getValue(node.right, node.left);
        break;
      case '!&':
        let val =
          this.getValue(node.left, node.right) ^
          this.getValue(node.right, node.left);
        if (val === 1) node.value = true;
        node.value = false;
        break;
    }
  }

  getValue(exp: Expr, interact: Expr): any {
    switch (exp.type) {
      case Type.Int:
      case Type.Double:
      case Type.String:
        return exp.value;
      case Type.Boolean:
        switch (interact.type) {
          case Type.Int:
          case Type.Double:
          case Type.String:
            return Number(exp.value);
        }
        break;
      case Type.Char:
        switch (interact.type) {
          case Type.Int:
          case Type.Double:
            return (exp.value as string).charCodeAt(0);
            break;
        }
        break;
    }

    return exp.value;
  }
}

export default ExecuteVisitor;
