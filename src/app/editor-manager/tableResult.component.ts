import { Component, Input, OnInit } from '@angular/core';
import { ResultComponent } from '../editor-manager/editor.component';

@Component({
  selector: 'result-table',
  template: `
    <table class="table mb-5">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" colspan="2">{{ data.ambit }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of data.variables; let indice = index">
          <td>{{ indice + 1 }}</td>
          <td>Variable {{ item.id.name }}</td>
          <td>
            Valor: {{ item.value }} ln: {{ item.loc.first_line }} col:
            {{ item.loc.first_column }} Tipo {{ item.type }}
          </td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TableResultComponent implements OnInit, ResultComponent {
  @Input() data: any;
  constructor() {}
  ngOnInit(): void {}
}
