import { ImportDeclaration, Program } from 'src/astMembers/Node';
import logError from 'src/errors/LogError';
import ast from 'src/parser/ast';
import SymTableGlobalVisitor from './SymTableVisitorGlobal';
import SymTableVisitor from './SymTableVisitor';
import ExpressionsVisitor from './ExpressionsVisitor';
import CRLFile from './CRLFile';

class Analyzer {
  crl: Program[] = [];
  main?: Program;
  mainFile: CRLFile;
  files: CRLFile[];
  errors:boolean = false;
  constructor(mainFile: CRLFile, files: CRLFile[]) {
    /* if(this.getASTs(files) && this.validateASTs()){
      
    }  */
    this.mainFile = mainFile;
    this.files = files;
  }

  run() {
    try {
      this.main = ast(this.mainFile.content, this.mainFile.name);
      if(this.main){
        this.main.filename = this.mainFile.name;
        this.searchForImports(this.main);
      }
    } catch (e: any) {
      logError({}, `Errores sintácticos en ${this.mainFile.name}.crl`);
    }
  }

  searchForImports(program: Program) {
    let imports: string[] = [];
    for (const child of program.body) {
      if (child.constructor.name === ImportDeclaration.name) {
        let filename = (child as ImportDeclaration).fileId;
        if(filename !== program.filename){
          imports.push(filename);
        }else{
          logError((child as ImportDeclaration).loc, `Importación de sí mismo\nArchivo ${program.filename}`);
          this.errors = true;
        }
      }
    }

    return this.getImportedPrograms(imports)      
    
  }

  getImportedPrograms(imports:string[]): Program[]{
    if(!this.errors){
      let programs:Program[] = [];
      imports.forEach(importName => {
        
      });
    }
    return [];
  }

  private compile(tree: Program, filename: string): boolean {
    let visitorTable = new SymTableGlobalVisitor(filename);
    visitorTable.visit(tree);
    let symT = new SymTableVisitor(filename).setGlobal(tree.table);
    tree.accept(symT, null);
    let exprs = new ExpressionsVisitor(filename).setGlobal(tree.table);
    tree.accept(exprs, null);
    console.log(tree);
    return visitorTable.correct && symT.correct && exprs.correct;
  }

  private getASTs(): boolean {
    try {
      //this.crl = files.map(f => ast(f));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  private validateASTs(): boolean {
    let correct = true;
    this.crl.forEach((f) => {
      if (f.main !== null) {
        if (!this.setMain(f)) correct = false;
      }
    });
    return correct;
  }

  private setMain(main: Program): boolean {
    if (this.main === undefined) {
      this.main = main;
      return true;
    } else {
      logError(
        {},
        'La función Principal():Void solo puede existir en un archivo'
      );
      return false;
    }
  }
}

export default Analyzer;
