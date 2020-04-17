import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { BackOfficeService } from '../../protect-component/AdviserComponent/backOffice/back-office.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatProgressButtonOptions } from '../../../common/progress-button/progress-button.component';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { LoginService } from './login.service';
import { PeopleService } from '../../protect-component/PeopleComponent/people.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // templateUrl: './login-mobile.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('btnProgress', [
      state('state1', style({
        width: '0%',
        backgroundColor: 'green',
        display: 'block'
      })),
      state('state2', style({
        width: '100%',
        backgroundColor: 'green',
        display: 'block',
        transition: '0.3s'
      })),
      transition('state1 => state2', animate('2000s')),
      transition('state2 =>state1', animate('0s'))
    ])
  ]
})
export class LoginComponent implements OnInit {

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Login to your account',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  getOtpBtnOption: MatProgressButtonOptions = {
    active: false,
    text: '****  GET OTP',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  otpNumber = false;
  validatorType = ValidatorType;
  hide = true;
  errorRequired = false;
  errorMsg = false;
  passEvent: any;
  errorStyle = {};
  userName;
  userData;
  getOtpFlag = false;
  otpData = [];
  otpResponse: any;
  verifyResponseData =
    {
      email: '',
      mobileNo: ''
    };
  verifyFlag: string;

  @ViewChild('animationSpan', {
    read: ElementRef,
    static: true
  }) animationSpan: ElementRef;
  btnProgressData: any;

  // @HostListener('click', ['$event.target'])
  // onclick() {
  //   console.log("animate")
  // }
  loginForm: FormGroup;

  isLoading = false;
  showTimeRemaing: number;

  constructor(
    private formBuilder: FormBuilder, private eventService: EventService,
    public backOfficeService: BackOfficeService,
    public router: Router,
    private authService: AuthService, private eleRef: ElementRef, private loginService: LoginService,
    private peopleService: PeopleService) {
  }

