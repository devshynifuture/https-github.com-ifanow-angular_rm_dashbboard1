import { Component, OnInit } from '@angular/core';
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
export class FormTestComponent implements OnInit {

  // email = new FormControl('', [Validators.required, Validators.email]);
  // inputName = new FormControl('', [Validators.required, Validators.email]);
  // inputNumber = new FormControl('', [Validators.required, Validators.email]);
  testForm;
  // numValidator = ValidatorType.NUMBER_ONLY;
  // personNameValidator = ValidatorType.PERSON_NAME;
  validatorType = ValidatorType;

  constructor(private eventService: EventService, private fb: FormBuilder, private sanitizer: DomSanitizer, private http: HttpClient) {
  }
  inputString;
  // numKeyValidator = ValidatorType.NUMBER_KEY_ONLY;
  ngOnInit() {
    console.log("Document preview", window.history.state)
    this.inputString = this.sanitizer.bypassSecurityTrustHtml(window.history.state.docText);
    (this.inputString.changingThisBreaksApplicationSecurity) ? this.inputString : this.inputString = { changingThisBreaksApplicationSecurity: "Go Back To documents to view Pdf" };
    let obj =
    {
      "htmlInput": this.inputString.changingThisBreaksApplicationSecurity,
      "name": "pdfTest"
    }
    this.http.post('http://dev.ifanow.in:8080/futurewise/api/v1/web//subscription/html-to-pdf', obj, { responseType: 'blob' }).subscribe(
      data => {
        var file = new Blob([data], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    )

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
