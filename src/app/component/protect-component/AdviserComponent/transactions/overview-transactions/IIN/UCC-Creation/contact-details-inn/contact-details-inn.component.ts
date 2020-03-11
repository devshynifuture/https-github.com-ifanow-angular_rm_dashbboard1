import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { BankDetailsIINComponent } from '../bank-details-iin/bank-details-iin.component';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';
import { PostalService } from 'src/app/services/postal.service';

@Component({
  selector: 'app-contact-details-inn',
  templateUrl: './contact-details-inn.component.html',
  styleUrls: ['./contact-details-inn.component.scss']
})
export class ContactDetailsInnComponent implements OnInit {
  validatorType = ValidatorType
  contactDetails: any;
  inputData: any;
  holdingList: any;
  listHolders: any;
  list: any;
  firstHolderContact: any;
  secondHolderContact: any;
  thirdHolderContact: any;
  holder = {
    type: 'first',
    data: ''
  }
  obj1: any;
  sendObj: any;
  getObj: void;
  contacts: any[];

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,private postalService : PostalService,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, 
    public eventService: EventService, private ProcessTransactionService : ProcessTransactionService) { }

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRef: ViewContainerRef;

  @Input()
  set data(data) {
    this.inputData = data;
    this.list = data
    this.firstHolderContact = data.firstHolder
    this.secondHolderContact = data.secondHolder
    this.thirdHolderContact = data.thirdHolder
    console.log('################## = ', this.list)
    this.getdataForm(data)
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.getdataForm(this.firstHolderContact)
    this.obj1 = []
    this.sendObj = []
    this.contacts =[]
    console.log('holding list', this.holdingList)
  }
  // close() {
  //   const fragmentData = {
  //     direction: 'top',
  //     componentName: ContactDetailsInnComponent,
  //     state: 'close'
  //   };

  //   this.eventService.changeUpperSliderState(fragmentData);
  // }
  getdataForm(data) {

    this.contactDetails = this.fb.group({
      email: [(!data) ? '' : data.email, [Validators.required]],
      aadharNumber: [(!data) ? '' : data.aadharNumber, [Validators.required]],
      mobileNo: [!data ? '' : data.mobileNo, [Validators.required]],
      phoneNo: [!data ? '' : data.phoneNo, [Validators.required]],
      addressType: [!data ? '' : data.addressType, [Validators.required]],
      idType: [!data ? '' : data.idType, [Validators.required]],
      idNumber: [!data ? '' : data.idNumber, [Validators.required]],
      addressLine1: [!data ? '' : data.addressLine1, [Validators.required]],
      addressLine2: [!data ? '' : data.addressLine2, [Validators.required]],
      pinCode: [!data ? '' : data.pinCode, [Validators.required]],
      city: [!data ? '' : data.city, [Validators.required]],
      district: [!data ? '' : data.district, [Validators.required]],
      state: [!data ? '' : data.state, [Validators.required]],
      country: [!data ? '' : data.country, [Validators.required]],

    });
  }
  getFormControl(): any {
    return this.contactDetails.controls;
  }
  openBankDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: BankDetailsIINComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData)
  }
  pinInvalid: boolean = false;
  openPersonalDetails(){
    this.ProcessTransactionService.openPersonal(this.list)
  }
  getPostalPin(value) {
    let obj = {
      zipCode: value
    }
    console.log(value, "check value");
    if (value != "") {
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data)
        this.PinData(data)
      })
    }
    else {
      this.pinInvalid = false;
    }
  }

  PinData(data) {
    if (data[0].Status == "Error") {
      this.pinInvalid = true;

      this.getFormControl().pincode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue("");
      this.getFormControl().district.setValue("");
      this.getFormControl().country.setValue("");
      this.getFormControl().state.setValue("");

    }
    else {
      this.getFormControl().city.setValue(data[0].PostOffice[0].Region);
      this.getFormControl().district.setValue(data[0].PostOffice[0].District);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].State);
      this.pinInvalid = false;
    }
  }
  reset() {
    this.contactDetails.reset();
  }
  SendToForm(value, flag) {
    if (value == 'first') {
      this.saveContactDetails(value);
      if (this.firstHolderContact) {
        this.holder.type = value;
        this.contactDetails.setValue(this.firstHolderContact);
      } else {
        this.reset();
      }
    }
    else if (value == 'second') {
      this.saveContactDetails(value);
      if (this.secondHolderContact) {
        this.holder.type = value;
        this.contactDetails.setValue(this.secondHolderContact);
      } else {
        this.reset();
      }
    }
    else if (value == 'third') {
      this.saveContactDetails(value);
      if (this.thirdHolderContact) {
        this.holder.type = value;
        this.contactDetails.setValue(this.thirdHolderContact);
      } else {
        this.reset();
      };
    } else {
      this.saveContactDetails(value);
    }

    this.obj1 = []
    this.obj1.push(this.firstHolderContact)
    this.obj1.push(this.secondHolderContact)
    this.obj1.push(this.thirdHolderContact)
    if (flag == true) {
      const value = {}
      this.obj1.forEach(element => {
        if(element){
          this.getObj = this.setObj(element, value)
          this.contacts.push(this.getObj)
        }
     });
       this.sendObj.firstHolder = Object.assign({}, this.list.firstHolder, this.contacts[0]);
       this.sendObj.secondHolder = Object.assign({}, this.list.secondHolder, this.contacts[1]);
       this.sendObj.thirdHolder = Object.assign({}, this.list.thirdHolder, this.contacts[2]);
       this.sendObj.generalDetails = this.list.generalDetails

      this.openBankDetails(this.sendObj)
    }
  }
  setObj(holder, value){
   
    value = {
      email:holder.email,
      aadharNumber:holder.aadharNumber,
      mobileNo:holder.mobileNo,
      phoneNo:holder.phoneNo,
      idType:holder.idType,
      idNumber:holder.idNumber,
    }
    value.address = {
      addressType: holder.addressType,
      addressLine1: holder.addressLine1,
      addressLine2: holder.addressLine2,
      pinCode: holder.pinCode,
      city: holder.city,
      district: holder.district,
      state: holder.state,
      country: holder.country,
    }
    return value;
  }
  saveContactDetails(value) {
    if (this.contactDetails.get('email').invalid) {
      this.contactDetails.get('email').markAsTouched();
      return;
    } else if (this.contactDetails.get('aadharNumber').invalid) {
      this.contactDetails.get('aadharNumber').markAsTouched();
      return;
    } else if (this.contactDetails.get('mobileNo').invalid) {
      this.contactDetails.get('mobileNo').markAsTouched();
      return;
    } else if (this.contactDetails.get('phoneNo').invalid) {
      this.contactDetails.get('phoneNo').markAsTouched();
      return
    } else if (this.contactDetails.get('addressType').invalid) {
      this.contactDetails.get('addressType').markAsTouched();
      return;
    } else if (this.contactDetails.get('idType').invalid) {
      this.contactDetails.get('idType').markAsTouched();
      return;
    } else if (this.contactDetails.get('idNumber').invalid) {
      this.contactDetails.get('idNumber').markAsTouched();
      return;
    } else if (this.contactDetails.get('addressLine1').invalid) {
      this.contactDetails.get('addressLine1').markAsTouched();
      return;
    } else if (this.contactDetails.get('addressLine2').invalid) {
      this.contactDetails.get('addressLine2').markAsTouched();
      return;
    } else if (this.contactDetails.get('pinCode').invalid) {
      this.contactDetails.get('pinCode').markAsTouched();
      return;
    } else if (this.contactDetails.get('city').invalid) {
      this.contactDetails.get('city').markAsTouched();
      return;
    } else if (this.contactDetails.get('district').invalid) {
      this.contactDetails.get('district').markAsTouched();
      return;
    } else if (this.contactDetails.get('state').invalid) {
      this.contactDetails.get('state').markAsTouched();
      return;
    } else if (this.contactDetails.get('country').invalid) {
      this.contactDetails.get('country').markAsTouched();
      return;

    } else {

      this.setEditHolder(this.holder.type, value)
    }
  }

  setEditHolder(type, value) {
    switch (type) {
      case "first":
        this.firstHolderContact = this.contactDetails.value;
        this.holder.type = value;
        break;

      case "second":
        this.secondHolderContact = this.contactDetails.value;
        this.holder.type = value;
        break;

      case "third":
        this.thirdHolderContact = this.contactDetails.value;
        this.holder.type = value;
        break;

    }
  }
}
