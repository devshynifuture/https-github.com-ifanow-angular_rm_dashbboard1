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
  holder = {
    type: 'first',
    data: ''
  };
  isLoading = false;
  pinInvalid = false;
  contactDetails: any;
  inputData: any;
  holdingList: any;
  listHolders: any;
  list: any;
  firstHolderContact: any;
  secondHolderContact: any;
  thirdHolderContact: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private postalService: PostalService,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
              public eventService: EventService, private ProcessTransactionService: ProcessTransactionService,
              private peopleService: PeopleService) {
  }

  obj1: any;
  sendObj: any;
  getObj: void;
  contacts: any[];
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
      this.secondHolderContact = data.secondHolder;
      this.thirdHolderContact = data.thirdHolder;
      // this.getdataForm(this.firstHolderContact)
    } else if (data.holderList) {
      this.firstHolderContact = data.holderList[0];
      this.secondHolderContact = data.holderList[1];
      this.thirdHolderContact = data.holderList[2];
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
      if (this.firstHolderContact.address) {
        this.firstHolderContact.address = undefined;
      }
      this.getdataForm(this.firstHolderContact);
    } else {
      this.getdataForm('');
      if (this.clientData) {
        this.getAddressList(this.clientData);
      }
    }
    this.obj1 = [];
    this.sendObj = [];
    this.contacts = [];
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
      data => {
        console.log(data);
        console.log('address stored', data);
        this.addressList = this.firstHolderContact;
        this.addressList.address = data[0];
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
      panNumber: [!data ? '' : data.panNumber, [Validators.required]],
      clientName: [!data ? '' : data.clientName, [Validators.required]],
      // maidenName: [!data ? '' : data.maidenName, [Validators.required]],
      fatherName: [!data ? '' : data.fatherName, [Validators.required]],
      motherName: [!data ? '' : data.motherName, [Validators.required]],
      dob: [!data ? '' : data.dob, [Validators.required]],
      gender: [!data ? '' : data.gender, [Validators.required]],
      email: [(!data) ? '' : data.email, [Validators.required]],
      aadharNumber: [(!data) ? '' : data.aadharNumber, [Validators.required]],
      maritalStatus: [!data ? '' : data.maritalStatus, [Validators.required]],
      // isdCodeId: [!data ? '' : (data.isdCodeId) + "", [Validators.required]],
      mobileNo: [!data ? '' : data.mobileNo, [Validators.required]],
      address1: [!data.address ? data.address1 : (data.address.address1) ? data.address.address1 : data.address.address1, [Validators.required]],
      address2: [!data.address ? data.address2 : (data.address.address2) ? data.address.address2 : data.address.address2, [Validators.required]],
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
    const subscription = this.ProcessTransactionService.openBank(data).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  openPersonalDetails() {
    const subscription = this.ProcessTransactionService.openPersonal(this.inputData).subscribe(
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

  SendToForm(value, flag) {
    if (flag == true) {
      this.doneData = true;
    }
    if (value == 'first') {
      this.saveContactDetails(value);
      if (this.firstHolderContact && this.firstHolderContact.email) {
        this.holder.type = value;
        this.contactDetails.setValue(this.firstHolderContact);
      } else {
        return;
      }
    } else if (value == 'second') {
      this.saveContactDetails(value);
      if (this.secondHolderContact && this.secondHolderContact.email) {
        this.holder.type = value;
        this.contactDetails.setValue(this.secondHolderContact);
      } else {
        this.reset();
      }
    } else if (value == 'third') {
      this.saveContactDetails(value);
      if (this.thirdHolderContact && this.thirdHolderContact.email) {
        this.holder.type = value;
        this.contactDetails.setValue(this.thirdHolderContact);
      } else {
        this.reset();
      }
    } else {
      this.saveContactDetails(value);
    }

    this.obj1 = [];
    this.firstHolderContact = (this.firstHolderContact) ? this.firstHolderContact : [];
    this.secondHolderContact = (this.secondHolderContact) ? this.secondHolderContact : [];
    this.thirdHolderContact = (this.thirdHolderContact) ? this.thirdHolderContact : [];
    this.obj1.push(this.firstHolderContact);
    this.obj1.push(this.secondHolderContact);
    this.obj1.push(this.thirdHolderContact);
    if (flag == true) {
      const value = {};
      this.obj1.forEach(element => {
        if (!element.address) {
          this.getObj = this.setObj(element, value);
          this.contacts.push(this.getObj);
        } else {
          this.contacts.push(element);
        }
      });
      this.sendObj.firstHolder = Object.assign({}, this.list.firstHolder, this.contacts[0]);
      this.sendObj.secondHolder = Object.assign({}, this.list.secondHolder, this.contacts[1]);
      this.sendObj.thirdHolder = Object.assign({}, this.list.thirdHolder, this.contacts[2]);
      this.sendObj.holderList = this.inputData.holderList;
      this.sendObj.bankDetailList = this.inputData.bankDetailList;
      this.sendObj.nomineeList = this.inputData.nomineeList;
      this.sendObj.fatcaDetail = this.inputData.fatcaDetail;
      this.sendObj.generalDetails = this.inputData.generalDetails;
      this.sendObj.clientData = this.clientData;
      this.openBankDetails(this.sendObj);
    }
  }

  setObj(holder, value) {

    value = {
      email: holder.email,
      aadharNumber: holder.aadharNumber,
      mobileNo: holder.mobileNo,
      phoneNo: holder.phoneNo,
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

  saveContactDetails(value) {
    if (this.contactDetails.invalid) {
      for (const element in this.contactDetails.controls) {
        console.log(element);
        if (this.contactDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.contactDetails.controls[element].markAsTouched();
        }
      }
    } else {

      this.setEditHolder(this.holder.type, value);
    }
  }

  setEditHolder(type, value) {
    switch (type) {
      case 'first':
        this.firstHolderContact = this.contactDetails.value;
        this.holder.type = value;
        break;

      case 'second':
        this.secondHolderContact = this.contactDetails.value;
        this.holder.type = value;
        break;

      case 'third':
        this.thirdHolderContact = this.contactDetails.value;
        this.holder.type = value;
        break;

    }
  }
}
