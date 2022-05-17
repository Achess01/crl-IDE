import { Component, Input, OnInit } from '@angular/core';
import { ResultComponent } from '../editor-manager/editor.component';

@Component({
  selector: 'result-img',
  template: `
    <img
      [src]="data.src"
      alt="ast"
      class="m-2 shadow p-3 mb-5 bg-body rounded"
    />
  `,
})
export class ResultImgComponent implements OnInit, ResultComponent {
  @Input() data: any;
  constructor() {}
  ngOnInit(): void {}
}
