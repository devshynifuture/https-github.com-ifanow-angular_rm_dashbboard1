import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  clientSignUp = false;
  duplicateTableDtaFlag: boolean;

  constructor(private fb: FormBuilder, private authService: AuthService, public routerActive: ActivatedRoute,
    private router: Router, private loginService: LoginService, private eventService: EventService, public dialog: MatDialog) {
  }

  signUpForm;
  validatorType = ValidatorType;

  ngOnInit() {
    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('advisorId')) {
        // this.clientSignUp = true;
      }
    });
    this.signUpForm = this.fb.group({
      fullName: [, [Validators.required]],
      email: [, [Validators.required,
      Validators.pattern(this.validatorType.EMAIL)]],
      mobile: [, [Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)]],
      termsAgreement: [, [Validators.required]]
    });
  }

  createAccount() {
    if (this.signUpForm.invalid) {
      console.log('Error');
      this.signUpForm.markAllAsTouched();
    } else {
      const obj = {
        emailList: [
          {
            userType: 1,
            email: this.signUpForm.get('email').value
          }
        ],
        name: this.signUpForm.get('fullName').value,
        displayName: this.signUpForm.get('fullName').value,
        mobileList: [
          {
            userType: 1,
            mobileNo: this.signUpForm.get('mobile').value,
          }
        ],
        userType: 1,
        forceRegistration: (this.duplicateTableDtaFlag == true) ? true : null
      };
      this.loginService.register(obj, this.clientSignUp).subscribe(
        data => {
          console.log(data);
          if (data == 400) {
            this.confirmModal(null);
            return;
          }
          const forgotPassObjData = {
            mobileNo: this.signUpForm.get('mobile').value,
            email: this.signUpForm.get('email').value,
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
          } else {
            this.router.navigate(['/login/forgotpassword'], { state: forgotPassObjData });
          }
        },
        err => {
          this.confirmModal(err.message)
        }
      );
    }
  }
  confirmModal(errorMsg) {
    const dialogData = {
      header: 'REGISTER',
      body: errorMsg + '. How would you like to proceed?',
      body2: 'This cannot be undone.',
      btnYes: 'LOGIN',
      btnNo: 'REGISTER',
      positiveMethod: () => {
        this.duplicateTableDtaFlag = true;
        this.createAccount();
        dialogRef.close();
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
        this.router.navigate(['login'])
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
