import { Component, OnInit } from '@angular/core';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  isVerify: boolean = false;
  otp: any;
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
    if (value.srcElement.nextElementSibling == undefined && this.otpData.length > 6) {
      return;
    }
    if (value.srcElement.previousElementSibling == undefined && this.otpData.length < 0 || value == '') {
      return;
    }
    if (value.inputType == "insertText") {
      this.otpData.push(value);
      value.srcElement.nextElementSibling.focus();
    }
    else {
      value.srcElement.previousElementSibling.focus();
      this.otpData.pop();
    }

    console.log(value)

  }
  verify() {
    this.isVerify = true;
  }

}
