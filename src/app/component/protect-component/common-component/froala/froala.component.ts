import { Component, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-froala',
  templateUrl: './froala.component.html',
  styleUrls: ['./froala.component.scss']
})
export class FroalaComponent implements ControlValueAccessor {
  data: any;
  plainText: any;

  constructor() {

  }

  // End ControlValueAccesor methods.
  _model;

  @Input() set model(model) {
    this._model = model;
  };

  get model() {
    return this._model;
  }

  @Output() modelChange = new EventEmitter();

  config: Object = {
    charCounterCount: false
  };

  // Begin ControlValueAccesor methods.
  onChange = (data) => {
    // console.log(data)
    // this.plainText = data.replace(/<[^>]*>/g, '');
    this.save(data);
  };
  onTouched = () => {
  };

  // Form model content changed.
  writeValue(content: any): void {
    this.model = content;
    this.modelChange.emit(this.model);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  save(data) {
    console.log('this is froala data ->>>>>');
    console.log(data);
    this.modelChange.emit(data);
  }

  // saveData(data) {
  //   // console.log(data);
  //   this.modelChange.emit(data);
  // }
}
