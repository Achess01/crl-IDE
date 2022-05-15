import { Component, Inject, Input, OnInit } from '@angular/core';
import { TabComponent } from '../editor-manager/editor.component';

@Component({
  selector: 'app-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.css'],
})
export class TabHeaderComponent implements OnInit, TabComponent {
  @Input() target: any;
  @Input() name: any;
  @Input() pane: any;
  constructor() {}  
  ngOnInit(): void {}
}
