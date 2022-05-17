import { Component, Input, OnInit } from '@angular/core';
import { ResultComponent} from '../editor-manager/editor.component';

@Component({
  selector: 'result-img',
  template: `
    <picture>
      <img [src]="data.src" alt="ast">
    </picture>
  `
  
})
export class ResultImgComponent implements OnInit, ResultComponent {
  @Input() data: any;
  constructor() {}
  ngOnInit(): void {}
}
