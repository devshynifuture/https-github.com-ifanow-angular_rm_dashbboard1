import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { NomineeDetailsIinComponent } from '../nominee-details-iin/nominee-details-iin.component';
import { PostalService } from 'src/app/services/postal.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';
import { ContactDetailsInnComponent } from '../contact-details-inn/contact-details-inn.component';
import { MatInput } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-bank-details-iin',
  templateUrl: './bank-details-iin.component.html',
  styleUrls: ['./bank-details-iin.component.scss']
})
export class BankDetailsIINComponent implements OnInit {
  bankListArr: any;
  activeDetailsClass = 'first';

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private postalService: PostalService,
    private processTransaction: ProcessTransactionService,
    private cusService: CustomerService,
    private subService: SubscriptionService,
    private enumService: EnumServiceService,
    private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
    this.clientId = AuthService.getClientId();
  }

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('Data in bank detail : ', data);
    this.clientData = data.clientData;
    this.allData = data;
    this.holdingList = data;
    this.doneData = {};
    this.doneData.contact = true;
    this.doneData.personal = true;
    this.doneData.bank = false;
    this.generalDetails = data.generalDetails;
    if (data && data.bankDetailList) {
      this.firstHolderBank = data.bankDetailList[0];
      this.secondHolderBank = data.bankDetailList[1];
      this.thirdHolderBank = data.bankDetailList[2];
      this.generalDetails = data.generalDetails;
      this.getdataForm(this.firstHolderBank);
    } else {

    }
    if (this.clientData) {
      this.getBankList(this.clientData, !(!!this.firstHolderBank));
    }
  }

  get data() {
    return this.inputData;
  }

  validatorType = ValidatorType;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  bankDetailsForm: any;
  inputData: any;
  holdingList: any;
  bankDetailList: any;
  obj1: any[];
  sendObj: any;
  contacts: any;
  getObj: any;
  thirdHolderBank: any;
  secondHolderBank: any;
  firstHolderBank: any;
  bank: any;
  temp: any;
  changedValue: string;
  generalDetails: any;
  doneData: any;
  allData: any;
  fieldFlag = 'client';
  clientId: any;
  bankList: any = [];
  isLoading = false;
  isIfsc = false;
  clientData: any;
  holderList: any;
  formId: any = 'first';
  maxDate = new Date();

  pinInvalid = false;

  // @Output() changedValue = new EventEmitter();
  ngOnInit() {
    if (this.firstHolderBank) {
    } else {
      this.getdataForm('');
    }
    this.changedValue = '';
    this.bank = [];
    this.sendObj = [];
  }

  close() {
    this.changedValue = 'close';
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }

  getBankList(data, shouldSetValue) {
    const obj = {
      userId: (data.userType == 2) ? data.clientId : (data.userType == 3) ? data.familyMemberId : data.clientId,
      userType: data.userType
    };
    this.cusService.getBankList(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          data.forEach(singleBank => {
            singleBank.bankACNo = singleBank.bankName + '-' +
              singleBank.accountNumber.substring(singleBank.accountNumber.length - 5);
          });
          this.bankList = data;
          if (shouldSetValue) {
            this.firstHolderBank = this.bankList[0];
            this.getdataForm(this.firstHolderBank);
          }
        } else {
          this.bankList = [];
        }
      },
      err => {
        this.bankList = [];
      }
    );
  }

  selectedBank(bank) {
    this.getdataForm(bank);
  }

  getHolderList(data) {
    this.holderList = data;
  }

  toUpperCase(formControl, event) {
    this.utils.toUpperCase(formControl, event);
    if (event.target.value.length == 11) {
      this.getBankAddress(event.target.value);
      return;
    }
  }

  getBankAddress(ifsc) {
    const obj = {
      ifsc
    };
    if (ifsc != '') {
      this.isIfsc = true;
      this.subService.getBankAddress(obj).subscribe(data => {
        this.bankData(data);
      },
        err => {
          this.isIfsc = false;
        });
    }
  }

  bankData(data) {
    this.isIfsc = false;
    let address1, address2, pincode, adderessData;
    if (data.address) {
      adderessData = data.address.trim();
      pincode = adderessData.match(/\d/g);
      pincode = pincode.join('');
      pincode = pincode.substring(pincode.length - 6, pincode.length);
      adderessData = adderessData.replace(pincode, '');
      const addressMidLength = adderessData.length / 2;
      address1 = adderessData.substring(0, addressMidLength);
      address2 = adderessData.substring(addressMidLength, adderessData.length);
      address1 = address1.concat(address2.substr(0, address2.indexOf(' ')));
      address2 = address2.concat(address2.substr(address2.indexOf(' '), address2.length));
      // pincode = pincode.join("");
    }
    (data == undefined) ? data = {} : '';
    this.bankDetailsForm.get('bankName').setValue(data.bank);
    this.bankDetailsForm.get('city').setValue(data.city);
    this.bankDetailsForm.get('state').setValue(data.state);
    this.bankDetailsForm.get('branchName').setValue(data.centre);
    this.bankDetailsForm.get('country').setValue('India');
    this.bankDetailsForm.get('address1').setValue(adderessData);
    this.bankDetailsForm.get('address2').setValue(address2);
    this.bankDetailsForm.get('pinCode').setValue(pincode);
  }

  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      };
    }
    const holderList = [];
    if (this.holderList) {
      this.holderList.controls.forEach(element => {
        holderList.push({
          name: element.get('name').value,
          id: element.get('id').value,
        });
      });
    }
    this.bankDetailsForm = this.fb.group({
      ifscCode: [(!data) ? '' : data.ifscCode, [Validators.required]],
      bankName: [!data ? '' : data.bankName, [Validators.required]],
      bankACNo: [(data.bankACNo) ? data.bankACNo : data.bankName],
      micrNo: [!data ? '' : data.micrNo, [Validators.required]],
      accountNumber: [!data ? '' : data.accountNumber, [Validators.required]],
      accountType: [this.inputData.taxStatus == '21' ? '3' : data.accountType ? parseInt(data.accountType) : '1', [Validators.required]],
      //branchCode: [!data ? '' : (data.branchCode) ? data.branchCode : data.bankId, [Validators.required]],
      branchName: [!data ? '' : data.branchName, [Validators.required]],
      paymentMode: [(!data) ? '02' : (data.paymentMode) ? data.paymentMode : '02', [Validators.required]],
      address1: [!data.address ? '' : data.address.address1, [Validators.required]],
      address2: [!data.address ? '' : data.address.address2, [Validators.required]],
      pinCode: [!data.address ? '' : data.address.pinCode, [Validators.required]],
      city: [!data.address ? '' : data.address.city, [Validators.required]],
      state: [!data.address ? '' : data.address.state, [Validators.required]],
      country: [!data.address ? '' : data.address.country, [Validators.required]],
      userBankMappingId: [data.userBankMappingId],
      bankId: [data.bankId],
      addressId: [!data.address ? null : data.address.addressId]
    });
  }

  getFormControl(): any {
    return this.bankDetailsForm.controls;
  }

  openNomineeDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: NomineeDetailsIinComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  openContactDetails() {
    const data = this.inputData;
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: ContactDetailsInnComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
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

      this.getFormControl().pinCode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue('');
      this.getFormControl().country.setValue('');
      this.getFormControl().state.setValue('');

    } else {
      this.getFormControl().city.setValue(data[0].PostOffice[0].Region);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].Circle);
      this.pinInvalid = false;
    }
  }

  reset() {
    this.bankDetailsForm.reset();
  }

  selectPaymentMode(value) {
  }

  setValueFun(value) {
    this.bankDetailsForm.controls.ifscCode.setValue(value.ifscCode);
    this.bankDetailsForm.controls.bankName.setValue(value.bankName);
    this.bankDetailsForm.controls.bankACNo.setValue(value.bankACNo);
    this.bankDetailsForm.controls.micrNo.setValue(value.micrNo);
    this.bankDetailsForm.controls.accountNumber.setValue(value.accountNumber);
    this.bankDetailsForm.controls.accountType.setValue(parseInt(value.accountType));
    //  this.bankDetailsForm.controls.branchCode.setValue(value.branchCode);
    this.bankDetailsForm.controls.branchName.setValue(value.branchName);
    this.bankDetailsForm.controls.paymentMode.setValue(value.paymentMode ? value.paymentMode : '02');
    if (value.address) {
      this.bankDetailsForm.controls.address1.setValue(value.address.address1);
      this.bankDetailsForm.controls.address2.setValue(value.address.address2);
      this.bankDetailsForm.controls.pinCode.setValue(value.address.pinCode);
      this.bankDetailsForm.controls.city.setValue(value.address.city);
      this.bankDetailsForm.controls.state.setValue(value.address.state);
      this.bankDetailsForm.controls.country.setValue(value.address.country);
    } else {
      this.bankDetailsForm.controls.address1.reset();
      this.bankDetailsForm.controls.address2.reset();
      this.bankDetailsForm.controls.pinCode.reset();
      this.bankDetailsForm.controls.city.reset();
      this.bankDetailsForm.controls.state.reset();
      this.bankDetailsForm.controls.country.reset();
    }
    // this.bankDetails.controls.branchProof.setValue(value.address.branchProof);
    //  this.bankDetails.controls.bankMandate.setValue(value.address.bankMandate);
    //  this.bankDetails.controls.mandateDate.setValue(value.address.mandateDate);
    //  this.bankDetails.controls.mandateAmount.setValue(value.address.mandateAmount);

  }

  SendToForm(value, flag) {
    this.activeDetailsClass = value;
    if (value == 'first') {
      this.saveBankDetails(value);
      this.formId = value;
      if (this.firstHolderBank) {
        this.setValueFun(this.firstHolderBank);
      } else {
        return;
      }
      this.formId = value;
    } else if (value == 'second') {
      if (this.secondHolderBank && this.secondHolderBank.bankName) {
        this.saveBankDetails(value);
        this.setValueFun(this.secondHolderBank);
      } else if (this.bankList && this.bankList[1] && this.bankList[1].bankName) {
        this.secondHolderBank = this.bankList[1];
        this.saveBankDetails(value);
        this.setValueFun(this.secondHolderBank);
      } else {
        this.reset();
      }
      this.formId = value;
    } else if (value == 'third') {
      if (this.thirdHolderBank && this.thirdHolderBank.bankName) {
        this.formId = value;
        this.saveBankDetails(value);
        this.setValueFun(this.thirdHolderBank);
      } else if (this.bankList && this.bankList[2] && this.bankList[2].bankName) {
        this.thirdHolderBank = this.bankList[2];
        this.saveBankDetails(value);
        this.setValueFun(this.thirdHolderBank);
      } else {
        this.reset();
      }
      this.formId = value;
    } else {
      this.saveBankDetails(value);
    }
    this.obj1 = [];
    this.obj1.push(this.firstHolderBank);
    if (this.secondHolderBank && this.secondHolderBank.validated) {
      this.obj1.push(this.secondHolderBank);
    }
    if (this.thirdHolderBank && this.thirdHolderBank.validated) {
      this.obj1.push(this.thirdHolderBank);
    }
    if (flag == true) {
      this.doneData = true;
      value = 'first';
      this.obj1.forEach(element => {
        if (!element.address) {
          this.getObj = this.setObj(element, value);
          this.bank.push(this.getObj);
        } else {
          element.paymentMode = this.bankDetailsForm.controls.paymentMode.value;
          this.bank.push(element);
        }
        element.defaultFlag = value == 'first' ? 1 : 0;
        value = '';

      });
      this.sendObj = {
        ...this.inputData,
        paymentMode: this.bankDetailsForm.controls.paymentMode.value,
        bankDetailList: this.bank
      };
      this.openNomineeDetails(this.sendObj);
    }
  }

  setObj(holder, value) {
    value = {
      ifscCode: holder.ifscCode,
      accountNumber: holder.accountNumber,
      accountType: holder.accountType,
      bankName: holder.bankName,
      branchName: holder.branchName,
      bankACNo: holder.bankACNo,
      //   branchCode: holder.branchCode,
      micrNo: (holder.micrNo),
      firstHolder: holder.firstHolder,
      paymentMode: this.bankDetailsForm.controls.paymentMode.value,
      userBankMappingId: holder.userBankMappingId,
      bankId: holder.bankId,
      addressId: holder.addressId
    };
    value.address = {
      address1: holder.address1,
      address2: holder.address2,
      pinCode: holder.pinCode,
      state: holder.state,
      city: holder.city,
      country: holder.country,
      addressId: holder.addressId
      // branchProof: holder.branchProof,
      // bankMandate: holder.bankMandate,
      // mandateDate: holder.mandateDate,
      // mandateAmount: holder.mandateAmount,
    };
    return value;
  }

  saveBankDetails(value) {
    if (this.bankDetailsForm.invalid) {
      for (const element in this.bankDetailsForm.controls) {
        if (this.bankDetailsForm.get(element).invalid) {
          // this.inputs.find(input => !input.ngControl.valid).focus();
          this.bankDetailsForm.controls[element].markAsTouched();
        }
      }
      return false;
    } else {
      this.setEditHolder(this.formId, value);
      return true;
    }
  }

  setEditHolder(type, value) {
    switch (type) {
      case 'first':
        this.getObj = this.setObj(this.bankDetailsForm.value, value);
        this.firstHolderBank = this.getObj;
        this.firstHolderBank.validated = true;
        this.formId = value;
        break;

      case 'second':
        this.getObj = this.setObj(this.bankDetailsForm.value, value);
        this.secondHolderBank = this.getObj;
        this.secondHolderBank.validated = true;
        this.formId = value;
        break;

      case 'third':
        this.getObj = this.setObj(this.bankDetailsForm.value, value);
        this.thirdHolderBank = this.getObj;
        this.thirdHolderBank.validated = true;
        this.formId = value;
        break;
    }
  }
}
