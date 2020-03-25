import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { PostalService } from 'src/app/services/postal.service';

@Component({
  selector: 'app-client-address',
  templateUrl: './client-address.component.html',
  styleUrls: ['./client-address.component.scss']
})
export class ClientAddressComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private postalService: PostalService) { }
  addressForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.addressForm = this.fb.group({
      proofType: ['1', [Validators.required]],
      addProofType: [, [Validators.required]],
      proofIdNum: [, [Validators.required]],
      addressLine1: [, [Validators.required]],
      addressLine2: [, [Validators.required]],
      pinCode: [, [Validators.required]],
      city: [, [Validators.required]],
      state: [, [Validators.required]],
      country: [, [Validators.required]]
    })
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
    this.addressForm.get('city').setValue(pincodeData[0].District)
    this.addressForm.get('state').setValue(pincodeData[0].State);
    this.addressForm.get('country').setValue(pincodeData[0].Country);
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
