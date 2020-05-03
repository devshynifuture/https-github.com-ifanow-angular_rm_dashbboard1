import { Component, OnInit, Input, ViewChildren, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { NomineeDetailsIinComponent } from '../nominee-details-iin/nominee-details-iin.component';
import { PostalService } from 'src/app/services/postal.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';
import { ContactDetailsInnComponent } from '../contact-details-inn/contact-details-inn.component';
import { LeftSideInnUccListComponent } from '../left-side-inn-ucc-list/left-side-inn-ucc-list.component';
import { MatInput } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';

@Component({
  selector: 'app-bank-details-iin',
  templateUrl: './bank-details-iin.component.html',
  styleUrls: ['./bank-details-iin.component.scss']
})
export class BankDetailsIINComponent implements OnInit {
  validatorType = ValidatorType
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  bankDetails: any;
  inputData: any;
  holdingList: any;
  bankDetailList: any;
  holder = {
    type: 'first',
    data: ''
  }
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
  genralDetails: any;
  doneData: any;
  allData: any;
  fieldFlag = 'client';
  clientId: any;
  bankList: any;
  isLoading = false
  isIfsc: boolean = false;
  clientData: any;
  holderList: any;
  formId: any;
  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private postalService: PostalService,
    private processTransaction: ProcessTransactionService,
    private cusService: CustomerService,
    private subService: SubscriptionService,
    private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
    this.clientId = AuthService.getClientId()
  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.clientData = data.clientData
    console.log('all data in bank', this.inputData)
    this.allData = data
    this.holdingList = data
    this.doneData = {}
    this.doneData.contact = true
    this.doneData.personal = true
    this.doneData.bank = false
    this.genralDetails = data.generalDetails
    if (data && data.bankDetailList) {
      this.firstHolderBank = data.bankDetailList[0]
      this.secondHolderBank = data.bankDetailList[1]
      this.thirdHolderBank = data.bankDetailList[2]
      this.genralDetails = data.generalDetails
      this.getdataForm(this.firstHolderBank);
    }else{
      if (this.clientData && !this.firstHolderBank) {
        this.getBankList(this.clientData)
      }
    }
    console.log('#######', this.holdingList)
  }

  get data() {
    return this.inputData;
  }
  // @Output() changedValue = new EventEmitter();
  ngOnInit() {
    if (this.firstHolderBank) {
    } else {
      this.getdataForm('')
    }
    this.changedValue = ''
    this.bank = []
    this.sendObj = []
    this.temp = []
    if (this.holdingList.firstHolder) {
      this.temp.push(this.holdingList.firstHolder)
      this.temp.push(this.holdingList.secondHolder)
      this.temp.push(this.holdingList.thirdHolder)
    }else{
      this.temp.push(this.holdingList.holderList[0])
      this.temp.push(this.holdingList.holderList[1])
      this.temp.push(this.holdingList.holderList[2])
    }
  }
  close() {
    this.changedValue = 'close'
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getBankList(data) {
    let obj =
    {
      userId: (data.userType == 2) ? data.clientId : (data.userType == 3) ? data.familyMemberId : data.clientId,
      userType: data.userType
    }
    this.cusService.getBankList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.bankList = data;
          console.log('bank == ', this.bankList)
          this.firstHolderBank = (this.bankList[0]) ? this.bankList[0] : []
          this.getdataForm(this.firstHolderBank)
        }
      },
      err => {
        this.bankList = {};
      }
    )
  }
  getHolderList(data) {
    console.log(data);
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
    console.log('ifsc 121221', obj);
    if (ifsc != '') {
      this.isIfsc = true;
      this.subService.getBankAddress(obj).subscribe(data => {
        console.log('postal 121221', data);
       this.bankData(data)
      },
        err => {
          console.log(err, 'error internet');
          this.isIfsc = false;
        });
    }
  }
  bankData(data) {
    console.log(data, 'bank data');
    this.isIfsc = false;
    let address1, address2, pincode, adderessData;
    if (data.address) {
      adderessData = data.address.trim();
      pincode = adderessData.match(/\d/g);
      pincode = pincode.join("");
      pincode = pincode.substring(pincode.length - 6, pincode.length)
      adderessData = adderessData.replace(pincode, '');
      let addressMidLength = adderessData.length / 2;
      address1 = adderessData.substring(0, addressMidLength);
      address2 = adderessData.substring(addressMidLength, adderessData.length);
      address1 = address1.concat(address2.substr(0, address2.indexOf(' ')));
      address2 = address2.concat(address2.substr(address2.indexOf(' '), address2.length))
      // pincode = pincode.join("");
    }
    (data == undefined) ? data = {} : '';
    this.bankDetails.get('bankName').setValue(data.bank);
    this.bankDetails.get('city').setValue(data.city);
    this.bankDetails.get('state').setValue(data.state);
    this.bankDetails.get('branchName').setValue(data.centre);
    this.bankDetails.get('country').setValue('India');
    this.bankDetails.get('address1').setValue(adderessData);
    this.bankDetails.get('address2').setValue(address2);
    this.bankDetails.get('pinCode').setValue(pincode)
  }
  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      }
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
    this.bankDetails = this.fb.group({
      ifscCode: [(!data) ? '' : data.ifscCode, [Validators.required]],
      bankName: [!data ? '' : data.bankName, [Validators.required]],
      micrCode: [!data ? '' : data.micrCode, [Validators.required]],
      accountNumber: [!data ? '' : data.accountNumber, [Validators.required]],
      // accountType: [!data ? '1' : (data.accountType == 'SB')?'1':'2', [Validators.required]],
      accountType: [!data ? '1' : (data.accountType == '1' || data.accountType == 'SB') ? '1': '2', [Validators.required]],
      branchCode: [!data ? '' : (data.branchCode) ? data.branchCode : data.bankId, [Validators.required]],
      branchName: [!data ? '' : data.branchName, [Validators.required]],
      paymentMode: [!data ? '' : data.paymentMode, [Validators.required]],
      address1: [!data.address ? '' : data.address.address1, [Validators.required]],
      address2: [!data.address ? '' : data.address.address2, [Validators.required]],
      pinCode: [!data.address ? '' : data.address.pinCode, [Validators.required]],
      city: [!data.address ? '' : data.address.city, [Validators.required]],
      state: [!data.address ? '' : data.address.state, [Validators.required]],
      country: [!data.address ? '' : data.address.country, [Validators.required]],
      branchProof: [!data.address ? '' : data.address.branchProof, [Validators.required]],
      bankMandate: [!data.address ? '1' :( data.address.bankMandate) ?  data.address.bankMandate + '' : '1', [Validators.required]],
      mandateDate: [!data.address ? '' : data.address.mandateDate, [Validators.required]],
      mandateAmount: [!data.address ? '' : data.address.mandateAmount, [Validators.required]],
    });
    // if (data.bankMandate == undefined && data.accountType == undefined) {

    //   this.bankDetails.controls.accountType.setValue('1')
    //   this.bankDetails.controls.bankMandate.setValue('1')
    // }
  }
  getFormControl(): any {
    return this.bankDetails.controls;
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
  pinInvalid: boolean = false;
  openContactDetails() {
    var data = this.inputData
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
    this.isLoading = true
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
    this.isLoading = false

    if (data[0].Status == "Error") {
      this.pinInvalid = true;

      this.getFormControl().pinCode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue("");
      this.getFormControl().country.setValue("");
      this.getFormControl().state.setValue("");

    }
    else {
      this.getFormControl().city.setValue(data[0].PostOffice[0].Region);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].Circle);
      this.pinInvalid = false;
    }
  }
  reset() {
    this.bankDetails.reset();
  }
  selectPaymentMode(value){
    console.log(value)
  }
   
  setValueFun(value){
    this.bankDetails.controls.ifscCode.setValue(value.ifscCode);
    this.bankDetails.controls.bankName.setValue(value.bankName);
    this.bankDetails.controls.micrCode.setValue(value.micrCode);
    this.bankDetails.controls.accountNumber.setValue(value.accountNumber);
    this.bankDetails.controls.accountType.setValue(value.accountType);
    this.bankDetails.controls.branchCode.setValue(value.branchCode);
    this.bankDetails.controls.branchName.setValue(value.branchName);
    this.bankDetails.controls.paymentMode.setValue(value.paymentMode);
    this.bankDetails.controls.address1.setValue(value.address.address1);
    this.bankDetails.controls.address2.setValue(value.address.address2);
    this.bankDetails.controls.pinCode.setValue(value.address.pinCode);
     this.bankDetails.controls.city.setValue(value.address.city);
     this.bankDetails.controls.state.setValue(value.address.state);
     this.bankDetails.controls.country.setValue(value.address.country);
     this.bankDetails.controls.branchProof.setValue(value.address.branchProof);
     this.bankDetails.controls.bankMandate.setValue(value.address.bankMandate);
     this.bankDetails.controls.mandateDate.setValue(value.address.mandateDate);
     this.bankDetails.controls.mandateAmount.setValue(value.address.mandateAmount);
     
  }
  SendToForm(value, flag) {
    this.formId = value
    if (value == 'first') {
      this.saveBankDetails(value);
      if (this.firstHolderBank) {
        this.holder.type = value;
        this.setValueFun(this.firstHolderBank)
      } else {
        return;
      }
    }
    else if (value == 'second') {
      this.saveBankDetails(value);
      if (this.secondHolderBank) {
        this.holder.type = value;
        this.secondHolderBank = (this.bankList[1]) ? this.bankList[1] : []
        this.setValueFun(this.secondHolderBank)
      } else {
        this.reset();
      }
    }
    else if (value == 'third') {
      this.saveBankDetails(value);
      if (this.thirdHolderBank) {
        this.holder.type = value;
        this.thirdHolderBank = (this.bankList[2]) ? this.bankList[2] : []
        this.setValueFun(this.thirdHolderBank)
      } else {
        this.reset();
      };
    } else {
      this.saveBankDetails(value);
    }
    this.obj1 = []
    this.firstHolderBank = (this.firstHolderBank) ? this.firstHolderBank : []
    this.secondHolderBank = (this.secondHolderBank) ? this.secondHolderBank : []
    this.thirdHolderBank = (this.thirdHolderBank) ? this.thirdHolderBank : []
    this.obj1.push(this.firstHolderBank)
    this.obj1.push(this.secondHolderBank)
    this.obj1.push(this.thirdHolderBank)
    if (flag == true) {
      this.doneData = true
      console.log('contact details', this.obj1)
      const value = {}
      this.obj1.forEach(element => {
        if (!element.address) {
          this.getObj = this.setObj(element, value)
          this.bank.push(this.getObj)
        }else{
          element.accountType = (element.accountType == '1')?'SB': (element.accountType == '2')? 'CA':'SB';
          element.paymentMode = this.bankDetails.controls.paymentMode.value,
          this.bank.push(element)
        }
      });
      var temp1 = this.holdingList.generalDetails;
      this.sendObj = {
        ownerName: this.genralDetails.ownerName,
        holdingType: this.genralDetails.holdingNature,
        taxStatus: this.genralDetails.taxStatus,
        familyMemberId: this.genralDetails.familyMemberId,
        clientId: this.genralDetails.clientId,
        advisorId: this.genralDetails.advisorId,
        paymentMode:this.bankDetails.controls.paymentMode.value,
        holderList: this.temp,
        bankDetailList: this.bank,
        nomineeList: this.inputData.nomineeList,
        fatcaDetail: this.inputData.fatcaDetail,
        generalDetails: this.genralDetails,
        clientData: this.clientData
      }
      console.log('##### bank ######', this.sendObj)
      this.openNomineeDetails(this.sendObj)
    }
  }
  setObj(holder, value) {
    value = {
      ifscCode: holder.ifscCode,
      accountNumber: holder.accountNumber,
      accountType: (holder.accountType == '1')?'SB': (holder.accountType == '2')? 'CA':'SB',
      bankName: holder.bankName,
      branchName: holder.branchName,
      branchCode: holder.branchCode,
      micrCode: holder.micrCode,
      firstHolder: holder.firstHolder,
      paymentMode : this.bankDetails.controls.paymentMode.value,
      defaultFlag: 1
    }
    value.address = {
      address1: holder.address1,
      address2: holder.address2,
      pinCode: holder.pinCode,
      state: holder.state,
      city: holder.city,
      country: holder.country,
      branchProof: holder.branchProof,
      bankMandate: holder.bankMandate,
      mandateDate: holder.mandateDate,
      mandateAmount: holder.mandateAmount,
    }
    return value;
  }
  saveBankDetails(value) {
    if (this.bankDetails.invalid) {
      for (let element in this.bankDetails.controls) {
        console.log(element)
        if (this.bankDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.bankDetails.controls[element].markAsTouched();
        }
      }
    } else {
      this.setEditHolder(this.holder.type, value)
    }
  }
  setEditHolder(type, value) {
    switch (type) {
      case "first":
        this.getObj = this.setObj(this.bankDetails.value, value)
        this.firstHolderBank = this.getObj;
        this.holder.type = value;
        break;

      case "second":
        this.getObj = this.setObj(this.bankDetails.value, value)
        this.secondHolderBank = this.getObj;
        this.holder.type = value;
        break;

      case "third":
        this.getObj = this.setObj(this.bankDetails.value, value)
        this.thirdHolderBank =  this.getObj;
        this.holder.type = value;
        break;

    }
  }
}
