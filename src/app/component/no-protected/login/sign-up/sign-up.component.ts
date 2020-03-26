import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router) { }
  signUpForm;
  validatorType = ValidatorType;

  ngOnInit() {
    this.signUpForm = this.fb.group({
      fullName: [, [Validators.required]],
      email: [, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      mobile: [, [Validators.required]],
      termsAgreement: [, [Validators.required]]
    })
  }
  createAccount() {
    if (this.signUpForm.invalid) {
      console.log("Error");
      this.signUpForm.markAllAsTouched();
    }
    else {
      let obj =
      {
        mobileNo: this.signUpForm.get('mobile').value,
        emailId: this.signUpForm.get('email').value,
        flag: true
      }
      this.router.navigate(['/login/forgotpassword'], { state: obj });
    }
  }
}
