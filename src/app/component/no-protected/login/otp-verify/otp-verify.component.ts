import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss']
})
export class OtpVerifyComponent implements OnInit {
  otp: any;
  @Output() otpDataEvent = new EventEmitter();
  @Input() set otpData(data) {
    if (data.length == 0 && this.ngOtpInput.otpForm) {
      console.log(this.ngOtpInput.otpForm.reset())
    }
  }
  constructor() { }
  ngOnInit() {
  }
  @ViewChild('ngOtpInput', { static: true }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  onOtpChange(otp) {
    this.otp = otp;
    if (this.otp.length > 5) {
      this.otpDataEvent.emit(this.otp);
      this.config.placeholder = '';
    }
  }
}
