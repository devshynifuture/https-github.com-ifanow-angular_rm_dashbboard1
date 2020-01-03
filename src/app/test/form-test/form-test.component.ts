import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ValidatorType} from "../../services/util.service";

@Component({
  selector: 'app-form-test',
  templateUrl: './form-test.component.html',
  styleUrls: ['./form-test.component.scss']
})
export class FormTestComponent implements OnInit {

  // email = new FormControl('', [Validators.required, Validators.email]);
  // inputName = new FormControl('', [Validators.required, Validators.email]);
  // inputNumber = new FormControl('', [Validators.required, Validators.email]);
  testForm;
  numValidator = ValidatorType.NUMBER_ONLY;

  constructor(private fb: FormBuilder) {
  }

  // numKeyValidator = ValidatorType.NUMBER_KEY_ONLY;
  ngOnInit() {
    this.testForm = this.fb.group({
      id: [],
      email: [, [Validators.required, Validators.email]],
      inputName: [, [Validators.required]],
      inputNumber: [, [Validators.required]],
    });

  }

  getErrorMessage() {
    return 'This is invalid input';
    /*return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';*/
  }
}