  ngOnInit() {
    this.userName = new FormControl('', [Validators.required]);
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['admin', 'subscription', 'dashboard']);
    // } else {
    this.createForm();
    // }
    this.btnProgressData = 'state1';
  }

  getOtp() {
    if (this.userName.invalid) {
      this.userName.markAsTouched();
      return;
    } else {
      this.showTimeRemaing = 30;
      this.otpResendCountDown();
      this.getOtpBtnOption.active = true;
      const obj = {
        userName: this.userName.value
      };
      this.loginService.getUsernameData(obj).subscribe(
        data => {
          if (data) {
            this.userName.disable();
            console.log(data);
            this.userData = data;
            this.getOtpResponse(data);
            this.getOtpFlag = true;
            this.getOtpBtnOption.active = false;
          } else {
            this.getOtpBtnOption.active = false;
            this.eventService.openSnackBar('error found', 'Dismiss');
          }
        },
        err => {
          this.getOtpBtnOption.active = false;
          this.eventService.openSnackBar(err, 'Dismiss')
        }
      );
    }
  }

  getOtpOnEnter(event) {
    (event.keyCode == 13) ? this.getOtp() : '';
  }

  getOtpData(outputData) {
    console.log('login with otp', outputData);
    this.otpData = outputData;
  }

  getOtpResponse(data) {
    if (data.emailList && data.emailList.length > 0) {
      data.email = data.emailList[0].email;
      this.verifyResponseData.email = UtilService.obfuscateEmail(data.email);
    }
    if (data.mobileList && data.mobileList.length > 0) {
      data.mobileNo = data.mobileList[0].mobileNo;
      this.verifyResponseData.mobileNo = UtilService.obfuscateMobile(String(data.mobileNo));
    }
    console.log(this.verifyResponseData);
    if (this.verifyResponseData.mobileNo) {
      this.verifyFlag = 'Mobile';
      const obj = { mobileNo: data.mobileNo };
      this.loginUsingCredential(obj);
    } else {
      this.verifyFlag = 'Email';
      const obj = { email: data.email };
      this.loginUsingCredential(obj);
    }
  }

  loginUsingCredential(obj) {
    this.loginService.generateOtp(obj).subscribe(
      data => {
        console.log(data);
        this.otpResponse = data;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  otpClick() {
    (this.otpNumber) ? this.otpNumber = false : this.otpNumber = true;
  }

  verifyWithOtpResponse() {
    this.barButtonOptions.active = true;
    const otpString = this.otpData.toString().replace(/,/g, '');
    console.log('LoginComponent verifyWithOtpResponse data; ', this.userData);
    console.log('LoginComponent verifyWithOtpResponse otpData; ', this.otpData);
    console.log('LoginComponent verifyWithOtpResponse verifyFlag; ', this.verifyFlag);

    console.log('LoginComponent verifyWithOtpResponse otpString; ', otpString);
    console.log('LoginComponent verifyWithOtpResponse verifyResponseData; ', this.verifyResponseData);
    console.log('LoginComponent verifyWithOtpResponse this.otpResponse; ', this.otpResponse);


    if (this.userData) {

      if (this.verifyFlag == 'Email' && this.otpData.length == 4 && this.otpResponse == otpString) {
        const obj = {
          email: this.userData.email,
          userId: (this.userData.clientId) ? (this.userData.clientId > 0) ?
            this.userData.clientId : this.userData.advisorId : this.userData.advisorId,
          userType: this.userData.userType
        };
        this.saveAfterVerifyCredential(obj);

        this.eventService.openSnackBar('Otp matches sucessfully', 'Dismiss');
        this.loginService.handleUserData(this.authService, this.router, this.userData);
      } else if (this.verifyFlag == 'Mobile' && this.otpData.length == 4) {
        const obj = {
          mobileNo: this.userData.mobileNo,
          userId: (this.userData.clientId) ? (this.userData.clientId > 0) ?
            this.userData.clientId : this.userData.advisorId : this.userData.advisorId,
          userType: this.userData.userType,
          otp: otpString
        };
        this.loginService.saveAfterVerification(obj).subscribe(
          data => {
            if (data) {
              this.eventService.openSnackBar('Otp matches sucessfully', 'Dismiss');
              this.loginService.handleUserData(this.authService, this.router, this.userData);
            } else {
              this.barButtonOptions.active = false;
            }
          },
          err => {
            console.error(err);
            this.eventService.openSnackBar(err, 'Dismiss');
            this.barButtonOptions.active = false;
          }
        );
      } else {
        this.eventService.openSnackBar('Wrong OTP');
        this.barButtonOptions.active = false;
      }
    } else {
      this.barButtonOptions.active = false;
    }
  }
  otpResendCountDown() {
    let timeLeft = 30;
    let intervallTimer = interval(1000).subscribe(
      data => {
        if (data == 31) {
          intervallTimer.unsubscribe();
        } else {
          this.showTimeRemaing = timeLeft--;
        }
      }
    )
  }
  private createForm() {
    this.loginForm = this.formBuilder.group({
      name: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(55)],
        updateOn: 'change'
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(55)],
        updateOn: 'change'
      }),
    });
  }

  getError() {
    return ' *This is required field';
  }

  cancel(): void {
    this.loginForm.reset();
  }

  enterEvent(event) {
    this.errorMsg = false;
    this.errorStyle = {
      visibility: this.errorMsg ? 'visible' : 'hidden',
      opacity: this.errorMsg ? '1' : '0',
    };
    if (event.keyCode === 13) {
      this.passEvent = event.keyCode;
    }
  }

  onSubmit() {

    if (this.loginForm.valid) {
      const loginData = {
        userName: this.loginForm.controls.name.value,
        password: this.loginForm.controls.password.value,
        roleId: 1
      };
      this.isLoading = true;
      // TODO comment for old login
      this.peopleService.loginWithPassword(loginData).subscribe(data => {
        console.log('data: ', data);
        if (data) {
          if (data.forceResetPassword) {
            data['buttonFlag'] = "reset";
            this.router.navigate(['/login/setpassword'],
              { state: { userData: data } });
          }
          else {
            this.loginService.handleUserData(this.authService, this.router, data);
          }
          // this.authService.setToken(data.token);
        } else {
          this.passEvent = '';
          this.errorMsg = true;
          this.errorStyle = {
            visibility: this.errorMsg ? 'visible' : 'hidden',
            opacity: this.errorMsg ? '1' : '0',
          };
          this.barButtonOptions.active = false;
        }
      }, err => {
        this.isLoading = false;
        this.barButtonOptions.active = false;
        console.log('error on login: ', err.message);
        this.eventService.openSnackBar(err, 'Dismiss');
      });
      // this.backOfficeService.loginApi(loginData).subscribe(
      //   data => {
      //
      //     if (data) {
      //       console.log('data: ', data);
      //       this.authService.setToken(data.token);
      //       if (!data.advisorId) {
      //         data.advisorId = data.adminAdvisorId;
      //       }
      //       this.authService.setUserInfo(data);
      //       this.router.navigate(['admin', 'subscription', 'dashboard']);
      //       this.authService.setClientData({
      //         id: 2978, name: 'Aryendra Kumar Saxena'
      //       });
      //
      //     } else {
      //       this.passEvent = '';
      //       this.errorMsg = true;
      //       this.errorStyle = {
      //         visibility: this.errorMsg ? 'visible' : 'hidden',
      //         opacity: this.errorMsg ? '1' : '0',
      //       };
      //       this.barButtonOptions.active = false;
      //     }
      //   },
      //   err => {
      //     this.isLoading = false;
      //     this.barButtonOptions.active = false;
      //     console.log('error on login: ', err);
      //     this.eventService.openSnackBar(err, 'Dismiss');
      //   }
      // );
    }
  }

  onEnterPressed() {
    console.log(' on enter pressed sdkvjasbhkdj');
  }

  hardCodeLoginForTest() {
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
    // this.authService.setToken(loginData.payLoad);
    this.eventService.openSnackBar('Login successFully', 'Dismiss');
    this.router.navigate(['admin', 'subscription', 'dashboard']);
  }

  progressButtonClick(event) {
    console.log(this.loginForm.value, 'this.loginForm.value.name');
    if (this.loginForm.value.name != '' && this.loginForm.value.password != '') {
      this.errorMsg = false;
      this.errorStyle = {
        visibility: this.errorMsg ? 'visible' : 'hidden',
        opacity: this.errorMsg ? '1' : '0',
      };
      this.barButtonOptions.active = true;
      this.barButtonOptions.value = 20;
      this.onSubmit();
    } else {
      this.loginForm.get('name').markAsTouched();
      this.loginForm.get('password').markAsTouched();
      this.barButtonOptions.active = false;
    }
  }

  saveAfterVerifyCredential(obj) {    ////// save verified email or mobileNo in the table
    this.loginService.saveAfterVerification(obj).subscribe(
      data => {
        console.log(data);
        (this.verifyFlag == 'Email') ? this.verifyFlag = 'Mobile' : '';
      },
      err => {
        // this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
}

