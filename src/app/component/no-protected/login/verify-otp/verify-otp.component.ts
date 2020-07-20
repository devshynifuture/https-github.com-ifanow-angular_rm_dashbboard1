import { Component, OnInit } from '@angular/core';
import { ValidatorType } from 'src/app/services/util.service';
import { isString } from 'util';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  otpData = [];
  validatorType = ValidatorType;
  constructor() { }

  ngOnInit() {
  }

}
