import { ImportDeclaration, Program } from 'src/astMembers/Node';
import logError from 'src/errors/LogError';
import ast from 'src/parser/ast';
import SymTableGlobalVisitor from './SymTableVisitorGlobal';
import CRLFile from './CRLFile';
import ImportsVisitor from './ImportsVisitor';
import ExecuteVisitor from './ExecuteVisitor';

class Analyzer {
  mainFile: CRLFile;
  files: CRLFile[];
  errors: boolean = false;
  dots: string[] = [];
  constructor(mainFile: CRLFile, files: CRLFile[]) {
    this.mainFile = mainFile;
    this.files = files;
  }

  run() {
    try {
      let mainAST = ast(this.mainFile.content, this.mainFile.name) as Program;
      mainAST.filename = this.mainFile.name;
      let globalSymT = new SymTableGlobalVisitor(mainAST.filename).setGlobal(mainAST.table);
      globalSymT.visit(mainAST);
      if (mainAST.main) {
        let importVisitor = new ImportsVisitor(
          this.files,
          mainAST.filename,
          mainAST.table,
          true
        ).setGlobal(mainAST.table);
        importVisitor.visit(mainAST);
        if (importVisitor.correct) {
          let executeVisitor = new ExecuteVisitor(mainAST.filename).setGlobal(
            mainAST.table
          );
          ExecuteVisitor.dotFormats = [];
          ExecuteVisitor.tableInfo = [];
          ExecuteVisitor.logs = [];
          executeVisitor.visit(mainAST);
          return [ExecuteVisitor.dotFormats, ExecuteVisitor.tableInfo, ExecuteVisitor.logs];
        }
      } else {
        logError.logError(
          mainAST.loc,
          `No existe el método principal en ${this.mainFile.name}`
        );
      }
    } catch (e: any) {
      //logError({}, `Errores sintácticos en ${this.mainFile.name}.crl`);
      console.error(e);
    }
    return [];
  }
}

export default Analyzer;
