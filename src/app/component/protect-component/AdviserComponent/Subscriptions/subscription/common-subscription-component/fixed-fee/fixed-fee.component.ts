import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../subscription-inject.service';

@Component({
  selector: 'app-fixed-fee',
  templateUrl: './fixed-fee.component.html',
  styleUrls: ['./fixed-fee.component.scss']
})
export class FixedFeeComponent implements OnInit {
  singleSubscriptionData: any;
  isFeeValid: boolean;
  isBillValid: boolean;
  @Input() createSubData; 
  constructor(private fb: FormBuilder,public subInjectService: SubscriptionInject) {
    this.subInjectService.singleProfileData.subscribe(
      data => this.getSubscribeData(data)
    );
   }
  fixedFeeStructureForm = this.fb.group({
    fees: ['', [Validators.required]],
    billingNature: [1],
    billEvery: [, [Validators.required]],
    Duration: [1],
    billingMode: [1]
  });
  ngOnInit() {
  }
  getFixedFee() {
    return this.fixedFeeStructureForm.controls;
  }
  getSubscribeData(data)
  {
    this.singleSubscriptionData=data
    this.getFixedFee().fees.setValue(data.subscriptionPricing.pricing);
    this.getFixedFee().billingNature.setValue(data.subscriptionPricing.billingNature);
    this.getFixedFee().billEvery.setValue(data.subscriptionPricing.billEvery);
    this.getFixedFee().Duration.setValue(data.subscriptionPricing.billingCycle);
    this.getFixedFee().billingMode.setValue(data.subscriptionPricing.billingMode);
  }
  enableForm() {
    this.fixedFeeStructureForm.enable();
  }
  Close(state) {
    this.ngOnInit();
    this.subInjectService.rightSideData(state)
    this.fixedFeeStructureForm.reset();
  }
  saveFixedModifyFees() {
    if (this.getFixedFee().fees.invalid) {
      this.isFeeValid = true;
      return;
    } else if (this.getFixedFee().billEvery.invalid) {
      this.isBillValid = true;
      return;
    } else {
      const obj = {
        autoRenew: 0,
        subscriptionId: this.singleSubscriptionData.id,
        billEvery: this.getFixedFee().billEvery.value,
        billingCycle: 1,
        billingMode: this.getFixedFee().billingMode.value,
        billingNature: this.getFixedFee().billingNature.value,
        feeTypeId: 1,
        clientId: '',
        subId: '',
        subscriptionAssetPricingList: [
          {
            pricing: this.getFixedFee().fees.value,
            assetClassId: 1
          }
        ]
      };
      console.log(obj)
      // if (this.createSubData) {
      //   obj.feeTypeId = this.singleSubscriptionData.subscriptionPricing.feeTypeId;
      //   obj.clientId = this.singleSubscriptionData.clientId;
      //   obj.subId = this.singleSubscriptionData.id;
      //   this.subInjectService.addSingleProfile(obj);
      // } else {
        
      // }
    }
  }

  saveFixedModifyFeesResponse(data) {
    console.log(data, 'modify fixed fee data');
    this.subInjectService.rightSideData('close');
  }

}
