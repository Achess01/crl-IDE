import { Component, Inject, Input, OnInit } from '@angular/core';
import { TabComponent } from '../editor-manager/editor.component';

@Component({  
  selector: 'li.nav-item[role=presentation]',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.css'],
})
export class TabHeaderComponent implements OnInit, TabComponent {
  @Input() data: any;    
  constructor() {}  
  ngOnInit(): void {}
}
