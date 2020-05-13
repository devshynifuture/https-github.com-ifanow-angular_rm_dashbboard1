import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {DatePipe} from '@angular/common';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ProcessTransactionService} from '../../../doTransaction/process-transaction.service';
import {PostalService} from 'src/app/services/postal.service';
import {MatInput} from '@angular/material';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-contact-details-inn',
  templateUrl: './contact-details-inn.component.html',
  styleUrls: ['./contact-details-inn.component.scss']
})

export class ContactDetailsInnComponent implements OnInit {

  validatorType = ValidatorType;
  isLoading = false;
  pinInvalid = false;
  contactDetails: any;
  inputData: any;
  holdingList: any;
  list: any;
  firstHolderContact: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private postalService: PostalService,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
              public eventService: EventService, private processTransactionService: ProcessTransactionService,
              private peopleService: PeopleService) {
  }

  obj1: any;
  sendObj: any;
  changedValue: string;
  generalDetails: any;
  doneData: any;
  isdCodes: Array<any> = [];

  get data() {
    return this.inputData;
  }

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  clientData: any;
  addressList: any;

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRef: ViewContainerRef;

  @Input()
  set data(data) {
    this.inputData = data;
    this.clientData = data.clientData;
    console.log('all data in contact', this.inputData);
    this.doneData = {};
    this.list = data;
    if (data && data.firstHolder) {
      this.doneData.personal = true;
      this.doneData.contact = false;
      this.firstHolderContact = data.firstHolder;
    } else if (data.holderList) {
      this.firstHolderContact = data.holderList[0];
    }
    if (!this.firstHolderContact.address1) {
      this.getAddressList(this.clientData);
    }
    this.generalDetails = data.generalDetails;
    console.log('################## = ', this.list);
  }

  ngOnInit() {
    this.getIsdCodesData();
    const value = {};
    if (this.firstHolderContact) {
      /* if (this.firstHolderContact.address) {
         this.firstHolderContact.address = undefined;
       }*/
      this.getdataForm(this.firstHolderContact);
    } else {
      this.getdataForm(null);
      if (this.clientData) {
        this.getAddressList(this.clientData);
      }
    }
    this.sendObj = {};
    console.log('holding list', this.holdingList);
  }

  close() {
    this.changedValue = 'close';
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }

  getIsdCodesData() {

    this.peopleService.getIsdCode({}).subscribe(
      data => {
        if (data) {
          this.isdCodes = data;
        }
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  getAddressList(data) {
    this.addressList = {};
    this.addressList.address = {};
    const obj = {
      userId: data.clientId,
      userType: 2
    };
    this.custumService.getAddressList(obj).subscribe(
      responseData => {
        console.log(responseData);
        console.log('address stored', responseData);
        this.addressList = this.firstHolderContact;
        this.addressList.address = responseData[0];
        this.getdataForm(this.addressList);
      },
      err => {
        this.addressList = {};
      }
    );
  }

  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      };
    }
    this.contactDetails = this.fb.group({
      email: [(!data) ? '' : data.email, [Validators.required]],
      aadharNumber: [(!data) ? '' : data.aadharNumber, [Validators.required]],
      mobileNo: [!data ? '' : data.mobileNo, [Validators.required]],
      address1: [!data.address ? data.address1 : (data.address.address1) ?
        data.address.address1 : data.address.address1, [Validators.required]],
      address2: [!data.address ? data.address2 : (data.address.address2) ?
        data.address.address2 : data.address.address2, [Validators.required]],
      pinCode: [!data.address ? data.pinCode : data.address.pinCode, [Validators.required]],
      city: [!data.address ? data.city : data.address.city, [Validators.required]],
      state: [!data.address ? data.state : data.address.state, [Validators.required]],
      country: [!data.address ? data.country : data.address.country, [Validators.required]],
      address: [!data.address ? data.address : data.address],
    });
  }

  getFormControl(): any {
    return this.contactDetails.controls;
  }

  openBankDetails(data) {
    const subscription = this.processTransactionService.openBank(data).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  openPersonalDetails() {
    const subscription = this.processTransactionService.openPersonal(this.inputData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  getPostalPin(value) {
    this.isLoading = true;
    const obj = {
      zipCode: value
    };
    console.log(value, 'check value');
    if (value != '') {
      this.postalService.getPostalPin(value).subscribe(data => {
        console.log('postal 121221', data);
        this.PinData(data);
      });
    } else {
      this.pinInvalid = false;
    }
  }

  PinData(data) {
    this.isLoading = false;

    if (data[0].Status == 'Error') {
      this.pinInvalid = true;

      this.getFormControl().pincode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue('');
      this.getFormControl().country.setValue('');
      this.getFormControl().state.setValue('');

    } else {
      this.getFormControl().city.setValue(data[0].PostOffice[0].Region);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].State);
      this.pinInvalid = false;
    }
  }

  reset() {
    this.contactDetails.reset();
  }

  SendToForm(flag) {
    if (flag == true) {
      this.doneData = true;
    }
    this.saveContactDetails();
    if (this.firstHolderContact && this.firstHolderContact.email) {
      this.contactDetails.setValue(this.getObjForForm(this.firstHolderContact));
    } else {
    }

    this.obj1 = [];
    this.firstHolderContact = (this.firstHolderContact) ? this.firstHolderContact : [];
    this.obj1.push(this.firstHolderContact);
    // this.obj1.push(this.secondHolderContact);
    // this.obj1.push(this.thirdHolderContact);
    if (flag == true) {
      if (!this.firstHolderContact.address) {
        this.firstHolderContact = this.setObj(this.firstHolderContact);
      }
      this.sendObj.firstHolder = Object.assign({}, this.list.firstHolder, this.firstHolderContact);
      this.sendObj.holderList = this.inputData.holderList;
      this.sendObj.bankDetailList = this.inputData.bankDetailList;
      this.sendObj.nomineeList = this.inputData.nomineeList;
      this.sendObj.fatcaDetail = this.inputData.fatcaDetail;
      this.sendObj.generalDetails = this.inputData.generalDetails;
      this.sendObj.clientData = this.clientData;
      this.openBankDetails(this.sendObj);
    }
  }

  getObjForForm(holderValue) {
    return {
      email: holderValue.email,
      aadharNumber: holderValue.aadharNumber,
      mobileNo: holderValue.mobileNo,
      address1: holderValue.address1,
      address2: holderValue.address2,
      pinCode: holderValue.pinCode,
      city: holderValue.city,
      state: holderValue.state,
      country: holderValue.country,
      address: holderValue.address
    };
  }

  setObj(holder) {

    const value = {
      email: holder.email,
      aadharNumber: holder.aadharNumber,
      mobileNo: holder.mobileNo,
      phoneNo: holder.phoneNo,
      address: null
    };
    value.address = {

      address1: holder.address1,
      address2: holder.address2,
      pinCode: holder.pinCode,
      city: holder.city,
      state: holder.state,
      country: holder.country,
    };
    return value;
  }

  saveContactDetails() {
    if (this.contactDetails.invalid) {
      for (const element in this.contactDetails.controls) {
        console.log(element);
        if (this.contactDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.contactDetails.controls[element].markAsTouched();
        }
      }
    } else {
      Object.assign(this.firstHolderContact, this.contactDetails.value);
    }
  }


}
