import { functionMain, ImportDeclaration, Program } from 'src/astMembers/Node';
import { SymTable } from 'src/astMembers/SymbolTable';
import ast from 'src/parser/ast';
import CRLFile from './CRLFile';
import ExpressionsVisitor from './ExpressionsVisitor';
import SymTableVisitor from './SymTableVisitor';
import SymTableGlobalVisitor from './SymTableVisitorGlobal';
import Visitor from './Visitor';

class ImportsVisitor extends Visitor {
  files: CRLFile[];
  isMain: boolean;
  constructor(
    files: CRLFile[],
    filename: string,
    ambit: SymTable,
    isMain?: boolean
  ) {
    super(filename, ambit);
    this.files = files;
    if (isMain) this.isMain = isMain;
    else this.isMain = false;
  }

  override visitProgram(node: Program): void {
    for (const child of node.body) {
      if (child.constructor.name === ImportDeclaration.name) {
        (child as ImportDeclaration).accept(this, null);
      } else if (child.constructor.name === functionMain.name && !this.isMain) {
        this.logError(
          child.loc,
          `Función Principal() no esperada en ${this.filename}`
        );
      }
    }
    let symT = new SymTableVisitor(node.filename).setGlobal(node.table);
    node.accept(symT, null);
    let exprs = new ExpressionsVisitor(node.filename).setGlobal(node.table);
    node.accept(exprs, null);

    this.correct = this.correct && symT.correct && exprs.correct;
  }

  override visitImportDeclaration(node: ImportDeclaration): void {
    let name = node.fileId;
    let file = this.files.find((f) => f.name === name);
    if (file && file.name !== this.filename) {
      if (!file.program) {
        try {
          let programAST = ast(file.content, file.name) as Program;
          programAST.filename = file.name;
          let globalSymT = new SymTableGlobalVisitor(file.name);
          globalSymT.visit(programAST);
          let variables = programAST.table.symbolVars;
          let functions = programAST.table.symbolFuncs;
          for (const key in variables) {
            if (!this.ambit.addVariable(variables[key])) {
              this.logError(
                node.loc,
                `Conflicto con la variable '${variables[key].id.name}' importada de ${file.name}`
              );
            }
          }

          for (const key in functions) {
            for (const key_type in functions[key]) {
              if (!this.ambit.addFunc(functions[key][key_type])) {
                this.logError(
                  node.loc,
                  `Conflicto con la función '${functions[key][key_type].nameForTable}' importada de ${file.name}`
                );
              }
            }
          }
          file.program = programAST;
          let importedVisitor = new ImportsVisitor(
            this.files,
            programAST.filename,
            programAST.table
          );
          importedVisitor.visit(programAST);
          this.correct = this.correct && importedVisitor.correct;
        } catch (e: any) {
          this.logError(node.loc, `Error al cargar el archivo ${name}.crl`);
          console.error(e);
        }
      } else {
        let variables = file.program.table.symbolVars;
        let functions = file.program.table.symbolFuncs;
        for (const key in variables) {
          if (!this.ambit.addVariable(variables[key])) {
            this.logError(
              node.loc,
              `Conflicto con la variable '${variables[key].id.name} importada de ${file.name}`
            );
          }
        }

        for (const key in functions) {
          for (const key_type in functions[key]) {
            if (!this.ambit.addFunc(functions[key][key_type])) {
              this.logError(
                node.loc,
                `Conflicto con la función '${functions[key][key_type].nameForTable} importada de ${file.name}`
              );
            }
          }
        }
      }
    } else {
      this.logError(node.loc, `Error al cargar el archivo ${name}.crl`);
    }
  }
}

export default ImportsVisitor;
