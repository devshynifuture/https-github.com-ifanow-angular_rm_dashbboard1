import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { PostalService } from 'src/app/services/postal.service';

@Component({
  selector: 'app-client-bank',
  templateUrl: './client-bank.component.html',
  styleUrls: ['./client-bank.component.scss']
})
export class ClientBankComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private subService: SubscriptionService, private postalService: PostalService) {
  }

  bankForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();

  ngOnInit() {
    this.bankForm = this.fb.group({
      ifscCode: [, [Validators.required]],
      bankName: [, [Validators.required]],
      micrName: [, [Validators.required]],
      accNumber: [, [Validators.required]],
      accType: ['1', [Validators.required]],
      branchName: [, [Validators.required]],
      branchCountry: [, [Validators.required]],
      branchPinCode: [, [Validators.required]],
      branchAddressLine1: [, [Validators.required]],
      branchAddressLine2: [, [Validators.required]],
      branchCity: [, [Validators.required]],
      branchState: [, [Validators.required]]
    })
  }
  getBankAddress(ifsc) {
    let obj = {
      ifsc: ifsc
    }
    console.log('ifsc 121221', obj)

    if (ifsc != "") {
      this.subService.getBankAddress(obj).subscribe(data => {
        console.log('postal 121221', data)
        this.bankData(data)
        // this.PinData(data, 'bankDetailsForm')

      },
        err => {
          console.log(err, "error internet");
          this.bankData(err)
        })
    }
  }
  bankData(data) {
    (data == undefined) ? data = {} : '';
    console.log(data, "bank data")
    this.bankForm.get('bankName').setValue(data.bank)
    this.bankForm.get('branchCity').setValue(data.city)
    this.bankForm.get('branchState').setValue(data.state);
    this.bankForm.get('branchPinCode').setValue(data.state);
    this.bankForm.get('branchName').setValue(data.centre);
    this.bankForm.get('branchCountry').setValue("India");
    this.bankForm.get('branchAddressLine1').setValue(data.address);
  }
  getPostalPin(value) {
    let obj = {
      zipCode: value
    }
    console.log(value, "check value");
    if (value != "") {
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data)
        this.PinData(data)
      })
    }
  }
  PinData(data) {
    let pincodeData = (data == undefined) ? data = {} : data[0].PostOffice;
    this.bankForm.get('branchCity').setValue(pincodeData[0].District)
    this.bankForm.get('branchState').setValue(pincodeData[0].State);
    this.bankForm.get('branchCountry').setValue(pincodeData[0].Country);
  }
  saveNext() {
    this.tabChange.emit(1);
  }
  saveClose() {
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
