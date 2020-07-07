import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-froala',
  templateUrl: './froala.component.html',
  styleUrls: ['./froala.component.scss']
})
export class FroalaComponent implements ControlValueAccessor, OnInit {
  data: any;
  plainText: any;

  constructor() {

  }

  // End ControlValueAccesor methods.
  _model;

  config: Object = {
    key: 'XAG4eH3A3B10B8D6C5C-11VKOJ1FGULVKHXDXNDXc1d1Kg1SNdD5B4A4B3H3I3F3B7A4C3==',
    attribution: false,
    charCounterCount: false,
    toolbarButtons: ['getPDF'],
    toolbarInline: true,

  };

  get model() {
    return this._model;
  }

  @Output() modelChange = new EventEmitter();

  @Input() set model(model) {
    this._model = model;
  }

  @Input() readonly: boolean = false;

  ngOnInit(): void {
    // var editor = new FroalaEditor('#example')

    // const froalaComponent = new FroalaEditor('div#froala-editor', {
    //   toolbarButtons: ['getPDF']
    // });
    this.config = {
      events: {
        'froalaEditor.initialized': function (e, editor) {
          if (this.readonly) {
            editor.edit.off();
          }
        }
      }
    }
  }

  // Begin ControlValueAccesor methods.
  onChange = (data) => {
    // this.plainText = data.replace(/<[^>]*>/g, '');
    this.save(data);
  }
  onTouched = () => {
  }

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
    this.modelChange.emit(data);
  }

  // saveData(data) {
  //   this.modelChange.emit(data);
  // }
}
