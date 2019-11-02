import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-variable-fee',
  templateUrl: './variable-fee.component.html',
  styleUrls: ['./variable-fee.component.scss']
})
export class VariableFeeComponent implements OnInit {
  otherAssetData: any[];
  selectedOtherAssets=[];
  isBillValid: any;
  mutualFundFees: any;
  isFeeValid: any;
  variableData; 
  pricing: boolean;
  @Input() createSubData;
  constructor(private subService: SubscriptionService,private fb: FormBuilder, public subInjectService: SubscriptionInject) { 
    this.subInjectService.singleProfileData.subscribe(
      data => this.getSubscribeData(data)
    );
  }
  variableFeeStructureForm = this.fb.group({
    billingNature: [, [Validators.required]],
    billEvery: [, [Validators.required]],
    Duration: [1],
    directFees: this.fb.group({
      equity: [, [Validators.required]],
      debt: [, [Validators.required]],
      liquid: [, [Validators.required]]
    }),
    regularFees: this.fb.group({
      equity: [, [Validators.required]],
      debt: [, [Validators.required]],
      liquid: [, [Validators.required]]
    }),
    otherAssetClassFees: [],
    pricing: [, [Validators.required]]
  });
  ngOnInit() {
    this.setValidation(false);
  }
  getVariableFee() {
    return this.variableFeeStructureForm.controls;
  }

  getSubscribeData(data){
    console.log(data)    
    this.getVariableFee().billingNature.setValue(data.subscriptionPricing.billingNature);
    this.getVariableFee().billEvery.setValue(data.subscriptionPricing.billEvery);
    this.getVariableFee().Duration.setValue(data.subscriptionPricing.billingCycle);
    /*//TODO commented for now*/
    this.getVariableFee().directFees.setValue({
      equity: data.subscriptionPricing.subscriptionAssetPricingList[0].equityAllocation,
      debt: data.subscriptionPricing.subscriptionAssetPricingList[0].debtAllocation,
      liquid: data.subscriptionPricing.subscriptionAssetPricingList[0].liquidAllocation
    });
    this.getVariableFee().regularFees.setValue({
      equity: data.subscriptionPricing.subscriptionAssetPricingList[1].equityAllocation,
      debt: data.subscriptionPricing.subscriptionAssetPricingList[1].debtAllocation,
      liquid: data.subscriptionPricing.subscriptionAssetPricingList[1].liquidAllocation
    });
    this.getVariableFee().pricing.setValue(data.subscriptionPricing.pricing);
    this.getVariableFee().otherAssetClassFees.setValue(data.subscriptionPricing.subscriptionAssetPricingList[0].subscriptionSubAssets);
    this.otherAssetData = [];
    this.otherAssetData = data.subscriptionPricing.subscriptionAssetPricingList[2].subscriptionSubAssets; 
    (data.isCreateSub)?this.variableFeeStructureForm.enable():this.variableFeeStructureForm.disable()
  }
  enableForm() {
    this.variableFeeStructureForm.enable();
  }
  Close(state) {
    this.ngOnInit();
    this.subInjectService.rightSideData(state)
    this.variableFeeStructureForm.reset();
    console.log(this.createSubData)
  }
  select(assetData) {
    (assetData.selected) ? this.unselectAssets(assetData) : this.selectAssets(assetData);
  }

  selectAssets(data) {
    data.selected = true;
    this.selectedOtherAssets.push(data);
    console.log(this.selectedOtherAssets);
  }

  unselectAssets(data) {
    data.selected = false;
    _.remove(this.selectedOtherAssets, delData => {
      return delData.subAssetClassId == data.subAssetClassId;
    });
    console.log(this.selectedOtherAssets);
  }
  setValidation(flag) {
    this.isBillValid = flag;
    this.mutualFundFees = flag;
    this.isFeeValid = flag;
    this.pricing=flag
  }
  saveVariableModifyFees() {
    console.log();
    if (this.getVariableFee().billEvery.invalid) {
      this.isBillValid = true;
      return;
    } else if (this.variableFeeStructureForm.get('directFees').invalid || this.variableFeeStructureForm.get('regularFees').invalid) {
      this.mutualFundFees = true;
      return;
    } else if (this.getVariableFee().pricing.invalid) {
      this.pricing = true;
      return;
    } else {
      let obj = {
        subscriptionId: 12,
        billingNature: this.getVariableFee().billingNature.value,
        billingMode: 1,
        billEvery: this.getVariableFee().billEvery.value,
        subscriptionAssetPricingList: [
          {
            directRegular: 1,
            assetClassId: 1,
            equityAllocation: this.variableFeeStructureForm.get('directFees.equity').value,
            debtAllocation: this.variableFeeStructureForm.get('directFees.debt').value,
            liquidAllocation: this.variableFeeStructureForm.get('directFees.liquid').value
          }, {
            directRegular: 2,
            assetClassId: 1,
            equityAllocation: this.variableFeeStructureForm.get('regularFees.equity').value,
            debtAllocation: this.variableFeeStructureForm.get('regularFees.debt').value,
            liquidAllocation: this.variableFeeStructureForm.get('regularFees.liquid').value
          }, {
            assetClassId: 2,
            otherAssets: this.selectedOtherAssets,
            pricing: this.variableFeeStructureForm.controls.pricing.value
          }
        ]
      };
      this.subService.editModifyFeeStructure(obj).subscribe(
        data => this.saveVariableModifyFeesResponse(data)
      );
      // if (this.createSubData) {
      //   console.log(this.variableData);
      //   this.variableData.feeTypeId = this.singleSubscriptionData.subscriptionPricing.feeTypeId;
      //   this.variableData.clientId = this.singleSubscriptionData.clientId;
      //   this.variableData.subId = this.singleSubscriptionData.id;
      //   this.subInjectService.addSingleProfile(this.variableData);
      // }
      //  else {
      //  }
    }
  }
  saveVariableModifyFeesResponse(data) {
    console.log('modify variable data', data);
    this.subInjectService.rightSideData('close');
  }
}
