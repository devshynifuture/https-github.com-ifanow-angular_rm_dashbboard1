import { Component, OnInit } from '@angular/core';
import { ValidatorType } from 'src/app/services/util.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from '../login.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  isVerify: boolean = false;
  verifyFlag
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
  })
  userNameVerifyResponse: any;
  constructor(private loginService: LoginService, private eventService: EventService, private router: Router, private fb: FormBuilder) { }
  ngOnInit() {
    this.verifyData = window.history.state;
    this.saveVerifyData = Object.assign({}, window.history.state);
    if (this.verifyData.flag) {
      this.isVerify = true;
      this.verify('Email');
      this.verifyFlag = 'Email';
      this.hideNumEmailFromUser(this.verifyData);
    }
    else {
      this.isVerify = false;
    };
    this.userName = new FormControl('', [Validators.required]);
  }
  hideNumEmailFromUser(verifyData) {
    this.verifyData.mobileNo = verifyData.mobileNo.substr(0, 2) + 'XXXXX' + verifyData.mobileNo.substr(7, 9);
    this.verifyData.emailId = verifyData.emailId.substr(2, verifyData.emailId.indexOf('@') - 2) + 'XXXXX' + verifyData.emailId.substr(7, 9)
  }
  enterOtp(value) {
    if (value.code.substring(0, value.code.length - 1) == 'Key' || value.code == "Backspace") {
      if (value.srcElement.previousElementSibling == undefined) {
        return;
      }
      value.srcElement.previousElementSibling.focus();
      this.otpData.pop();
    }
    else {
      if (value.srcElement.nextElementSibling == undefined) {
        this.otpData.push(parseInt(value.key));
        return;
      }
      this.otpData.push(parseInt(value.key));
      value.srcElement.nextElementSibling.focus();
    }
  }
  verifyUsername() {   //////////// username///////////////////
    let obj = {
      userName: this.userName.value
    }
    this.loginService.getUsernameData(obj).subscribe(
      data => {
        console.log(data);
        this.userNameVerifyResponse = data;
        this.saveVerifyData.emailId = data.emailList[0].email;
        this.saveVerifyData.mobileNo = data.mobileList[0].mobileNo;
        this.hideNumEmailFromUser(this.saveVerifyData);
        this.isVerify = true;
        if (this.saveVerifyData.emailId) {
          this.verifyFlag = "Email"
          this.verify('Email')
        }
        else if (this.saveVerifyData.mobileNo != 0) {
          this.verifyFlag = "Mobile";
          this.verify("Mobile");
        }
        else {
          this.eventService.openSnackBar("Please contact your advisor for more details")
        }
      }
      ,
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  ///////////////////////////////////// signup process///////////////////////////////
  verify(flag) {
    let verifyObj;
    (flag == 'Email') ? verifyObj = { "forEmail": this.saveVerifyData.emailId } : verifyObj = { 'forMobNum': this.saveVerifyData.mobileNo };
    this.verifyWithCredential(verifyObj)   ////verify Email Address
  }
  verifyWithCredential(obj) {    //// verify email or mobile with credentials
    this.loginService.generateOtp(obj).subscribe(
      data => {
        console.log(data);
        this.otpResponse = data;
        this.isVerify = true;
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  saveAfterVerifyCredential(obj) {    //////save verified email or mobile in the table
    this.loginService.saveAfterVerification(obj).subscribe(
      data => {
        console.log(data);
        (this.verifyFlag == 'Email') ? this.verifyFlag = "Mobile" : '';
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  verifyWithOtpResponse(flag) {  ///// check user filled otp is correct or not
    let otpString = this.otpData.toString().replace(/,/g, "");
    let obj =
    {
      email: (this.verifyFlag == 'Email') ? this.saveVerifyData.emailId : null,
      userId: this.saveVerifyData.userId,
      userType: this.saveVerifyData.userType,
      mobileNo: (this.verifyFlag == 'Mobile') ? this.saveVerifyData.mobileNo : null
    }
    if (flag == 'Email' && this.otpData.length == 6 && this.otpResponse == otpString) {
      this.verifyForm.reset();
      this.otpData = []
      this.saveAfterVerifyCredential(obj);
      this.eventService.openSnackBar("Otp matches sucessfully", "Dismiss");
      if (this.userNameVerifyResponse != undefined) {
        this.router.navigate(['/login/setpassword'], { state: { userId: this.saveVerifyData.userId } });                      /////// check wheather user came from forgot password or sign-up Process
        return;
      }
      this.verify('Mobile');
      this.verifyFlag = 'Mobile'
    }
    else if (flag == 'Mobile' && this.otpData.length == 6 && this.otpResponse == otpString) {
      this.eventService.openSnackBar("Otp matches sucessfully", "Dismiss");
      this.saveAfterVerifyCredential(obj);
      this.router.navigate(['/login/setpassword'], { state: { userId: this.saveVerifyData.userId } });
    }
    else {
      this.eventService.openSnackBar("OTP is incorrect", "Dismiss");
    }
  }
}
