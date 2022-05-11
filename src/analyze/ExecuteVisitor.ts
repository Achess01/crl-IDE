import { CallFunction, functionDeclaration, functionMain } from 'src/astMembers/Node';
import Visitor from './Visitor';

class ExecuteVisitor extends Visitor {
  override visitCallFunction(node: CallFunction): void {
    let funcTypes = node.args.reduce((previus, current) => {
      if (previus.length === 0 && current.type) {
        return current.type.toString();
      } else if (current.type) {
        return `${previus},${current.type.toString()}`;
      }
      return previus;
    }, '');

    let funcName = `${node.callee}(${funcTypes})`;
    let func = this.ambit?.getFunction(funcName);
    if(func && this.ambit){
      let newFunc = Object.assign({}, func);
      //if(newFunc.table.upperAmbit) newFunc.table.upperAmbit.name="HOLAA";
      newFunc.table = Object.assign({}, func.table);
      func.id = `${func.id}-viejo`;      
      console.log(newFunc);
    }
    console.log(node);
  }

  override visitfunctionMain(node: functionMain): void {}
}

export default ExecuteVisitor;
