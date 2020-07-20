import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-custom-form-input',
  templateUrl: './custom-form-input.component.html',
  styleUrls: ['./custom-form-input.component.scss']
})
export class CustomFormInputComponent implements OnInit {

  @Input() inputValue;
  @Output() inputModelChange = new EventEmitter<object>();

  constructor(private fb: FormBuilder) { }
  ngOnInit() {
  }
}
