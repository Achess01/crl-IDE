import { Program } from "src/astMembers/Node";
import logError from "src/errors/LogError";
import ast from "src/parser/ast";
import SymTableGlobalVisitor from "./SymTableVisitorGlobal";
import SymTableVisitor from "./SymTableVisitor";
import ExpressionsVisitor from "./ExpressionsVisitor";
import CRLFile from "./CRLFile";

class Analyzer {  
  crl: Program[] = [];
  main?: Program;
  constructor(mainFile: CRLFile, files: CRLFile[]){    
    /* if(this.getASTs(files) && this.validateASTs()){
      
    }  */
  }

  private compile(tree: Program){
    let visitorTable = new SymTableGlobalVisitor();
    visitorTable.visit(tree);
    tree.accept(new SymTableVisitor(), null);
    tree.accept(new ExpressionsVisitor(), null);
    console.log(tree);
  }

  private getASTs(files: string[]): boolean{
    try{
      this.crl = files.map(f => ast(f));
      return true;
    }catch(e){
      console.error(e);
      return false
    }    
  }

  private validateASTs():boolean{
    let correct = true;
    this.crl.forEach(f => {
      if(f.main !== null){
        if(!this.setMain(f)) correct = false;
      }
    })
    return correct;
  }

  private setMain(main: Program):boolean{
    if(this.main === undefined){
      this.main = main;
      return true;
    }else{
      logError({}, "La función Principal():Void solo puede existir en un archivo");
      return false;
    }
  }
}

export default Analyzer;
