import {
  CallFunction,
  functionDeclaration,
  functionMain,
  IfStmt,
  Mostrar,
  Type
} from 'src/astMembers/Node';
import Visitor from './Visitor';
import * as deepAssign from 'object-assign-deep';

class ExecuteVisitor extends Visitor {
  override visitCallFunction(node: CallFunction): void {    
    if(this.ambit){
      let func = this.ambit.getFunction(node.getTableName(), this.global);
      if(func){        
        /* let newFunc = deepAssign(new functionDeclaration({},'',[],Type.Void,[]), func);      
        newFunc.body.pop();
        newFunc.body.pop();                
        newFunc.table.name = "nuevaaaa"
        console.log(newFunc);
        console.log(func); */        
        let fc = structuredClone(func);
        console.log(fc);
      }
    }
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
