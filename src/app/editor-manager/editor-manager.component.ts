import {
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
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
  editors: ComponentRef<EditorComponent>[] = [];
  tabs: ComponentRef<TabComponent>[] = [];
  names: string[] = [];
  fileToUpload: any = null;
  actualCode:any = null;
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
  onCompile() {}

  ngAfterViewInit() {}

  addBlankEditor(name: string, content: string = '!!! Inicio del archivo') {
    let nameTab = `${name}-tab`;
    let target = '#' + name;

    this.names.push(name);

    const editorItem = new EditorItem(TextEditorComponent, {
      id: name,
      label: nameTab,
      initialContent: content,
    });
    const viewContainerRef = this.editorHost.viewContainerRef;

    const componentRef = viewContainerRef.createComponent<EditorComponent>(
      editorItem.component
    );
    componentRef.instance.data = editorItem.data;
    let element = componentRef.location.nativeElement;

    element.setAttribute('aria-labelledby', editorItem.data.label);
    element.id = editorItem.data.id;
    const tabViewContainerRef = this.tabHost.viewContainerRef;
    const tabItem = new TabItem(TabHeaderComponent, {
      name: nameTab,
      target: target,
      pane: name,
    });

    const componentRefTab = tabViewContainerRef.createComponent<TabComponent>(
      tabItem.component
    );
    componentRefTab.instance.data = tabItem.data;

    this.tabs.push(componentRefTab);
    this.editors.push(componentRef);
  }

  closeActualEditor() {
    let index = this.editors.findIndex((editorRef) => {
      return editorRef.location.nativeElement.classList.contains('active');
    });

    if (index !== -1 && confirm('¿Cerrar la pestaña?')) {
      this.names.splice(index, 1);
      let editor = this.editors.splice(index, 1);
      let tab = this.tabs.splice(index, 1);
      const viewContainerRef = this.editorHost.viewContainerRef;
      let editI = viewContainerRef.indexOf(editor[0].hostView);
      const viewContainerRefTab = this.tabHost.viewContainerRef;
      let tabI = viewContainerRefTab.indexOf(tab[0].hostView);

      viewContainerRef.remove(editI);
      viewContainerRefTab.remove(tabI);
    }
  }

  getName() {
    let name = prompt('Nombre del archivo');
    name = (name as string).replace(' ', '');
    let regex = /^[a-zA-z](\d|[a-zA-z])*$/;
    if (name.match(regex) && !this.isRepeatedName(name)) {
      this.addBlankEditor(name);
    } else {
      alert('Nombre inválido');
    }
  }

  isRepeatedName(searchedName: string): boolean {
    return this.names.findIndex((name) => name === searchedName) !== -1;
  }

  uploadFile(event: any) {
    if (event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0] as File;
    }
  }

  readFile() {
    if (this.fileToUpload) {
      let file = this.fileToUpload;
      let name = file.name.replace('.crl', '');
      if (!this.isRepeatedName(name)) {        
        let reader = new FileReader();

        reader.addEventListener(
          'load',
          () => {
            this.actualCode = reader.result;            
          },
          false
        );

        reader.onerror = function (evt) {};
        reader.readAsText(file, 'UTF-8');
        
        if (this.actualCode){
          this.addBlankEditor(name, this.actualCode);
          this.actualCode = null;
        } 
      } else {
        alert('Nombre repetido');
      }
    } else {
      alert('Error al leer el archivo');
    }
  }
}
