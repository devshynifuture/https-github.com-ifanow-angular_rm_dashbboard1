import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { LoginService } from '../login.service';
import { interval } from 'rxjs';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-support-login',
  templateUrl: './support-login.component.html',
  styleUrls: ['./support-login.component.scss'],
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
export class SupportLoginComponent implements OnInit {

  barButtonOptions1: MatProgressButtonOptions = {
    active: false,
    text: 'Login to Support Account',
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
  resendOtpFlag: any;

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

  private createForm() {
    this.loginForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
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
        emailId: this.loginForm.controls.name.value,
        password: this.loginForm.controls.password.value,
      };
      this.isLoading = true;
      // TODO comment for old login
      // this.peopleService.loginWithPassword(loginData).subscribe(data => {
      //   console.log('data: ', data);
      //   if (data) {
      //     if (data.forceResetPassword) {
      //       data['buttonFlag'] = "reset";
      //       this.router.navigate(['/login/setpassword'],
      //         { state: { userData: data } });
      //     }
      //     else {
      //       this.loginService.handleUserData(this.authService, this.router, data);
      //     }
      //     // this.authService.setToken(data.token);
      //   } else {
      //     this.passEvent = '';
      //     this.errorMsg = true;
      //     this.errorStyle = {
      //       visibility: this.errorMsg ? 'visible' : 'hidden',
      //       opacity: this.errorMsg ? '1' : '0',
      //     };
      //     this.barButtonOptions1.active = false;
      //   }
      // }, err => {
      //   this.isLoading = false;
      //   this.barButtonOptions1.active = false;
      //   console.log('error on login: ', err.message);
      //   this.eventService.openSnackBar(err, 'Dismiss');
      // });

      this.backOfficeService.loginApi(loginData)
        // .subscribe(res => {
        //   console.log("this is some login data:::", res);
        // })
        .subscribe(
          data => {
            if (data) {
              console.log('rm data: ', data);
              if (data.isAdmin) {
                data.rmId = data.id
                delete data.id;
              }
              // this.authService.setToken(data.token);
              this.loginService.handleUserData(this.authService, this.router, data);
              // this.router.navigate(['support', 'dashboard']);

            } else {
              this.passEvent = '';
              this.errorMsg = true;
              this.errorStyle = {
                visibility: this.errorMsg ? 'visible' : 'hidden',
                opacity: this.errorMsg ? '1' : '0',
              };
              this.barButtonOptions1.active = false;
            }
          },
          err => {
            this.isLoading = false;
            this.barButtonOptions1.active = false;
            console.log('error on login: ', err);
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
    }
  }

  progressButtonClick(event) {
    console.log(this.loginForm.value, 'this.loginForm.value.name');
    if (this.loginForm.value.name != '' && this.loginForm.value.password != '') {
      this.errorMsg = false;
      this.errorStyle = {
        visibility: this.errorMsg ? 'visible' : 'hidden',
        opacity: this.errorMsg ? '1' : '0',
      };
      this.barButtonOptions1.active = true;
      this.barButtonOptions1.value = 20;
      this.onSubmit();
    } else {
      this.loginForm.get('name').markAsTouched();
      this.loginForm.get('password').markAsTouched();
      this.barButtonOptions1.active = false;
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

