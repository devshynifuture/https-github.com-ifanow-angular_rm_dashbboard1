import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';

@Component({
  selector: 'app-payee-settings',
  templateUrl: './payee-settings.component.html',
  styleUrls: ['./payee-settings.component.scss']
})
export class PayeeSettingsComponent implements OnInit {

  settingsModal;
  payeeSettingsForm;
  sendData;
  updatedData: any;
  inputData: any;
  
  constructor(public subInjectService:SubscriptionInject, private eventService:EventService,private subService:SubscriptionService,private fb:FormBuilder) {
   }
   isCustomerName = false;
   isDisplayName = false;
   isCompanyName = false;
   isEmailId = false;
   isMobileNo = false;
   isPan = false;
   isGstIn = false;
   isBillingAddress = false;
   isPincode = false;
   OnInit() {
    
   }
   @Output() getEditData = new EventEmitter();
   @Input()
  set data(data) {
    this.inputData = data;
    this.getClientPayeeSettings(data);
  }

  get data() {
    return this.inputData;
  }

   getFormControl() {
    return this.payeeSettingsForm.controls;
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getClientPayeeSettings(data) {
    data = data.data
    console.log("payee data", data);
    this.payeeSettingsForm = this.fb.group({
      customerName: [data.name, [Validators.required]],
      displayName: [data.companyDisplayName, [Validators.required]],
      customerType:[(data.customerTypeId == 1)?'Bussiness':'Individual'],
      companyName: [data.companyName, [Validators.required]],
      emailId: [data.email, [Validators.required]],
      primaryContact: [data.primaryContact, [Validators.required]],
      pan: [data.pan, [Validators.required]],
      gstTreatment: [(data.gstTreatmentId == 1)?'Registered Business - Regular':(data.gstTreatmentId == 2)?'Registered Business - Composition':'Unregistered Business'],
      gstIn: [data.gstin, [Validators.required]],
      billingAddress: [data.billerAddress, [Validators.required]],
      city: [data.city],
      state: [data.state],
      country: [data.country],
      pincode: [data.zipCode, [Validators.required]],
      id:[data.id]
    }) 
    this.getFormControl().customerName.maxLength = 50;
    this.getFormControl().displayName.maxLength = 40;
    this.getFormControl().companyName.maxLength = 50;
    this.getFormControl().emailId.maxLength = 40;
    this.getFormControl().primaryContact.maxLength = 10;
    this.getFormControl().pan.maxLength = 10;
    this.getFormControl().gstIn.maxLength = 16;
    this.getFormControl().billingAddress.maxLength = 150;
    this.getFormControl().pincode.maxLength = 6;
  }
  
  obj=[
    {
        "id": null,
        "subscriptionId": 12,
        "clientBillerId": 7,
        "share": 25,
        "createdDate": "2000-02-22",
        "lastupdatedDate": "2000-03-23",
        "isActive": 1
    },
    {
        "id": null,
        "subscriptionId": 12,
        "clientBillerId": 25,
        "share": 5,
        "createdDate": "2000-02-22",
        "lastupdatedDate": "2000-03-23",
        "isActive": 1
    },
    {
        "id": null,
        "subscriptionId": 12,
        "clientBillerId": 55,
        "share": 5,
        "createdDate": "2000-02-22",
        "lastupdatedDate": "2000-03-23",
        "isActive": 1
    },
    {
        "id": null,
        "subscriptionId": 12,
        "clientBillerId": 75,
        "share": 5,
        "createdDate": "2000-02-22",
        "lastupdatedDate": "2000-03-23",
        "isActive": 1
    }
]
   getRightSliderData(data)
   {
     this.settingsModal=data;
   }
  ngOnInit() {
    this.getChangePayeeSetting();
  }
  getChangePayeeSetting()
  {
    this.subService.changePayeeSetting(this.obj).subscribe(
        data=> this.changePayeeSettingData(data)
      )
  }
  changePayeeSettingData(data)
  {
    console.log("data",data);
  }
  Close(data) {
    // this.subInjectService.rightSliderData(state)
    // this.subInjectService.rightSideData(state);
    this.subInjectService.changeUpperRightSliderState({state:'close',data})
  }
  savePayeeSettings() {
    if (this.payeeSettingsForm.controls.customerName.invalid) {
      this.isCustomerName = true
      return;
    }else if (this.payeeSettingsForm.controls.displayName.invalid) {
      this.isCustomerName = true
      return;
    }else if (this.payeeSettingsForm.controls.companyName.invalid) {
      this.isCustomerName = true
      return;
    }else if (this.payeeSettingsForm.controls.emailId.invalid) {
      this.isCustomerName = true
      return;
    }else if (this.payeeSettingsForm.controls.pan.invalid) {
      this.isCustomerName = true
      return;
    }else if (this.payeeSettingsForm.controls.pincode.invalid) {
      this.isCustomerName = true
      return;
    }else if (this.payeeSettingsForm.controls.gstIn.invalid) {
      this.isCustomerName = true
      return;
    }else if (this.payeeSettingsForm.controls.mobileNo.invalid) {
      this.isCustomerName = true
      return;
    }else if (this.payeeSettingsForm.controls.billingAddress.invalid) {
      this.isCustomerName = true
      return;
    }else{
      if(this.payeeSettingsForm.controls.id.value != undefined){
        let obj1 =
      {
        "customerName":this.getFormControl().customerName.value,
        "city": this.payeeSettingsForm.controls.city.value,
        "clientBillerId": 1,
        "companyDisplayName": this.payeeSettingsForm.controls.displayName.value,
        "companyName": this.payeeSettingsForm.controls.companyName.value,
        "country": this.payeeSettingsForm.controls.country.value,
        "currency": "string",
        "customerTypeId": (this.payeeSettingsForm.controls.customerType.value == 'Bussiness')?1:2,
        "email":this.payeeSettingsForm.controls.emailId.value,
        "gstTreatmentId": (this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Regular')?1:(this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Composition')?2:3,
        "gstin": this.payeeSettingsForm.controls.gstIn.value,
        "payeeTypeId": 1,
        "paymentTermsId": 1,
        "billerAddress": this.payeeSettingsForm.controls.billingAddress.value,
        "primaryContact":  this.payeeSettingsForm.controls.primaryContact.value,
        "state": this.payeeSettingsForm.controls.state.value,
        "zipCode": this.payeeSettingsForm.controls.pincode.value,
        "id":this.payeeSettingsForm.controls.id.value,
        "clientId": 2978
      }
      this.sendData = obj1;
      this.subService.editPayeeSettings(obj1).subscribe(
        data =>this.editSettingResData(data)
      )
     
      }else{

        let obj = {
          "customerName":this.getFormControl().customerName.value,
          "gstin": this.getFormControl().gstIn.value,
          "gstTreatmentId": (this.getFormControl().gstTreatment.value == 'Registered Business - Regular')?1:(this.payeeSettingsForm.controls.gstTreatment.value == 'Registered Business - Composition')?2:3,
          "email": this.getFormControl().emailId.value,
          "customerTypeId": (this.getFormControl().customerType.value == 'Bussiness')?'1':'2',
          "primaryContact": this.getFormControl().primaryContact.value,
          "companyName": this.getFormControl().companyName.value,
          "companyDisplayName": this.getFormControl().displayName.value,
          "billerAddress": this.getFormControl().billingAddress.value,
          "city": this.getFormControl().city.value,
          "state": this.getFormControl().state.value,
          "pan":this.getFormControl().pan.value,
          "country": this.getFormControl().country.value,
          "zipCode": this.getFormControl().pincode.value,
          "clientId": 2978,
          
        }
        this.subService.addClientBillerProfile(obj).subscribe(
          data => this.addClientBillerProfileRes(data)
        )
        
      }
    }
    
  }
  addClientBillerProfileRes(data){
    console.log("addClientBillerProfileRes",data)
    this.updatedData = data
    this.closeTab(data)
      this.eventService.openSnackBar("Family member added successfully","OK")
  }
  editSettingResData(data) {
   if(data.status == 1){
    this.eventService.openSnackBar("Family member updated successfully","OK")
    this.getEditData.emit(this.sendData)
    this.closeTab(data)
   }
  }
  closeTab(data) {
    if(data.status == 1){
      this.Close(data)
    }
  }
}
