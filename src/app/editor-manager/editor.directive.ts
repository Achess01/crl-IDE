import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[editorHost]',
})

export class EditorDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}