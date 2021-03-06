import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Router } from '@angular/router';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { setInterval } from 'timers';
import { interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  isVerify = false;
  verifyFlag;
  otp: any;
  validatorType = ValidatorType;
  otpData = [];
  userName;
  otpResponse: any;
  verifyData: any;
  saveVerifyData: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'VERIFY',
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
  userNameVerifyResponse: any;
  showTimeRemaing: number;
  @ViewChild('countDown', { static: true }) elemRef: ElementRef;
  resendOtpFlag: boolean = false;
  logoUrl: any;
  forgotPass: boolean;
  constructor(private loginService: LoginService, private eventService: EventService,
    private router: Router, private fb: FormBuilder, private peopleService: PeopleService) {
  }
  signUpBarList = [
    { name: "CREATE ACCOUNT", flag: true },
    { name: "VERIFY EMAIL", flag: false },
    { name: "VERIFY MOBILE", flag: false },
    { name: "SET PASSWORD", flag: false }
  ]
  ngOnInit() {
    this.getLogoUrl();
    this.verifyData = window.history.state;
    this.saveVerifyData = Object.assign({}, window.history.state);
    if (!this.saveVerifyData) {
      this.saveVerifyData = {};
    }
    if (this.verifyData.flag) {
      this.hideNumEmailFromUser(this.saveVerifyData);
      this.isVerify = true;
      this.verify('Email', false);
      this.verifyFlag = 'Email';
    } else {
      this.isVerify = false;
    }
    this.userName = new FormControl('', [Validators.required]);
  }

  getLogoUrl() {
    this.peopleService.getClientLogo({ hostName: document.location.hostname })
      .subscribe(res => {
        if (res) {
          localStorage.removeItem('token');
          console.log(res);
          this.logoUrl = res.logoUrl;
        } else {
          this.logoUrl = 'https://res.cloudinary.com/futurewise/image/upload/v1568097552/icons_fnvpa7.png';
        }
      }, err => {
        this.logoUrl = 'https://res.cloudinary.com/futurewise/image/upload/v1568097552/icons_fnvpa7.png';
        console.error(err);
      });
  }

  hideNumEmailFromUser(data) {
    const userData = data.userData;
    data.userId = userData.clientId ? userData.clientId : userData.advisorId;
    data.userType = userData.userType;
    if (userData.emailList && userData.emailList.length > 0) {
      userData.email = userData.emailList[0].email;
      data.email = userData.email;
      this.verifyData.email = UtilService.obfuscateEmail(data.email);
    }
    if (userData.mobileList && userData.mobileList.length > 0) {
      userData.mobileNo = userData.mobileList[0].mobileNo;
      data.mobileNo = userData.mobileNo;
      this.verifyData.mobileNo = UtilService.obfuscateMobile(String(data.mobileNo));
    }
  }

  // enterOtp(value) {
  //   if (value.code.substring(0, value.code.length - 1) == 'Key' || value.code == 'Backspace') {
  //     if (value.srcElement.previousElementSibling == undefined) {
  //       return;
  //     }
  //     value.srcElement.previousElementSibling.focus();
  //     this.otpData.pop();
  //   } else {
  //     if (value.srcElement.nextElementSibling == undefined) {
  //       this.otpData.push(parseInt(value.key));
  //       return;
  //     }
  //     this.otpData.push(parseInt(value.key));
  //     value.srcElement.nextElementSibling.focus();
  //   }
  // }
  verifyUsernameOnEnter(event) {
    (event.keyCode == 13) ? this.verifyUsername() : '';
  }

  verifyUsername() {
    if (this.userName.invalid) {
      this.userName.markAsTouched();
      return;
    }   //////////// username///////////////////
    this.barButtonOptions.active = true;
    const obj = {
      userName: this.userName.value
    };
    this.loginService.getUsernameData(obj).subscribe(
      data => {
        if (data) {
          this.barButtonOptions.active = false;
          data.buttonFlag = 'reset';
          this.saveVerifyData['advisorId'] = data.advisorId;
          this.saveVerifyData.userData = data;
          this.hideNumEmailFromUser(this.saveVerifyData);
          this.userNameVerifyResponse = data;
          // this.saveVerifyData.email = data.emailList[0].email;
          // this.saveVerifyData.mobileNo = data.mobileList[0].mobileNo;
          // this.saveVerifyData['userData'] = data
          if (!this.saveVerifyData.email && this.saveVerifyData.mobileNo && this.saveVerifyData.mobileNo == 0) {
            this.eventService.openSnackBar('Please contact your advisor for more details');
            return;
          }
          if (this.saveVerifyData.email && this.saveVerifyData.mobileNo && this.saveVerifyData.mobileNo != 0) {
            this.isVerify = true;
            this.forgotPass = true;
            this.verifyFlag = 'Email';
            // this.verify('Email', false);
            this.resendOtpFlag = false;
            this.otpResendCountDown();
            const obj1 = {
              email: this.saveVerifyData.email,
              userType: this.saveVerifyData.userType,
              otp: null,
              advisorId: this.saveVerifyData.advisorId,
              mobileNo: this.saveVerifyData.mobileNo
            }
            this.barButtonOptions.active = true;    //// verify email or mobileNo with credentials
            this.loginService.generateOtp(obj1).subscribe(
              data => {
                this.barButtonOptions.active = false;
                this.otpResponse = data;
                this.isVerify = true;
              },
              err => this.eventService.openSnackBar(err, 'Dismiss')
            );
            return;
          }
          if (this.saveVerifyData.email) {
            this.verifyFlag = 'Email';
            this.verify('Email', false);
          } else if (this.saveVerifyData.mobileNo != 0) {
            this.verifyFlag = 'Mobile';
            this.verify('Mobile', false);
          }
          // }
        }
        else {
          this.userName.setErrors({ incorrect: true });
        }
      }
      ,
      err => {
        this.barButtonOptions.active = false;
        if (err == "Username not found.") {
          this.userName.setErrors({ incorrect: true });
        }
        else {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      }
    );
  }

  verifyEmailAndMobilePassword() {
    this.isVerify = true;
    this.forgotPass = true;
    this.verifyFlag = 'Email';
    // this.verify('Email', false);
    this.resendOtpFlag = false;
    this.otpResendCountDown();
    const obj1 = {
      email: this.saveVerifyData.email,
      userType: this.saveVerifyData.userType,
      otp: null,
      advisorId: this.saveVerifyData.advisorId,
      mobileNo: this.saveVerifyData.mobileNo
    }
    this.barButtonOptions.active = true;    //// verify email or mobileNo with credentials
    this.loginService.generateOtp(obj1).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.otpResponse = data;
        this.isVerify = true;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  ///////////////////////////////////// signup process///////////////////////////////
  verify(flag, resendFlag) {
    let verifyObj;
    // if (resendFlag == true) {
    // this.intervallTimer.unsubscribe();
    (flag == 'Email') ? verifyObj = { email: this.saveVerifyData.email, userType: this.saveVerifyData.userType, otp: (this.otpResponse) ? (this.otpResponse) : null, advisorId: this.saveVerifyData.advisorId } : verifyObj = { mobileNo: this.saveVerifyData.mobileNo, userType: this.saveVerifyData.userType, otp: (this.otpResponse) ? (this.otpResponse) : null, advisorId: this.saveVerifyData.advisorId };
    this.verifyWithCredential(verifyObj, resendFlag);   //// verify Email Address
  }

  verifyWithCredential(obj, flag) {
    this.resendOtpFlag = flag;
    this.otpResendCountDown();
    if (this.resendOtpFlag) {
      this.eventService.openSnackBar("OTP sent successfully", "Dismiss");
    }
    this.barButtonOptions.active = true;    //// verify email or mobileNo with credentials
    this.loginService.generateOtp(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.otpResponse = data;
        this.isVerify = true;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }
  intervallTimer;
  otpResendCountDown() {
    let timeLeft = 30;
    this.showTimeRemaing = timeLeft;
    this.intervallTimer = interval(1000).pipe(takeUntil(timer(32000))).subscribe(
      data => {
        // if (data == 31) {
        //   this.intervallTimer.unsubscribe();
        //   return;
        // } else if (data < 31) {
        this.showTimeRemaing = timeLeft--;
        // }
        // else {
        //   this.intervallTimer.unsubscribe();
        //   return;
        // }
      }
    )
  }
  saveAfterVerifyCredential(obj) {    ////// save verified email or mobileNo in the table
    this.loginService.saveAfterVerification(obj).subscribe(
      data => {
        (this.verifyFlag == 'Email') ? this.verifyFlag = 'Mobile' : '';
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  getOtpData(outputData) {
    this.otpData = outputData;
  }

  enterEvent(flag) {
    if (flag == true) {
      this.verifyWithOtpResponse(this.verifyFlag);
    }
  }

  verifyWithOtpResponse(flag) {  ///// check user filled otp is correct or not
    const otpString = this.otpData.toString().replace(/,/g, '');
    if (otpString == '') {
      this.eventService.openSnackBar("Please enter OTP", "Dismiss");
      return;
    }
    if (flag == 'Email' && this.otpData.length == 4 && this.otpResponse == otpString) {
      const obj = {
        email: this.saveVerifyData.email,
        userId: this.saveVerifyData.userData.userId,
        userType: this.saveVerifyData.userData.userType
      };
      this.otpData = [];
      this.saveAfterVerifyCredential(obj);
      this.intervallTimer.unsubscribe();
      this.otpResendCountDown();
      this.signUpBarList[1].flag = true;
      this.eventService.openSnackBar('OTP matches sucessfully', 'Dismiss');
      if (this.userNameVerifyResponse != undefined) {
        this.router.navigate(['/login/setpassword'],
          { state: { userData: this.saveVerifyData.userData } });
        /////// check wheather user came from forgot password or sign-up Process
        return;
      }
      this.verify('Mobile', false);
      this.intervallTimer.unsubscribe();
      this.verifyFlag = 'Mobile';
    } else if (flag == 'Mobile' && this.otpData.length == 4 && this.otpResponse == otpString) {
      // const obj = {
      //   userId: this.saveVerifyData.userData.userId,
      //   userType: this.saveVerifyData.userData.userType,
      //   mobileNo: this.saveVerifyData.mobileNo,
      //   otp: otpString
      // };
      // this.loginService.saveAfterVerification(obj).subscribe(
      //   data => {
      //     this.signUpBarList[2].flag = true;
      //     this.eventService.openSnackBar('OTP matches sucessfully', 'Dismiss');
      //     this.router.navigate(['/login/setpassword'], { state: { userData: this.saveVerifyData.userData } });
      //   },
      //   err => {
      //     if (err == "Something went wrong !") {
      //       this.eventService.openSnackBar(err, "Dismiss")
      //       return
      //     }
      //     (this.resendOtpFlag) ? this.eventService.openSnackBar('OTP has expired', 'Dismiss') : this.eventService.openSnackBar('OTP is incorrect', 'Dismiss');
      //   }
      // );
      this.eventService.openSnackBar('OTP matches sucessfully', 'Dismiss');
      this.router.navigate(['/login/setpassword'], { state: { userData: this.saveVerifyData.userData } });
    } else {
      // err => this.eventService.openSnackBar(err, 'Dismiss');
      (this.resendOtpFlag) ? this.eventService.openSnackBar('OTP has expired', 'Dismiss') : this.eventService.openSnackBar('OTP is incorrect', 'Dismiss');
    }
  }

}
