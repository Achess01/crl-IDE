import { Component, Input, OnInit } from '@angular/core';
import { ResultComponent } from '../editor-manager/editor.component';

@Component({
  selector: 'result-img',
  template: `
    <div class="container d-flex flex-column">
      <img
        [src]="data.src"
        alt="ast"
        class="img-fluid shadow p-3 mb-3 bg-body rounded border border-bottom-0 border-success"
      />
      <a [href]="data.src" class="mb-5 btn btn-dark" download="graph.svg"
        >Descargar</a
      >
    </div>
  `,
})
export class ResultImgComponent implements OnInit, ResultComponent {
  @Input() data: any;
  constructor() {}
  ngOnInit(): void {}
}
