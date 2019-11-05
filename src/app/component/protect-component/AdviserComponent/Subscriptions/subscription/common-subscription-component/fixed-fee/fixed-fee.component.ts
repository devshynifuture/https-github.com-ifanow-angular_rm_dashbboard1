import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { UtilService } from 'src/app/services/util.service';

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
  @Output() outputData=new EventEmitter<Object>();
  constructor(private fb: FormBuilder, public subInjectService: SubscriptionInject, private subService: SubscriptionService) {
  }
  @Input()
  set data(data) {
    this.getSubscribeData(data);
  }
  @Input()
  set createFeeData(data) {
    this.getSubscribeData(data)
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
  getSubscribeData(data) {
    const fixedData = data
    if (data == '') {
      return;
    }
    else {
      this.singleSubscriptionData = fixedData
      this.getFixedFee().fees.setValue(fixedData.subscriptionPricing.pricing);
      this.getFixedFee().billingNature.setValue(fixedData.subscriptionPricing.billingNature);
      this.getFixedFee().billEvery.setValue(fixedData.subscriptionPricing.billEvery);
      this.getFixedFee().Duration.setValue(fixedData.subscriptionPricing.billingCycle);
      this.getFixedFee().billingMode.setValue(fixedData.subscriptionPricing.billingMode);
    }
  }
  enableForm() {
    this.fixedFeeStructureForm.enable();
  }
  Close(state) {
    this.ngOnInit();
    this.subInjectService.rightSideData(state)
    this.subInjectService.rightSliderData(state)
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
      if (this.singleSubscriptionData.isCreateSub==false) {
        obj.feeTypeId = this.singleSubscriptionData.subscriptionPricing.feeTypeId;
        obj.clientId = this.singleSubscriptionData.clientId;
        obj.subId = this.singleSubscriptionData.id;
        this.outputData.emit(obj);
      } else {
        this.subService.editModifyFeeStructure(obj).subscribe(
          data => this.saveFixedModifyFeesResponse(data)
        );
      }
    }
  }

  saveFixedModifyFeesResponse(data) {
    console.log(data, 'modify fixed fee data');
    this.subInjectService.rightSideData('close');
  }

}
