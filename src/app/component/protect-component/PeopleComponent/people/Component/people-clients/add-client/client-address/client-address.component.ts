import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-client-address',
  templateUrl: './client-address.component.html',
  styleUrls: ['./client-address.component.scss']
})
export class ClientAddressComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }
  addressForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.addressForm = this.fb.group({
      proofType: [, [Validators.required]],
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
