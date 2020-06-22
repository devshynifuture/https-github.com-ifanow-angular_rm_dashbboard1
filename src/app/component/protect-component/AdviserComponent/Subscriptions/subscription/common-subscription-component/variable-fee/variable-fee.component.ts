import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { ValidatorType } from "../../../../../../../services/util.service";

@Component({
  selector: 'app-variable-fee',
  templateUrl: './variable-fee.component.html',
  styleUrls: ['./variable-fee.component.scss']
})
export class VariableFeeComponent implements OnInit {
  otherAssetData: [];
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
  variableFeeStructureForm = this.fb.group({
    billingNature: [, [Validators.required]],
    /*billEvery: [, [Validators.required]],*/
    Duration: [[1], [Validators.required]],
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
    pricing: [, [Validators.required, Validators.min(0.001), Validators.max(99)]]
  });
  validatorType = ValidatorType;

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

  createVariableForm(data) {
    this.variableFeeStructureForm = this.fb.group({
      billEvery: [data, [Validators.required]],
      Duration: [data, [Validators.required]],
      directFees: this.fb.group({
        equity: [data, [Validators.required, Validators.max(100)]],
        debt: [data, [Validators.required, Validators.max(100)]],
        liquid: [data, [Validators.required, Validators.max(100)]]
      }),
      regularFees: this.fb.group({
        equity: [data, [Validators.required, Validators.max(100)]],
        debt: [data, [Validators.required, Validators.max(100)]],
        liquid: [data, [Validators.required, Validators.max(100)]]
      }),
      otherAssetClassFees: [],
      pricing: [data, [Validators.required, Validators.min(0), Validators.max(100)]]
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

    if (data.isAdvisor == undefined || data.isAdvisor == null) {
      data.isAdvisor = true;
    }
    (data.isCreateSub) ? this.isSave = true : this.isSave = false;
    if (data == undefined) {
      this.createVariableForm('');
      return;
    } else {
      this.singleSubscriptionData = data;
      this.outputData.emit(this.singleSubscriptionData);
      /* this.getVariableFee().billEvery.setValue(this.singleSubscriptionData.subscriptionPricing.billEvery);*/
      this.getVariableFee().Duration.setValue(this.singleSubscriptionData.subscriptionPricing.billEvery + "");
      /*(this.singleSubscriptionData.subscriptionPricing.billingCycle == 0) ?
        this.getVariableFee().Duration.setValue(1) : this.getVariableFee().Duration.setValue(this.singleSubscriptionData.subscriptionPricing.billingCycle);*/
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
      this.getVariableFee().pricing.setValue(this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[2].pricing);
      this.getVariableFee().otherAssetClassFees.setValue(this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[0].subscriptionSubAssets);
      this.otherAssetData = [];
      this.otherAssetData = this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[2].subscriptionSubAssets;
      this.singleSubscriptionData.subscriptionPricing.subscriptionAssetPricingList[2].subscriptionSubAssets.forEach(element => {
        if (element.selected) {
          this.selectedOtherAssets.push(element.subAssetClassId)
        }
      });
      (this.singleSubscriptionData.isCreateSub == false) ? this.variableFeeStructureForm.enable() : this.variableFeeStructureForm.disable();
    }
  }

  enableForm() {
    this.variableFeeStructureForm.enable();
    this.isSave = false;
  }

  close(flag) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close', refreshRequired: flag });
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  select(assetData) {
    if (this.variableFeeStructureForm.enabled) {
      (assetData.selected) ? this.unselectAssets(assetData) : this.selectAssets(assetData);
    }
  }

  selectAssets(data) {
    data.selected = true;
    this.selectedOtherAssets.push(parseInt(data.subAssetClassId));
  }

  unselectAssets(data) {
    data.selected = false;
    this.selectedOtherAssets = this.selectedOtherAssets.filter(delData => delData != data.subAssetClassId)
  }

  setValidation(flag) {
    this.isBillValid = flag;
    this.mutualFundFees = flag;
    this.isFeeValid = flag;
    this.pricing = flag;
  }

  saveVariableModifyFees() {
    /*if (this.getVariableFee().billEvery.invalid) {
       this.isBillValid = true;
       return;
     } else*/
    if (this.variableFeeStructureForm.get('directFees').invalid || this.variableFeeStructureForm.get('regularFees').invalid) {
      this.mutualFundFees = true;
      return;
    } else if (this.getVariableFee().pricing.invalid) {
      this.pricing = true;
      return;
    } else {
      const obj = {
        subscriptionId: this.singleSubscriptionData.id,
        // subscriptionId: 12,
        billingNature: this.singleSubscriptionData.subscriptionPricing.billingNature,
        billingMode: this.singleSubscriptionData.subscriptionPricing.billingMode,
        /* billEvery: this.getVariableFee().billEvery.value*/
        billEvery: this.getVariableFee().Duration.value,
        billingCycle: 1,
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
            subAssetIds: this.selectedOtherAssets,
            pricing: this.variableFeeStructureForm.controls.pricing.value
          }
        ]
      };
      // this.getJsonForSelectedSubAsset()
      if (this.singleSubscriptionData.isCreateSub == false) {
        obj['feeTypeId'] = this.singleSubscriptionData.subscriptionPricing.feeTypeId;
        obj['clientId'] = this.singleSubscriptionData.clientId;
        obj['subId'] = this.singleSubscriptionData.id;
        this.outputData.emit(obj);

        // const rightSideDataSub = this.subInjectService.addSingleProfile(fragmentData).subscribe(
        //   sideBarData => {
        //     if (UtilService.isDialogClose(sideBarData)) {
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

  // getJsonForSelectedSubAsset() {
  //   const selectedSubAssetIds = [];
  //   this.selectedOtherAssets.forEach(singleSubAsset => {
  //     selectedSubAssetIds.push(singleSubAsset.subAssetClassId);
  //   });
  //   return selectedSubAssetIds;
  // }

  saveVariableModifyFeesResponse(data) {
    if (this.singleSubscriptionData.isCreateSub) {

    }
    this.close(true);
  }
}
