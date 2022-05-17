import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[resultHost]',
})

export class ResultDirective{
  constructor(public viewContainerRef: ViewContainerRef) { }
}