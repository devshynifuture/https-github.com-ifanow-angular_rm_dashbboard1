import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import * as _ from 'lodash';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-variable-fee',
  templateUrl: './variable-fee.component.html',
  styleUrls: ['./variable-fee.component.scss']
})
export class VariableFeeComponent implements OnInit {
  otherAssetData: any[];
  selectedOtherAssets = [];
  isBillValid: any;
  mutualFundFees: any;
  isFeeValid: any;
  variableData;
  pricing: boolean;
  isSave;
  @Input() createSubData;
  @Output() outputData = new EventEmitter<Object>();
  singleSubscriptionData: any;
  isLoading = false;

  constructor(private subService: SubscriptionService, private fb: FormBuilder,
    public subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(data) {
    this.getSubscribeData(data);
  }

  @Input()
  set createFeeData(data) {
    this.getSubscribeData(data);
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

  createVariableForm(data) {
    this.variableFeeStructureForm = this.fb.group({
      billingNature: [data, [Validators.required]],
      billEvery: [data, [Validators.required]],
      Duration: [1],
      directFees: this.fb.group({
        equity: [data, [Validators.required]],
        debt: [data, [Validators.required]],
        liquid: [data, [Validators.required]]
      }),
      regularFees: this.fb.group({
        equity: [data, [Validators.required]],
        debt: [data, [Validators.required]],
        liquid: [data, [Validators.required]]
      }),
      otherAssetClassFees: [],
      pricing: [data, [Validators.required]]
    });
  }

  ngOnInit() {
    this.setValidation(false);
    this.isSave = true;
  }

  getVariableFee() {
    return this.variableFeeStructureForm.controls;
  }

  getSubscribeData(data) {
    console.log(data);
    (data.isCreateSub) ? this.isSave = true : this.isSave = false;
    if (data == undefined) {
      this.createVariableForm('');
      return;
    } else {
      this.singleSubscriptionData = data;
      console.log('getSubscribeData : ', this.singleSubscriptionData);
      this.getVariableFee().billingNature.setValue(this.singleSubscriptionData.subscriptionPricing.billingNature ? this.singleSubscriptionData.subscriptionPricing.billingNature + '' : '1');
      this.getVariableFee().billEvery.setValue(this.singleSubscriptionData.subscriptionPricing.billEvery);
      (this.singleSubscriptionData.subscriptionPricing.billingCycle == 0) ?
        this.getVariableFee().Duration.setValue(1) : this.getVariableFee().Duration.setValue(this.singleSubscriptionData.subscriptionPricing.billingCycle);
      /*//TODO commented for now*/
      this.getVariableFee().directFees.setValue({
        equity: this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[0].equityAllocation,
        debt: this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[0].debtAllocation,
        liquid: this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[0].liquidAllocation
      });
      this.getVariableFee().regularFees.setValue({
        equity: this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[1].equityAllocation,
        debt: this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[1].debtAllocation,
        liquid: this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[1].liquidAllocation
      });
      this.getVariableFee().pricing.setValue(this.singleSubscriptionData.subscriptionPricing.pricing);
      this.getVariableFee().otherAssetClassFees.setValue(this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[0].subscriptionSubAssets);
      this.otherAssetData = [];
      this.otherAssetData = this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[1].subscriptionSubAssets;
      (this.singleSubscriptionData.isCreateSub == false) ? this.variableFeeStructureForm.enable() : this.variableFeeStructureForm.disable();

    }
  }

  enableForm() {
    this.variableFeeStructureForm.enable();
    this.isSave = false;
  }

  close() {
    this.subInjectService.changeUpperRightSliderState({ state: 'close', flag: '' });
    this.subInjectService.changeNewRightSliderState({ state: 'close', flag: '' });
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
    this.pricing = flag;
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
      const obj = {
        subscriptionId: this.singleSubscriptionData.id,
        // subscriptionId: 12,
        billingNature: this.getVariableFee().billingNature.value,
        billingMode: 1,
        billEvery: this.getVariableFee().billEvery.value,
        feeTypeId: '',
        clientId: '',
        subId: '',
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
            subAssetIds: this.getJsonForSelectedSubAsset(),
            pricing: this.variableFeeStructureForm.controls.pricing.value
          }
        ]
      };
      if (this.singleSubscriptionData.isCreateSub == false) {
        obj.feeTypeId = this.singleSubscriptionData.subscriptionPricing.feeTypeId;
        obj.clientId = this.singleSubscriptionData.clientId;
        obj.subscriptionId = this.singleSubscriptionData.id;
        console.log(obj);
        this.outputData.emit(obj);

        // const rightSideDataSub = this.subInjectService.addSingleProfile(fragmentData).subscribe(
        //   sideBarData => {
        //     console.log('this is sidebardata in subs subs : ', sideBarData);
        //     if (UtilService.isDialogClose(sideBarData)) {
        //       console.log('this is sidebardata in subs subs 2: ', sideBarData);
        //       rightSideDataSub.unsubscribe();
        //     }
        //   }
        // );
      } else {
        this.isLoading = true;
        this.subService.editModifyFeeStructure(obj).subscribe(
          data => {
            this.saveVariableModifyFeesResponse(data);
            this.isLoading = false;
          }
          , error => {
            this.isLoading = false;
          });
      }
    }
  }

  getJsonForSelectedSubAsset() {
    const selectedSubAssetIds = [];
    this.selectedOtherAssets.forEach(singleSubAsset => {
      selectedSubAssetIds.push(singleSubAsset.subAssetClassId);
    });
    return selectedSubAssetIds;
  }

  saveVariableModifyFeesResponse(data) {
    if (this.singleSubscriptionData.isCreateSub) {

    }
    console.log('modify variable data', data);
    // this.close();
  }
}
