import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { EnumServiceService } from '../../enum-service.service';
import * as _ from "lodash";
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-variable-fee',
  templateUrl: './add-variable-fee.component.html',
  styleUrls: ['./add-variable-fee.component.scss']
})
export class AddVariableFeeComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private subService: SubscriptionService, private enumService: EnumServiceService,private eventService:EventService) {
    this.subInjectService.rightSideBarData.subscribe(
      data => this.getFeeFormUpperData(data)
    );
  }

  isServiceValid;
  isCodeValid;
  idDesValid;
  isBillValid;
  variableFeeData;
  mutualFundFees
  otherAssetData;
  selectedOtherAssets = [];
  pricing;
  ngOnInit() {
    this.setValidation(false);
    this.otherAssetData = [];
    this.enumService.getOtherAssetData().forEach(element => {
      this.otherAssetData.push(Object.assign({}, element));
    });
    console.log(this.otherAssetData)
  }

  setValidation(flag) {
    this.isServiceValid = flag;
    this.isCodeValid = flag;
    this.idDesValid = flag;
    this.isBillValid = flag;
    this.mutualFundFees = flag;
    this.pricing = flag
  }

  getFormControl() {
    return this.variableFeeData.controls;
  }

  getFeeFormUpperData(data) {
    if(data=='')
    {
      this.variableFeeData = this.fb.group({
        serviceName: [data, [Validators.required]],
        code: [data, [Validators.required]],
        description: [data, [Validators.required]],
        billEvery: [data, [Validators.required]],
        Duration:[1],
        directFees: this.fb.group({
          equity: [data, [Validators.required]],
          debt: [data, [Validators.required]],
          liquid: [data, [Validators.required]]
        }),
        regularFees: this.fb.group({
          equity: [data, [Validators.required]],
          debt: [data,[Validators.required]],
          liquid: [data, [Validators.required]]
        }),
        otherAssetClassFees: [data],
        pricing: [data,[Validators.required]]
      });
      this.getFormControl().serviceName.maxLength = 40;
      this.getFormControl().code.maxLength = 10;
      this.getFormControl().description.maxLength = 160;  
    }
    else{
      this.variableFeeData = this.fb.group({
        serviceName: [data.serviceName, [Validators.required]],
        code: [data.serviceCode, [Validators.required]],
        description: [data.description, [Validators.required]],
        billEvery: [data.servicePricing.billEvery, [Validators.required]],
        Duration:[data],
        directFees: this.fb.group({
          equity: [data.servicePricing.pricingList[0].equityAllocation, [Validators.required]],
          debt: [data.servicePricing.pricingList[0].debtAllocation, [Validators.required]],
          liquid: [data.servicePricing.pricingList[0].liquidAllocation, [Validators.required]]
        }),
        regularFees: this.fb.group({
          equity: [data.servicePricing.pricingList[1].equityAllocation, [Validators.required]],
          debt: [data.servicePricing.pricingList[1].debtAllocation, [Validators.required]],
          liquid: [data.servicePricing.pricingList[1].liquidAllocation, [Validators.required]]
        }),
        otherAssetClassFees: [data.servicePricing.pricingList[2].otherAssets],
        pricing: [data.servicePricing.pricingList[2].pricing,[Validators.required]]
      });  
      this.getFormControl().serviceName.maxLength = 40;
      this.getFormControl().code.maxLength = 10;
      this.getFormControl().description.maxLength = 160;
    }
  }

  Close(state) {
    this.subInjectService.rightSliderData(state);
    this.setValidation(false);
    this.variableFeeData.reset();
  }

  closeTab(state, value) {
    console.log(value);
    this.subInjectService.rightSliderData(state);
    this.subInjectService.closeSlider(value);
  }

  saveVariableFeeData(feeType) {

    if (this.variableFeeData.controls.serviceName.invalid) {
      this.isServiceValid = true;
      return;
    } else if (this.variableFeeData.controls.code.invalid) {
      this.isCodeValid = true;
      return;
    } else if (this.variableFeeData.controls.description.invalid) {
      this.idDesValid = true;
      return;
    } else if (this.variableFeeData.controls.billEvery.invalid) {
      this.isBillValid = true;
      return;
    } else if (this.variableFeeData.controls.directFees.invalid || this.variableFeeData.controls.regularFees.invalid) {
      this.mutualFundFees = true
      return;
    }
    else if (this.variableFeeData.controls.pricing.invalid) {
      this.pricing = true
      return; 
    }
    else if (this.selectedOtherAssets.length == 0 ) {
      this.pricing = true;
      return; 
    }
    else {
      let obj = {
        "advisorId": 12345,
        "description": this.variableFeeData.controls.description.value,
        "global": false,
        "serviceCode": this.variableFeeData.controls.code.value,
        "serviceName": this.variableFeeData.controls.serviceName.value,
        "servicePricing": {
          "billEvery": parseInt(this.variableFeeData.controls.billEvery.value)*parseInt(this.variableFeeData.controls.Duration.value),
          "feeTypeId": parseInt(feeType),
          "pricingList": [
            {
              "directRegular": 1,
              "assetClassId": 1,
              "debtAllocation": this.variableFeeData.controls.directFees.controls.debt.value,
              "equityAllocation": this.variableFeeData.controls.directFees.controls.equity.value,
              "liquidAllocation": this.variableFeeData.controls.directFees.controls.liquid.value,
            }, {
              "directRegular": 2,
              "assetClassId": 1,
              "debtAllocation": this.variableFeeData.controls.regularFees.controls.debt.value,
              "equityAllocation": this.variableFeeData.controls.regularFees.controls.equity.value,
              "liquidAllocation": this.variableFeeData.controls.regularFees.controls.liquid.value,
            },
            {
              "assetClassId": 2,
              "otherAssets": this.selectedOtherAssets,
              "pricing": this.variableFeeData.controls.pricing.value
            }
          ]
        }
      };
      console.log('jifsdfoisd', obj);
      this.subService.createSettingService(obj).subscribe(
        data => this.saveVariableFeeDataResponse(data)
      )
    }

  }
  saveVariableFeeDataResponse(data) {
    this.subInjectService.pushUpperData(data);
    this.Close('close')
    this.eventService.openSnackBar("Service is Created","OK")
  }
  select(assetData) {
    (assetData.selected) ? this.unselectAssets(assetData) : this.selectAssets(assetData);
  }
  selectAssets(data) {
    console.log(data)
    data.selected = true;
    this.selectedOtherAssets.push(parseInt(data.value))
  }
  unselectAssets(data) {
    data.selected = false;
    _.remove(this.selectedOtherAssets, function (delData) {
      return delData.id == data.id;
    })
  }
}
