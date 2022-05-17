import { Component, Input, OnInit, ViewChild } from '@angular/core';
import SymTableGlobalVisitor from 'src/analyze/SymTableVisitorGlobal';
import ast from 'src/parser/ast';
import SymTableVisitor from 'src/analyze/SymTableVisitor';
import ExpressionsVisitor from 'src/analyze/ExpressionsVisitor';
import ExecuteVisitor from 'src/analyze/ExecuteVisitor';
import { Program } from 'src/astMembers/Node';
import { EditorComponent } from '../editor-manager/editor.component';

@Component({
  selector: '.tab-pane[role=tabpanel]',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
})
export class TextEditorComponent implements OnInit, EditorComponent {
  @Input() data: any;
  content: string;
  line: number = 1;
  column: number = 1;

  constructor() {
    this.content = '!!Inicio del archivo';
    this.line = 1;
    this.column = 1;
  }

  @ViewChild('cm') cm: any;

  codeMirrorOptions: any = {
    theme: 'material',
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    autofocus: true,
    extraKeys: {
      Tab: function (cm: any) {
        cm.replaceSelection('    ', 'end');
      },
    },
  };

  ngOnInit(): void {
    this.content = this.data.initialContent;
    /*     this.content = `Importar hola.crl
Importar segundo1.crl 
Importar segundo2.crl     
Importar segundo3.crl 
Importar segundo4.crl     
Incerteza 0.34

String cadena1, cadena2 = "Hola", cadena3 = "amigos"
Char a = 'a'


Void Principal():
  
  Mostrar("Factorial {0}", factorial2(5))
  

Int factorial(Int n):
    Int num = 1
    Mientras(n >= 1):
      num = num * n
      n = n -1
    Retorno num
  
Int fibonacci(Int num):
    Si(num == 0 || num == 1):
      Retorno num
    Sino:
      Retorno fibonacci(num -1) + fibonacci(num -2)

Int factorial2(Int numero):
    Si(numero > 1):
      numero = numero * factorial2(numero - 1)
    Retorno numero

Int getMax(String n1, Int n2):
    Boolean v = 2 == n2 
    DibujarTS()

        !!Hola perro

Int getMax(Int n1, Int n2):
    Si (n1 >= n2):
        DibujarTS()
        Retorno n1
        Int valor = 20 * 23
        Para(Int x = valor; x < 30; ++):
            Int num3
            num3 = 0
            Int i = 20
            Si(x % 2 == num3):
                Mostrar("Hola amigos {0}", x) 
                Retorno x
        Char caracter
        caracter = 'm'
        Int num3 = 234
    Sino:
        Retorno n2    
    Int entero0, entero, entero2 = 3234, entero3 = 234 + 34 +98 + 1000 * 2
    `; */
  }

  /* setEditorContent(event: any) {
    // console.log(event, typeof event);
    console.log(this.content);
  } */

  ngAfterViewInit() {
    this.cm.cursorActivity.subscribe(this.caretMoved.bind(this));
  }

  onCompile() {
    let filename = 'example';
    let tree = ast(this.content, filename);
    let visitorTable = new SymTableGlobalVisitor(filename);
    visitorTable.visit(tree);
    let symT = new SymTableVisitor(filename).setGlobal(tree.table);
    tree.accept(symT);
    let exprs = new ExpressionsVisitor(filename).setGlobal(tree.table);
    tree.accept(exprs);
    if (
      (tree as Program).main !== null &&
      visitorTable.correct &&
      symT.correct &&
      exprs.correct
    ) {
      let executeVisitor = new ExecuteVisitor(filename).setGlobal(tree.table);
      executeVisitor.visit(tree);
    }
  }

  changeValues(line: number, column: number) {
    this.line = line;
    this.column = column;
  }

  caretMoved(codeMirror: any) {
    let cursor = codeMirror.getCursor();
    this.changeValues(cursor.line + 1, cursor.ch + 1);
  }
}
