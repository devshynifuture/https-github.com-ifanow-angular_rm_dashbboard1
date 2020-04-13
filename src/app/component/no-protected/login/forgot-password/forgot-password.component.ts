import { Component, OnInit } from '@angular/core';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Router } from '@angular/router';

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
  verifyForm = this.fb.group({
    no1: [],
    no2: [],
    no3: [],
    no4: [],
    no5: [],
    no6: []
  });
  userNameVerifyResponse: any;

  constructor(private loginService: LoginService, private eventService: EventService,
    private router: Router, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.verifyData = window.history.state;
    this.saveVerifyData = Object.assign({}, window.history.state);
    if (!this.saveVerifyData) {
      this.saveVerifyData = {};
    }
    if (this.verifyData.flag) {
      this.hideNumEmailFromUser(this.saveVerifyData);

      this.isVerify = true;
      this.verify('Email');
      this.verifyFlag = 'Email';
    } else {
      this.isVerify = false;
    }
    this.userName = new FormControl('', [Validators.required]);
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
      this.verifyData.mobileNo = UtilService.obfuscateEmail(String(data.mobileNo));
    }
  }

  enterOtp(value) {
    if (value.code.substring(0, value.code.length - 1) == 'Key' || value.code == 'Backspace') {
      if (value.srcElement.previousElementSibling == undefined) {
        return;
      }
      value.srcElement.previousElementSibling.focus();
      this.otpData.pop();
    } else {
      if (value.srcElement.nextElementSibling == undefined) {
        this.otpData.push(parseInt(value.key));
        return;
      }
      this.otpData.push(parseInt(value.key));
      value.srcElement.nextElementSibling.focus();
    }
  }
  verifyUsernameOnEnter(event) {
    (event.keyCode == 13) ? this.verifyUsername() : '';
  }
  verifyUsername() {   //////////// username///////////////////
    const obj = {
      userName: this.userName.value
    };
    this.loginService.getUsernameData(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          data['buttonFlag'] = "reset";
          this.saveVerifyData.userData = data;
          this.hideNumEmailFromUser(this.saveVerifyData);
          this.userNameVerifyResponse = data;
          // this.saveVerifyData.email = data.emailList[0].email;
          // this.saveVerifyData.mobileNo = data.mobileList[0].mobileNo;
          // this.saveVerifyData['userData'] = data
          this.isVerify = true;
          if (this.saveVerifyData.email) {
            this.verifyFlag = 'Email';
            this.verify('Email');
          } else if (this.saveVerifyData.mobileNo != 0) {
            this.verifyFlag = 'Mobile';
            this.verify('Mobile');
          } else {
            this.eventService.openSnackBar('Please contact your advisor for more details');
          }
        }
      }
      ,
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  ///////////////////////////////////// signup process///////////////////////////////
  verify(flag) {
    let verifyObj;
    (flag == 'Email') ? verifyObj = { email: this.saveVerifyData.email } : verifyObj = { mobileNo: this.saveVerifyData.mobileNo };
    this.verifyWithCredential(verifyObj);   //// verify Email Address
  }

  verifyWithCredential(obj) {    //// verify email or mobileNo with credentials
    this.loginService.generateOtp(obj).subscribe(
      data => {
        console.log(data);
        this.otpResponse = data;
        this.isVerify = true;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  saveAfterVerifyCredential(obj) {    ////// save verified email or mobileNo in the table
    this.loginService.saveAfterVerification(obj).subscribe(
      data => {

        console.log(data);
        (this.verifyFlag == 'Email') ? this.verifyFlag = 'Mobile' : '';
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  verifyWithOtpResponse(flag) {  ///// check user filled otp is correct or not
    const otpString = this.otpData.toString().replace(/,/g, '');

    if (flag == 'Email' && this.otpData.length == 6 && this.otpResponse == otpString) {
      const obj = {
        email: this.saveVerifyData.email,
        userId: this.saveVerifyData.userId,
        userType: this.saveVerifyData.userType
      };
      this.verifyForm.reset();
      this.otpData = [];
      this.saveAfterVerifyCredential(obj);
      this.eventService.openSnackBar('Otp matches sucessfully', 'Dismiss');
      if (this.userNameVerifyResponse != undefined) {
        this.router.navigate(['/login/setpassword'],
          { state: { userData: this.saveVerifyData.userData } });
        /////// check wheather user came from forgot password or sign-up Process
        return;
      }
      this.verify('Mobile');
      this.verifyFlag = 'Mobile';
    } else if (flag == 'Mobile' && this.otpData.length == 6 && this.otpResponse == otpString) {
      const obj = {
        userId: this.saveVerifyData.userId,
        userType: this.saveVerifyData.userType,
        mobileNo: this.saveVerifyData.mobileNo
      };
      this.eventService.openSnackBar('Otp matches sucessfully', 'Dismiss');
      this.saveAfterVerifyCredential(obj);
      this.router.navigate(['/login/setpassword'], { state: { userData: this.saveVerifyData.userData } });
    } else {
      this.eventService.openSnackBar('OTP is incorrect', 'Dismiss');
    }
  }
}
