import { Component, OnInit } from '@angular/core';
import { MatInput } from '@angular/material';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  isVerify: boolean = false;
  otp: any;
  validatorType = ValidatorType;
  otpData = [];
  constructor() { }
  ngOnInit() {
  }
  config = {
    allowNumbersOnly: false,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  onOtpChange(otp) {
    this.otp = otp;
  }
  enterOtp(value) {


    if (value.keyCode == 8) {
      if (value.srcElement.previousElementSibling == undefined) {
        return;
      }
      value.srcElement.previousElementSibling.focus();
      this.otpData.pop();
    }
    else {
      if (value.srcElement.nextElementSibling == undefined) {
        return;
      }
      this.otpData.push(value.key);
      value.srcElement.nextElementSibling.focus();
    }

    console.log(value)

  }
  verify() {
    this.isVerify = true;
  }

}
