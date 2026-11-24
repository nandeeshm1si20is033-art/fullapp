import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

/** Focuses and selects an input as soon as it appears (used when editing a task). */
@Directive({ selector: '[appAutofocus]', standalone: true })
export class AutofocusDirective implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  ngAfterViewInit(): void {
    this.el.nativeElement.focus();
    this.el.nativeElement.select();
  }
}
