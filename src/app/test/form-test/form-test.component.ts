import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-test',
  templateUrl: './form-test.component.html',
  styleUrls: ['./form-test.component.scss']
})
export class FormTestComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  inputName = new FormControl('', [Validators.required, Validators.email]);
  inputNumber = new FormControl('', [Validators.required, Validators.email]);

  constructor() {
  }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }
}
