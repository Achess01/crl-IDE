import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[tabHost]',
})

export class TabDirective{
  constructor(public viewContainerRef: ViewContainerRef) { }
}