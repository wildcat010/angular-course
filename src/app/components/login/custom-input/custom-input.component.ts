import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: 'custom-input.component.html',
  styleUrls: ['custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomInputComponent),
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() Type = 'text';
  @Input() Placeholder = '';
  value: string;

  onChange: (any) => {};
  onTouched: any = () => {};

  constructor() {}

  writeValue(value: string): void {
    this.value = value ? value : '';
  }

  clearInput(): void {
    this.value = '';
    this.onChange('');
  }

  onInputChange($event): void {
    this.value = $event.target.value;
    this.onChange($event.target.value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}
}
