import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TabHeaderComponent } from '../tab-header/tab-header.component';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { EditorItem } from './editor-item';
import { EditorComponent, TabComponent } from './editor.component';
import { EditorDirective } from './editor.directive';
import { TabItem } from './tab-item';
import { TabDirective } from './tab.directive';

@Component({
  selector: 'app-editor-manager',
  templateUrl: './editor-manager.component.html',
  styleUrls: ['./editor-manager.component.css'],
})
export class EditorManagerComponent implements OnInit, OnDestroy {
  @ViewChild(EditorDirective, { static: true }) editorHost!: EditorDirective;
  @ViewChild(TabDirective, { static: true }) tabHost!: TabDirective;
  counter: number;
  constructor() {
    this.counter = 0;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
  onCompile() {}

  ngAfterViewInit() {}

  addBlankEditor() {
    let name = `prueba${this.counter}`;
    let target = '#' + name;
    this.counter++;

    const tabItem = new TabItem(TabHeaderComponent, target, name);
    const tabViewContainerRef = this.tabHost.viewContainerRef;
    const editorItem = new EditorItem(TextEditorComponent, target);
    const viewContainerRef = this.editorHost.viewContainerRef;
    //viewContainerRef.clear();
    const componentRefTab = tabViewContainerRef.createComponent<TabComponent>(
      tabItem.component
    );
    componentRefTab.instance.target = tabItem.target;     
    componentRefTab.instance.name = tabItem.name;
    const componentRef = viewContainerRef.createComponent<EditorComponent>(
      editorItem.component
    );
    componentRef.instance.id = editorItem.id;
  }

  closeActualEditor() {
    const viewContainerRef = this.editorHost.viewContainerRef;
    viewContainerRef.clear();
  }
}
