import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from '../../services/util.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  // numValidator = ValidatorType.NUMBER_ONLY;
  // personNameValidator = ValidatorType.PERSON_NAME;
  validatorType = ValidatorType;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
  }
  inputString;
  // numKeyValidator = ValidatorType.NUMBER_KEY_ONLY;
  ngOnInit() {
    console.log("Document preview", window.history.state)
    this.inputString = this.sanitizer.bypassSecurityTrustHtml(window.history.state.docText);
    console.log(this.inputString)
    this.testForm = this.fb.group({
      id: [],
      email: [, [Validators.required]],
      inputName: [, [Validators.required]],
      inputNumber: [, [Validators.required, Validators.pattern(ValidatorType.NUMBER_ONLY)]],
    });

  }

  getErrorMessage() {
    return 'This is invalid input';
    /*return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';*/
  }
}
