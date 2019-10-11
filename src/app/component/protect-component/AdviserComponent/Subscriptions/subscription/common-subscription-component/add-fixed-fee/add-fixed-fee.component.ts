import { Component, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';

@Component({
  selector: 'app-add-fixed-fee',
  templateUrl: './add-fixed-fee.component.html',
  styleUrls: ['./add-fixed-fee.component.scss']
})
export class AddFixedFeeComponent implements OnInit {
  isServiceValid;
  isCodeValid;
  isDescriptionValid;
  isFeesValid;
  isbillEvery;
  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,private subService:SubscriptionService) { 
    this.subInjectService.rightSideBarData.subscribe(
      data=>this.getFeeFormData(data)
    )
  }
  ngOnInit() {
    this.setValidation(false)
  }
  setValidation(flag)
  {
    this.isServiceValid=flag
    this.isCodeValid=flag;
    this.isDescriptionValid=flag;
    this.isFeesValid=flag;
    this.isbillEvery=flag;
  }

 
  fixedFeeData;
  getFormControl()
  {
    return this.fixedFeeData.controls;
  }
  getFeeFormData(data)
  {
    this.fixedFeeData = this.fb.group({
      serviceName: [data.serviceName,[Validators.required]],
      code: [data.serviceCode,[Validators.required]],
      description: [data.description,[Validators.required]],
      fees: [data,[Validators.required]],
      billingNature: [1],
      billEvery: [data,[Validators.required]],
      billingMode: [1]
    })
  }
  Close(state) {
    this.subInjectService.rightSliderData(state)
    this.setValidation(false);
    this.fixedFeeData.reset();
    
  }
  closeTab(state, value) {
    console.log(state)
    this.subInjectService.rightSliderData(state)
    this.subInjectService.closeSlider(value)
  }
  saveFeeTypeData(feeType,state) {
   
   if(this.fixedFeeData.controls.serviceName.invalid)
   {
     this.isServiceValid=true;
    return;
   }
   else if(this.fixedFeeData.controls.code.invalid)
   {
     this.isCodeValid=true;
     return;
   }
   else if(this.fixedFeeData.controls.description.invalid)
   {
     this.isDescriptionValid=true
     return;
   }
   else if(this.fixedFeeData.controls.fees.invalid)
   {
      this.isFeesValid=true;
      return;
   }
   else if(this.fixedFeeData.controls.billEvery.invalid)
   {
     this.isbillEvery=true;
     return;
   }
   else{
    let obj = {
      "advisorId": 12345,
      "description":this.fixedFeeData.controls.description.value,
      "global": false,
      "serviceCode": this.fixedFeeData.controls.code.value,
      "serviceName": this.fixedFeeData.controls.serviceName.value ,
      "servicePricing": {
        "autoRenew": 0,
        "billEvery": this.fixedFeeData.controls.billEvery.value ,
        "billingCycle": 1,
        "billingMode":parseInt(this.fixedFeeData.controls.billingMode.value) ,
        "billingNature": parseInt(this.fixedFeeData.controls.billingNature.value),
        "feeId":parseInt(feeType),
        "pricingList": [
          {
            "pricing":this.fixedFeeData.controls.fees.value,
            "assetClassId": 1
          }
        ]

      }
    }
     console.log("jifsdfoisd",obj)
    this.subService.createSettingService(obj).subscribe(
      data =>this.saveFeeTypeDataResponse(obj,data,state)
    )
   }  
  }
  saveFeeTypeDataResponse(obj,data,state)
  {
    
    this.subInjectService.pushUpperData(data);
    this.subInjectService.rightSliderData(state)
  }
}
