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
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-contact-details-inn',
  templateUrl: './contact-details-inn.component.html',
  styleUrls: ['./contact-details-inn.component.scss']
})

export class ContactDetailsInnComponent implements OnInit {

  // overseasHolderContact: any;

  countryList;
  filterCountryName: Observable<any[]>;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private postalService: PostalService,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
              public eventService: EventService, public processTransaction: ProcessTransactionService,
              private peopleService: PeopleService) {
  }

  addressTypeLabel = 'Permanent Address Details';
  validatorType = ValidatorType;
  isLoading = false;
  pinInvalid = false;
  contactDetails: any;
  formId = 'first';
  inputData: any;
  firstHolderContact: any;
  secondHolderContact: any;
  thirdHolderContact: any;

  get data() {
    return this.inputData;
  }

  doneData: any = {};

  @Input()
  set data(data) {
    this.inputData = data;
    // this.doneData.nominee = true;
    // this.doneData.bank = true;
    // this.doneData.contact = true;
    this.doneData.personal = true;
    // this.doneData.fatca = false;
    console.log('Data in contact detail : ', data);
    if (data && data.holderList) {
      this.firstHolderContact = data.holderList[0];
      this.setDataForm(this.formId, this.firstHolderContact);

      if (data.holderList.length > 1) {
        this.secondHolderContact = data.holderList[1];
      }
      if (data.holderList.length > 2) {
        this.thirdHolderContact = data.holderList[2];
      }
    }
    if (!this.firstHolderContact.address || !this.firstHolderContact.address.address1) {
      this.getAddressList(this.firstHolderContact);
    }
  }

  obj1: any;
  sendObj: any;
  changedValue: string;
  isdCodes: Array<any> = [];

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  addressList: any;

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRef: ViewContainerRef;

  ngOnInit() {
    this.getIsdCodesData();
    const value = {};
    this.processTransaction.getCountryCodeList().subscribe(responseValue => {
      this.countryList = responseValue;
    });
    if (this.firstHolderContact) {
      this.setDataForm(this.formId, this.firstHolderContact);
    } else {
      /*this.setDataForm(this.formId, null);
      if (this.clientData) {
        this.getAddressList(this.clientData);
      }*/
    }
    this.sendObj = {...this.inputData};
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
    if (data.clientId || data.familyMemberId) {
      const obj = {
        userId: data.clientId && data.clientId > 0 ? data.clientId : data.familyMemberId,
        userType: data.userType
      };
      this.custumService.getAddressList(obj).subscribe(
        responseData => {
          data.address = responseData[0];
          this.setDataForm(this.formId, data);
        },
        err => {
        }
      );
    }

  }

  setDataForm(formId, data) {
    if (!data) {
      data = {
        address: {},
        foreignAddress: {}
      };
    }
    let address;
    if (formId == 'first') {
      address = data.address;
    } else {
      address = data.foreignAddress;
    }
    if (!address) {
      address = {};
    }
    this.contactDetails = this.fb.group({
      email: [(!data) ? '' : data.email, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      aadharNumber: [(!data) ? '' : data.aadharNumber, [Validators.required, Validators.pattern(ValidatorType.ADHAAR)]],
      mobileNo: [!data ? '' : data.mobileNo, [Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)]],
      foreignMobileNo: [!data ? '' : data.foreignMobileNo,
        this.inputData.taxStatus == '21' ? [Validators.required] : []],
      address1: [(address.address1), [Validators.required]],
      address2: [(address.address2), [Validators.required]],
      pinCode: [address.pinCode, [Validators.required]],
      city: [address.city, [Validators.required]],
      state: [address.state, [Validators.required]],
      country: [address.country, [Validators.required]],
      address: [address],
    });

    this.contactDetails.controls.country.valueChanges.subscribe(newValue => {
      this.filterCountryName = new Observable().pipe(startWith(''), map(value => {
        return this.processTransaction.filterName(newValue, this.countryList);
      }));
    });
  }

  setSecondaryDataForm(formId, data) {

    if (!data) {
      data = {};
    }
    this.contactDetails = this.fb.group({
      email: [(!data) ? '' : data.email, [Validators.required]],
      aadharNumber: [(!data) ? '' : data.aadharNumber, [Validators.required]],
      mobileNo: [!data ? '' : data.mobileNo, [Validators.required]]
    });
  }

  getFormControl(): any {
    return this.contactDetails.controls;
  }

  openBankDetails(data) {
    const subscription = this.processTransaction.openBank(data).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  openPersonalDetails() {
    const subscription = this.processTransaction.openPersonal(this.inputData).subscribe(
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
    if (value != '') {
      this.postalService.getPostalPin(value).subscribe(data => {
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

  SendToForm(formId, flag) {

    if (this.saveContactDetails(this.formId)) {
      this.formId = formId;
      if (this.formId == 'second') {
        this.setSecondaryDataForm(formId, this.secondHolderContact);
      } else if (this.formId == 'third') {
        this.setSecondaryDataForm(formId, this.thirdHolderContact);
      } else {
        this.setDataForm(formId, this.firstHolderContact);
      }
    } else {
      return;
    }


    if (flag == true) {
      this.obj1 = [];
      this.firstHolderContact = (this.firstHolderContact) ? this.firstHolderContact : [];
      this.obj1.push(this.firstHolderContact);
      if (this.validateSecondaryObject(this.secondHolderContact)) {
        this.obj1.push(this.secondHolderContact);
      } else if (this.secondHolderContact) {
        this.eventService.openSnackBar('Please fill second holder details');
        return;
      }
      if (this.validateSecondaryObject(this.thirdHolderContact)) {
        this.obj1.push(this.thirdHolderContact);
      } else if (this.thirdHolderContact) {
        this.eventService.openSnackBar('Please fill third holder details');
        return;
      }
      if (this.inputData.taxStatus == '21') {
        if (!this.firstHolderContact || !this.firstHolderContact.address ||
          !this.firstHolderContact.address.address1 || !this.firstHolderContact.foreignAddress ||
          !this.firstHolderContact.foreignAddress.address1) {
          this.eventService.openSnackBar('Both address are compulsory');
          return;
        }
      }
      // this.sendObj.firstHolder = Object.assign({}, this.list.firstHolder, this.firstHolderContact);
      this.sendObj.holderList = this.obj1;
      this.openBankDetails(this.sendObj);
    }
  }

  validateSecondaryObject(obj) {
    if (obj && obj.email && obj.mobileNo && obj.aadharNumber) {
      return true;
    } else {
      return false;
    }
  }

  setObject(formId, holder, formValue) {

    holder = {
      ...holder,
      email: formValue.email,
      aadharNumber: formValue.aadharNumber,
      mobileNo: formValue.mobileNo,
      foreignMobileNo: formValue.foreignMobileNo,
      phoneNo: formValue.phoneNo,
    };
    if (formId == 'overseas') {
      holder.foreignAddress = {
        address1: formValue.address1,
        address2: formValue.address2,
        pinCode: formValue.pinCode,
        city: formValue.city,
        state: formValue.state,
        country: formValue.country,
      };
      this.firstHolderContact = holder;
    } else if (formId == 'first') {
      holder.address = {

        address1: formValue.address1,
        address2: formValue.address2,
        pinCode: formValue.pinCode,
        city: formValue.city,
        state: formValue.state,
        country: formValue.country,
      };
      this.firstHolderContact = holder;
    } else if (formId == 'second') {
      this.secondHolderContact = holder;
    } else if (formId == 'third') {
      this.thirdHolderContact = holder;
    }
    return holder;
  }

  saveContactDetails(formId) {
    if (this.contactDetails.invalid) {
      for (const element in this.contactDetails.controls) {
        if (this.contactDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.contactDetails.controls[element].markAsTouched();
        }
      }
      return false;
    } else {
      if (formId == 'second') {
        this.setObject(formId, this.secondHolderContact, this.contactDetails.value);
      } else if (formId == 'third') {
        this.setObject(formId, this.thirdHolderContact, this.contactDetails.value);
      } else {
        this.setObject(formId, this.firstHolderContact, this.contactDetails.value);
      }

      return true;
    }
  }


}
