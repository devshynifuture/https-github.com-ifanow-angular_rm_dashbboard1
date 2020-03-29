import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService, private eventSerivce: EventService) { }
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
      let obj = {
        "advisorId": 0,
        "taxStatusId": 0,
        "emailList": [
          {
            "verificationStatus": 0,
            "id": 0,
            "userType": 1,
            "isActive": 1,
            "userId": 0,
            "email": this.signUpForm.get('email').value
          }
        ],
        "displayName": null,
        "bio": null,
        "martialStatusId": 0,
        "password": null,
        "clientType": 0,
        "occupationId": 0,
        "id": null,
        "pan": null,
        "clientId": null,
        "kycComplaint": 0,
        "roleId": 0,
        "genderId": 0,
        "companyStatus": 0,
        "dateOfBirth": null,
        "userName": null,
        "userId": null,
        "mobileList": [
          {
            "verificationStatus": 0,
            "id": 0,
            "userType": 1,
            "mobileNo": this.signUpForm.get('mobile').value,
            "isActive": 1,
            "userId": 0
          }
        ],
        "aadhaarNumber": null,
        "referredBy": 0,
        "name": this.signUpForm.get('fullName').value,
        "bioRemarkId": 0,
        "userType": 2,
        "remarks": null,
        "status": 0
      }
      this.loginService.register(obj).subscribe(
        data => {
          console.log(data);
          let forgotPassObjData =
          {
            mobileNo: this.signUpForm.get('mobile').value,
            emailId: this.signUpForm.get('email').value,
            flag: true,
            userType: data.userType,
            userId: data.userId
          }
          this.router.navigate(['/login/forgotpassword'], { state: forgotPassObjData });
        },
        err => this.eventSerivce.openSnackBar(err, "Dismiss")
      )
    }
  }
}
