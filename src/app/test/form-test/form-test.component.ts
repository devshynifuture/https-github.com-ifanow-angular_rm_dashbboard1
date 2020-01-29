import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from '../../services/util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from 'src/app/Data-service/event.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-test',
  templateUrl: './form-test.component.html',
  styleUrls: ['./form-test.component.scss']
})
export class FormTestComponent implements OnInit, OnDestroy {

  // email = new FormControl('', [Validators.required, Validators.email]);
  // inputName = new FormControl('', [Validators.required, Validators.email]);
  // inputNumber = new FormControl('', [Validators.required, Validators.email]);
  testForm;
  // numValidator = ValidatorType.NUMBER_ONLY;
  // personNameValidator = ValidatorType.PERSON_NAME;
  validatorType = ValidatorType;

  constructor(private eventService: EventService, private fb: FormBuilder, private sanitizer: DomSanitizer) {
  }
  inputString;
  // numKeyValidator = ValidatorType.NUMBER_KEY_ONLY;
  ngOnInit() {
    console.log("Document preview", window.history.state)
    // this.inputString = this.sanitizer.bypassSecurityTrustHtml(window.history.state.docText);
    // (this.inputString.changingThisBreaksApplicationSecurity) ? this.inputString : this.inputString = { changingThisBreaksApplicationSecurity: "Go Back To documents to view Pdf" };
    this.inputString = localStorage.getItem('docText')
    console.log(this.inputString)
    this.testForm = this.fb.group({
      id: [],
      email: [, [Validators.required]],
      inputName: [, [Validators.required]],
      inputNumber: [, [Validators.required, Validators.pattern(ValidatorType.NUMBER_ONLY)]],
    });
  }
  ngOnDestroy() {
    localStorage.removeItem('docText')
  }

  getErrorMessage() {
    return 'This is invalid input';
    /*return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';*/
  }
}
