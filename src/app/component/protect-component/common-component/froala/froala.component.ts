import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import 'froala-editor/js/froala_editor.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/fullscreen.min';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/quick_insert.min.js';
import 'froala-editor/js/plugins/url.min.js';
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
    // attribution: false,
    // charCounterCount: false,
    // toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', '|', 'paragraphStyle', 'paragraphFormat', 'align', 'undo', 'redo', 'html'],
    // toolbarInline: true,
    events: {
      'froalaEditor.initialized': function (e, editor) {
        if (this.readonly) {
          editor.edit.off();
        }
      }
    }
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
