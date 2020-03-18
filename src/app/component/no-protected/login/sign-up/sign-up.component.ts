import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  signUpForm;
  validatorType = ValidatorType;

  ngOnInit() {
    this.signUpForm = this.fb.group({
      fullName: [, [Validators.required]],
      email: [, [Validators.required]],
      mobile: [, [Validators.required]],
      termsAgreement: [, [Validators.required]]
    })
  }
  createAccount() {
    if (this.signUpForm.invalid) {
      console.log("Error");
      this.signUpForm.markAllAsTouched();
    }
  }
}
