import { Component, OnInit } from '@angular/core';
import { MatInput } from '@angular/material';
import { ValidatorType } from 'src/app/services/util.service';
import { FormControl, Validators } from '@angular/forms';

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
  userName = new FormControl('', [Validators.required]);
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
    if (value.code.substring(0, value.code.length - 1) == 'Key' || value.code == "Backspace") {
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
  }
  verify() {
    if (this.userName.invalid) {
      return;
    }
    else {
      (this.isVerify) ? this.isVerify = false : this.isVerify = true;
    }
  }

}
