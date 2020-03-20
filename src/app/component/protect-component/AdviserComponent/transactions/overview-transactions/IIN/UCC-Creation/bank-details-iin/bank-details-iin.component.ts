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
  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private postalService: PostalService,
    private processTransaction: ProcessTransactionService,
    private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
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
    }
    console.log('#######', this.holdingList)
  }

  get data() {
    return this.inputData;
  }
  // @Output() changedValue = new EventEmitter();
  ngOnInit() {
    if (this.firstHolderBank) {
      this.getdataForm(this.firstHolderBank)
    } else {
      this.getdataForm('')
    }
    this.changedValue = ''
    this.bank = []
    this.sendObj = []
    this.temp = []
    if (this.holdingList) {
      this.temp.push(this.holdingList.firstHolder)
      this.temp.push(this.holdingList.secondHolder)
      this.temp.push(this.holdingList.thirdHolder)
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
  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      }
    }
    this.bankDetails = this.fb.group({
      ifscCode: [(!data) ? '' : data.ifscCode, [Validators.required]],
      bankName: [!data ? '' : data.bankName, [Validators.required]],
      micrCode: [!data ? '' : data.micrCode, [Validators.required]],
      accountNumber: [!data ? '' : data.accountNumber, [Validators.required]],
      accountType: [!data ? '' : data.accountType, [Validators.required]],
      branchCode: [!data ? '' : data.branchCode, [Validators.required]],
      firstHolder: [!data ? '' : data.firstHolder, [Validators.required]],
      branchName: [!data ? '' : data.branchName, [Validators.required]],
      branchAdd1: [!data.address ? '' : data.address.address1, [Validators.required]],
      branchAdd2: [!data.address ? '' : data.address.address2, [Validators.required]],
      pinCode: [!data.address ? '' : data.address.pinCode, [Validators.required]],
      city: [!data.address ? '' : data.address.city, [Validators.required]],
      state: [!data.address ? '' : data.address.state, [Validators.required]],
      country: [!data.address ? '' : data.address.country, [Validators.required]],
      branchProof: [!data.address ? '' : data.address.branchProof, [Validators.required]],
      bankMandate: [!data.address ? '' : data.address.bankMandate, [Validators.required]],
      mandateDate: [!data.address ? '' : data.address.mandateDate, [Validators.required]],
      mandateAmount: [!data.address ? '' : data.address.mandateAmount, [Validators.required]],
    });
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
  SendToForm(value, flag) {
    if (value == 'first') {
      this.saveBankDetails(value);
      if (this.firstHolderBank) {
        this.holder.type = value;
        this.bankDetails.setValue(this.firstHolderBank);
      } else {
        return;
      }
    }
    else if (value == 'second') {
      this.saveBankDetails(value);
      if (this.secondHolderBank) {
        this.holder.type = value;
        this.bankDetails.setValue(this.secondHolderBank);
      } else {
        this.reset();
      }
    }
    else if (value == 'third') {
      this.saveBankDetails(value);
      if (this.thirdHolderBank) {
        this.holder.type = value;
        this.bankDetails.setValue(this.thirdHolderBank);
      } else {
        this.reset();
      };
    } else {
      this.saveBankDetails(value);
    }
    this.obj1 = []
    this.obj1.push(this.firstHolderBank)
    this.obj1.push(this.secondHolderBank)
    this.obj1.push(this.thirdHolderBank)
    if (flag == true) {
      this.doneData = true
      console.log('contact details', this.obj1)
      const value = {}
      this.obj1.forEach(element => {
        if (element) {
          this.getObj = this.setObj(element, value)
          this.bank.push(this.getObj)
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
        holderList: this.temp,
        bankDetailList: this.bank,
        nomineeList:this.inputData.nomineeList,
        fatcaDetail:this.inputData.fatcaDetail,
        generalDetails: this.genralDetails
      }
      console.log('##### bank ######', this.sendObj)
      this.openNomineeDetails(this.sendObj)
    }
  }
  setObj(holder, value) {
    value = {
      ifscCode: holder.ifscCode,
      accountNumber: holder.accountNumber,
      accountType: holder.accountType,
      bankName: holder.bankName,
      branchName: holder.branchName,
      branchCode: holder.branchCode,
      micrCode: holder.micrCode,
      firstHolder: holder.firstHolder,
    }
    value.address = {
      address1: holder.branchAdd1,
      address2: holder.branchAdd2,
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
        this.firstHolderBank = this.bankDetails.value;
        this.holder.type = value;
        break;

      case "second":
        this.secondHolderBank = this.bankDetails.value;
        this.holder.type = value;
        break;

      case "third":
        this.thirdHolderBank = this.bankDetails.value;
        this.holder.type = value;
        break;

    }
  }
}
