import { TemplateLiteralElement } from '@angular/compiler';
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
  editors: EditorComponent[] = [];
  tabs: TabComponent[] = [];

  counter: number;
  constructor() {
    this.counter = 97;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
  onCompile() {}

  ngAfterViewInit() {}

  addBlankEditor() {

    let name = `prueba${String.fromCharCode(this.counter)}`;
    let nameTab = `${name}-tab`;
    let target = '#' + name;
    this.counter++;

    console.log(name, nameTab, target)

    const tabItem = new TabItem(TabHeaderComponent, {
      name: nameTab,
      target: target,
      pane: name,
      isActive: true,
    });
    const tabViewContainerRef = this.tabHost.viewContainerRef;
    const editorItem = new EditorItem(TextEditorComponent, {
      id: name,
      label: nameTab,
      isActive: true,
      isShown: true      
    });
    const viewContainerRef = this.editorHost.viewContainerRef;
    //viewContainerRef.clear();
    const componentRefTab = tabViewContainerRef.createComponent<TabComponent>(
      tabItem.component
    );
    componentRefTab.instance.data = tabItem.data;
    /* this.tabs.forEach((instance) => {
      instance.data.isActive = false;
    });

    this.tabs.push(componentRefTab.instance); */

    const componentRef = viewContainerRef.createComponent<EditorComponent>(
      editorItem.component
    );
    componentRef.instance.data = editorItem.data;

    /* this.editors.forEach((instance) => {
      instance.data.isActive = false;
      instance.data.isShown = false;
    });
    
    this.editors.push(componentRef.instance); */
  }

  closeActualEditor() {
    const viewContainerRef = this.editorHost.viewContainerRef;
    const tabViewContainerRef = this.tabHost.viewContainerRef;
    tabViewContainerRef.clear();
    viewContainerRef.clear();
  }
}
