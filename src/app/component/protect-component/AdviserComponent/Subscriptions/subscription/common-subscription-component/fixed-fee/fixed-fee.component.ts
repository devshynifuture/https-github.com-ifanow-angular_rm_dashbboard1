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
  @Output() outputData = new EventEmitter<Object>();
  isSave: boolean;
  constructor(public utils: UtilService, private fb: FormBuilder, public subInjectService: SubscriptionInject, private subService: SubscriptionService) {
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
    billingNature: ['1'],
    billEvery: ['', [Validators.required]],
    Duration: [1],
    billingMode: ['1']
  });
  ngOnInit() {
    this.isSave = true
  }
  getFixedFee() {
    return this.fixedFeeStructureForm.controls;
  }
  subData:any
  getSubscribeData(data) {
    if(data.isAdvisor == undefined || data.isAdvisor == null) {
      data.isAdvisor = true;
    }
    const fixedData = data
    this.subData = data;
    
    if (data == '') {
      return;
    }
    else {
      this.singleSubscriptionData = fixedData
      this.getFixedFee().fees.setValue(fixedData.subscriptionPricing.pricing);
      this.getFixedFee().billingNature.setValue(String(fixedData.subscriptionPricing.billingNature));
      this.getFixedFee().billEvery.setValue(fixedData.subscriptionPricing.billEvery);
      this.getFixedFee().Duration.setValue('1');
      this.getFixedFee().billingMode.setValue(String(fixedData.subscriptionPricing.billingMode));
      (this.singleSubscriptionData.isCreateSub == false) ? this.fixedFeeStructureForm.enable() : this.fixedFeeStructureForm.disable();

    }
  }
  enableForm() {
    this.fixedFeeStructureForm.enable();
    this.isSave = false
  }
  Close(flag) {
    this.ngOnInit();
    this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired:flag });
    this.subInjectService.changeUpperRightSliderState({ state: 'close',refreshRequired:flag});
    this.fixedFeeStructureForm.reset();
    this.isSave = true
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
        billingCycle: this.getFixedFee().Duration.value,
        billingMode: this.getFixedFee().billingMode.value,
        billingNature: parseInt(this.getFixedFee().billingNature.value),
        feeTypeId: 1,
        subscriptionAssetPricingList: [
          {
            pricing: this.getFixedFee().fees.value,
            assetClassId: 1
          }
        ]
      };
      if (this.singleSubscriptionData.isCreateSub == false) {
        obj.feeTypeId = this.singleSubscriptionData.subscriptionPricing.feeTypeId;
        obj['clientId'] = this.singleSubscriptionData.clientId;
        obj['subId'] = this.singleSubscriptionData.id;
        this.outputData.emit(obj);
      } else {
        this.subService.editModifyFeeStructure(obj).subscribe(
          data => this.saveFixedModifyFeesResponse(data)
        );
      }
    }
  }

  saveFixedModifyFeesResponse(data) {
    this.Close(true);
  }

}
