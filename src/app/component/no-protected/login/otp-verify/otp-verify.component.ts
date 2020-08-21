import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss']
})
export class OtpVerifyComponent implements OnInit {
  otp: any;
  @Output() otpDataEvent = new EventEmitter();

  @ViewChild('ngOtpInput', { static: true }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  @Output() saveFunction = new EventEmitter();

  ngOnInit() {
  }

  constructor() {
  }

  @Input() set otpData(data) {
    if (data.length == 0 && this.ngOtpInput.otpForm) {
      this.ngOtpInput.otpForm.reset()
    }
  }

  enterFunction(event) {
    if (event.charCode == 13 && this.otp.length == this.config.length) {
      this.saveFunction.emit(true);
    }
  }

  onOtpChange(otp) {
    this.otp = otp;
    if (this.otp.length == this.config.length) {
      this.otpDataEvent.emit(this.otp);
      this.config.placeholder = '';
    }
  }
}
