import {
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
  Sanitizer,
  ViewChild,
} from '@angular/core';
import { TabHeaderComponent } from '../tab-header/tab-header.component';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { EditorItem } from './editor-item';
import { EditorComponent, TabComponent } from './editor.component';
import { EditorDirective } from './editor.directive';
import { TabItem } from './tab-item';
import { TabDirective } from './tab.directive';
import CRLFile from 'src/analyze/CRLFile';
import Analyzer from 'src/analyze/Analyzer';
import { GraphvizService } from '../service/graphviz.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  actualCode: any = null;
  src: any;
  constructor(private service: GraphvizService, private sanitizer: DomSanitizer) {
    this.src = '';
  }

  ngOnInit(): void {}

  d3(dot:string) {
    this.service.getImage(dot).subscribe({
      next: (response: any) => {
        let url = URL.createObjectURL(response);        
        this.src = this.sanitizer.bypassSecurityTrustUrl(url);
        console.log(this.src);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  ngOnDestroy(): void {}

  ngAfterViewInit() {}

  onCompile() {
    let index = this.getActiveIndex();
    if (index !== -1) {
      let files: CRLFile[] = [];
      let main: CRLFile = new CRLFile(
        this.names[index],
        this.editors[index].instance.content
      );

      for (let i = 0; i < this.names.length; i++) {
        if (i !== index) {
          const name = this.names[i];
          const content = this.editors[i].instance.content;
          files.push(new CRLFile(name, content));
        }
      }

      let analyzer = new Analyzer(main, files);
      let dots = analyzer.run();
      this.d3(dots[0]);
    }
  }

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
    let index = this.getActiveIndex();

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
        const freader = () => {
          this.actualCode = reader.result as string;
        };
        reader.addEventListener('load', freader, false);

        reader.onerror = function (evt) {};
        reader.readAsText(file, 'UTF-8');
        if (this.actualCode) {
          reader.removeEventListener('load', freader);
          this.addBlankEditor(name, this.actualCode);
          this.actualCode = null;
          this.fileToUpload = null;
        }
      } else {
        alert('Nombre repetido');
      }
    } else {
      alert('Error al leer el archivo');
    }
  }

  download() {
    let index = this.getActiveIndex();
    if (index !== -1) {
      let editor = this.editors[index];
      let name = this.names[index] + '.crl';
      let file = new Blob([editor.instance.content], { type: 'text' });
      let a = document.createElement('a'),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  getActiveIndex() {
    let index = this.editors.findIndex((editorRef) => {
      return editorRef.location.nativeElement.classList.contains('active');
    });
    return index;
  }
}
