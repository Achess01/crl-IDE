import { Component, OnInit } from '@angular/core';
import ast from 'src/parser/ast';


@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
    content: string;
  constructor() { 
      this.content = "";
  }
  codeMirrorOptions: any = {
    theme: 'material',
    lineNumbers: true,
    lineWrapping: true,        
    autoCloseBrackets: true,
    matchBrackets: true,    
  };
  
  ngOnInit(): void {
    this.content = 
`Importar hola.crl
Importar segundo1.crl 
Importar segundo2.crl     
Importar segundo3.crl 
Importar segundo4.crl     
Incerteza 0.34

Int getMax(Int n1, Int n2):
    Int entero = 234 + 34 +98 + 1000 * 2
    Si (n1 >= n2):
        DibujarTS()
        Retorno variable
        valor = 20 * valor2
        Para(Int x = 0; x < 30; ++):
            Si(x % 2 == 0):
                Mostrar("Hola amigos {0}", x) 
                Retorno x
    Sino:
        Retorno n2`
  }

  /* setEditorContent(event: any) {
    // console.log(event, typeof event);
    console.log(this.content);
  } */

  onCompile(){    
    console.log(ast(this.content));
  }
}
