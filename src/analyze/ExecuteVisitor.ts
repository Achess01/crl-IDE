import {
  CallFunction,
  functionDeclaration,
  functionMain,
  IfStmt,
  Mostrar,
} from 'src/astMembers/Node';
import Visitor from './Visitor';
import * as deepAssing from 'object-assign-deep';

class ExecuteVisitor extends Visitor {
  override visitCallFunction(node: CallFunction): void {
    console.log(node.getTableName());
    //let func = this.ambit?.getFunction(funcName);
    /* if(func && this.ambit){
      //let newFunc = deepAssing({}, func);
      let newFunc = Object.assign({}, func);
      newFunc.params = deepAssing({}, func.params);
      newFunc.table.setSymbolVars(deepAssing({}, func.table.getSymbolVars()));
      //if(newFunc.table.upperAmbit) newFunc.table.upperAmbit.name="HOLAA";            
      console.log(newFunc);            
    } */
  }

  override visitIfStmt(node: IfStmt): void {
    console.log(this.ambit);
  }

  override visitMostrar(node: Mostrar): void {
    console.log('Mostrar ambit');
    console.log(this.ambit);
  }

  override visitfunctionMain(node: functionMain): void {}
}

export default ExecuteVisitor;
