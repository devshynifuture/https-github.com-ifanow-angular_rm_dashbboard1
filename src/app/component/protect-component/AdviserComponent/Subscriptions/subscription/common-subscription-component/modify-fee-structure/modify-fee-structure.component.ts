import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {EnumServiceService} from '../../enum-service.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-modify-fee-structure',
  templateUrl: './modify-fee-structure.component.html',
  styleUrls: ['./modify-fee-structure.component.scss']
})
export class ModifyFeeStructureComponent implements OnInit {
  singleSubscriptionData: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private subInject: SubscriptionInject,
              private enumService: EnumServiceService) {
    this.subInject.singleProfileData.subscribe(
      data => this.getSubscribeData(data)
    );
  }

  @Input() ModifyFeesChange;
  @Input() createSubData;
  modifyFeeData;
  otherAssetData: any[];
  selectedOtherAssets = [];
  isBillValid;
  isFeeValid;
  mutualFundFees: any;
  pricing: boolean;
  fixedFeeStructureForm = this.fb.group({
    fees: ['', [Validators.required]],
    billingNature: [],
    billEvery: [],
    Duration: [1],
    billingMode: []
  });
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
  variableData;

  ngOnInit() {
    this.setValidation(false);
    // this.otherAssetData = [];
    // console.log(this.otherAssetData)
  }

  getDirectFees() {
    return
  }

  getSubscribeData(data) {
    console.log(data);
    this.singleSubscriptionData = data
    console.log(this.variableFeeStructureForm);
    if (data.subscriptionPricing.feeTypeId == 1) {
      this.getFixedFee().fees.setValue(data.subscriptionPricing.pricing);
      this.getFixedFee().billingNature.setValue(data.subscriptionPricing.billingNature);
      this.getFixedFee().billEvery.setValue(data.subscriptionPricing.billEvery);
      this.getFixedFee().billingMode.setValue(data.subscriptionPricing.billingMode);
    }
    if (data.subscriptionPricing.feeTypeId == 2) {
      this.getVariableFee().billingNature.setValue(data.subscriptionPricing.billingNature);
      this.getVariableFee().billEvery.setValue(data.subscriptionPricing.billEvery);
      // this.getVariableFee().Duration.setValue(data.subscriptionPricing.billingCycle);
      /*//TODO commented for now*/
      // this.getVariableFee().directFees.controls.equity.setValue(data.subscriptionPricing.subscriptionAssetPricingList[0].equityAllocation)
      // this.getVariableFee().directFees.controls.debt.setValue(data.subscriptionPricing.subscriptionAssetPricingList[0].equityAllocation)
      // this.getVariableFee().directFees.controls.liquid.setValue(data.subscriptionPricing.subscriptionAssetPricingList[0].equityAllocation)
      // this.getVariableFee().regularFees.controls.equity.setValue(data.subscriptionPricing.subscriptionAssetPricingList[1].equityAllocation)
      // this.getVariableFee().regularFees.controls.debt.setValue(data.subscriptionPricing.subscriptionAssetPricingList[1].equityAllocation)
      // this.getVariableFee().regularFees.controls.liquid.setValue(data.subscriptionPricing.subscriptionAssetPricingList[1].equityAllocation)
      this.getVariableFee().pricing.setValue(data.subscriptionPricing.pricing);
      this.getVariableFee().otherAssetClassFees.setValue(data.subscriptionPricing.subscriptionAssetPricingList[0].subscriptionSubAssets);
      this.otherAssetData = data.subscriptionPricing.subscriptionAssetPricingList[2].subscriptionSubAssets;
      this.otherAssetData.forEach(element => {
        if (element.selected == true) {
          this.selectedOtherAssets.push(element);
        }
      });
    }
    this.modifyFeeData = data;
  }

  setValidation(flag) {
    this.isBillValid = flag;
    this.mutualFundFees = flag;
    this.isFeeValid = flag;
    // this.otherAssetData = flag
  }

  Close(state) {
    this.ngOnInit();
    (this.ModifyFeesChange == 'createSub') ? this.subInjectService.rightSliderData(state) : this.subInjectService.rightSideData(state),
      (this.ModifyFeesChange === 'modifyFees') ? this.subInjectService.rightSliderData(state) :
        this.subInjectService.rightSideData(state);

    this.variableFeeStructureForm.reset();
    this.fixedFeeStructureForm.reset();

  }

  getFixedFee() {
    return this.fixedFeeStructureForm.controls;
  }

  getVariableFee() {
    return this.variableFeeStructureForm.controls;
  }

  select(assetData) {
    (assetData.selected) ? this.unselectAssets(assetData) : this.selectAssets(assetData);
  }

  selectAssets(data) {
    data.selected = true;
    this.selectedOtherAssets.push(data);
    console.log(this.selectedOtherAssets)
  }

  unselectAssets(data) {
    data.selected = false;
    _.remove(this.selectedOtherAssets, delData => {
      return delData.subAssetClassId == data.subAssetClassId;
    });
    console.log(this.selectedOtherAssets)
  }

  saveVariableModifyFees() {
    console.log()
    if (this.getVariableFee().billEvery.invalid) {
      this.isBillValid = true;
      return;
    } else if (this.variableFeeStructureForm.get('directFees').invalid || this.variableFeeStructureForm.get('regularFees').invalid) {
      this.mutualFundFees = true
      return
    } else if (this.getVariableFee().pricing.invalid) {
      this.pricing = true;
      return;
    } else {
      this.variableData = {
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
      if (this.createSubData) {
        console.log(this.variableData);
        this.variableData.feeTypeId = this.singleSubscriptionData.subscriptionPricing.feeTypeId
        this.variableData.clientId = this.singleSubscriptionData.clientId
        this.variableData.subId = this.singleSubscriptionData.id
        this.subInjectService.addSingleProfile(this.variableData)
      }
    }
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
        billEvery: this.getFixedFee().billEvery.value,
        billingCycle: 1,
        billingMode: this.getFixedFee().billingMode.value,
        billingNature: this.getFixedFee().billingNature.value,
        feeTypeId: 1,
        pricingList: [
          {
            pricing: this.getFixedFee().fees.value,
            assetClassId: 1
          }
        ]
      };
      console.log('fixed fees', obj);
    }

  }
}
