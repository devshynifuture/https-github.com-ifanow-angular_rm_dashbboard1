import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(private fb: FormBuilder, private authService: AuthService, public routerActive: ActivatedRoute, private router: Router, private loginService: LoginService, private eventService: EventService) {
  }
  clientSignUp: boolean = false;
  signUpForm;
  validatorType = ValidatorType;

  ngOnInit() {
    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has("advisorId")) {
        this.clientSignUp = true;
      }
    });
    this.signUpForm = this.fb.group({
      fullName: [, [Validators.required]],
      email: [, [Validators.required,
      Validators.pattern('^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$')]],
      mobile: [, [Validators.required]],
      termsAgreement: [, [Validators.required]]
    });
  }

  createAccount() {
    if (this.signUpForm.invalid) {
      console.log('Error');
      this.signUpForm.markAllAsTouched();
    } else {
      const obj = {
        advisorId: 0,
        taxStatusId: 0,
        emailList: [
          {
            verificationStatus: 0,
            id: 0,
            userType: 1,
            isActive: 1,
            userId: 0,
            email: this.signUpForm.get('email').value
          }
        ],
        displayName: null,
        bio: null,
        martialStatusId: 0,
        password: null,
        clientType: 0,
        occupationId: 0,
        id: null,
        pan: null,
        clientId: null,
        kycComplaint: 0,
        roleId: 0,
        genderId: 0,
        companyStatus: 0,
        dateOfBirth: null,
        userName: null,
        userId: null,
        mobileList: [
          {
            verificationStatus: 0,
            id: 0,
            userType: 1,
            mobileNo: this.signUpForm.get('mobile').value,
            isActive: 1,
            userId: 0
          }
        ],
        aadhaarNumber: null,
        referredBy: 0,
        name: this.signUpForm.get('fullName').value,
        bioRemarkId: 0,
        userType: 2,
        remarks: null,
        status: 0
      };
      this.loginService.register(obj, this.clientSignUp).subscribe(
        data => {
          console.log(data);
          const forgotPassObjData = {
            mobileNo: this.signUpForm.get('mobile').value,
            emailId: this.signUpForm.get('email').value,
            flag: true,
            userType: data.userType,
            userId: data.userId,
            userData: data
          };
          if (this.clientSignUp) {
            const jsonData = {
              advisorId: 2808,
              clientId: 2978,
              emailId: 'gaurav@futurewise.co.in',
              authToken: 'data',
              imgUrl: 'https://res.cloudinary.com/futurewise/image/upload/v1566029063/icons_fakfxf.png'
            };

            this.authService.setToken('data');

            this.authService.setUserInfo(jsonData);
            this.authService.setClientData({
              id: 2978, name: 'Aryendra Kumar Saxena'
            });
            this.router.navigate(['customer', 'detail', 'overview', 'myfeed']);
          }
          else {
            this.router.navigate(['/login/forgotpassword'], { state: forgotPassObjData });
          }
        },
        err => this.eventService.openSnackBar(err, 'Dismiss')
      );
    }
  }
}
