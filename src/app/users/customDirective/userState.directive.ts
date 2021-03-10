import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { userState } from '../model/user-state';

@Directive({
  selector: '[ccUserState]',
})
export class UserStateDirective implements OnInit, OnChanges {
  @Input('state') state: userState;
  private previousClass: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'original');
    this.previousClass = 'original';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      console.log('input changed', changes.state.currentValue);

      let classStyle;
      switch (changes.state.currentValue) {
        case userState.MODIFIED: {
          classStyle = 'modified';
          break;
        }
        case userState.ORIGINAL: {
          classStyle = 'original';
          break;
        }
        case userState.UPDATED: {
          classStyle = 'updated';
          break;
        }
        case userState.VIEWING: {
          classStyle = 'viewing';
          break;
        }
        default: {
          classStyle = null;
          break;
        }
      }
      if (classStyle === this.previousClass) {
        return;
      } else {
        if (this.previousClass !== null) {
          this.renderer.removeClass(this.el.nativeElement, this.previousClass);
        }
        if (classStyle !== null) {
          this.renderer.addClass(this.el.nativeElement, classStyle);
        }
        this.previousClass = classStyle;
      }
    }
  }
}
