import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { NomineeDetailsIinComponent } from '../nominee-details-iin/nominee-details-iin.component';
import { PostalService } from 'src/app/services/postal.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';

@Component({
  selector: 'app-bank-details-iin',
  templateUrl: './bank-details-iin.component.html',
  styleUrls: ['./bank-details-iin.component.scss']
})
export class BankDetailsIINComponent implements OnInit {
  validatorType = ValidatorType
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
  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private postalService: PostalService,
    private processTransaction : ProcessTransactionService,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.holdingList = data
    this.firstHolderBank = data[0]
    this.secondHolderBank = data[1]
    this.thirdHolderBank = data[2]
    console.log('#######', this.holdingList)
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.getdataForm(this.firstHolderBank)
    this.bank = []
    this.sendObj = []
    this.temp = []
    this.temp.push(this.holdingList.firstHolder)
    this.temp.push(this.holdingList.secondHolder)
    this.temp.push(this.holdingList.thirdHolder)
  }
  close() {
    const fragmentData = {
      direction: 'top',
      componentName: BankDetailsIINComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getdataForm(data) {
    this.bankDetails = this.fb.group({
      ifscCode: [(!data) ? '' : data.ifscCode, [Validators.required]],
      bankName: [!data ? '' : data.bankName, [Validators.required]],
      micrCode: [!data ? '' : data.micrCode, [Validators.required]],
      accountNumber: [!data ? '' : data.accountNumber, [Validators.required]],
      accountType: [!data ? '' : data.accountType, [Validators.required]],
      branchCode: [!data ? '' : data.branchCode, [Validators.required]],
      firstHolder: [!data ? '' : data.firstHolder, [Validators.required]],
      branchName: [!data ? '' : data.branchName, [Validators.required]],
      branchAdd1: [!data ? '' : data.address.branchAdd1, [Validators.required]],
      branchAdd2: [!data ? '' : data.address.branchAdd2, [Validators.required]],
      pinCode: [!data ? '' : data.address.pinCode, [Validators.required]],
      city: [!data ? '' : data.address.city, [Validators.required]],
      state: [!data ? '' : data.address.state, [Validators.required]],
      country: [!data ? '' : data.address.country, [Validators.required]],
      branchProof: [!data ? '' : data.address.branchProof, [Validators.required]],
      bankMandate: [!data ? '' : data.address.bankMandate, [Validators.required]],
      mandateDate: [!data ? '' : data.address.mandateDate, [Validators.required]],
      mandateAmount: [!data ? '' : data.address.mandateAmount, [Validators.required]],
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
  openContactDetails(){
    this.processTransaction.openContact(this.holdingList)
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
        this.reset();
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
        ownerName: temp1.ownerName,
        holdingType: temp1.holdingNature,
        taxStatus: temp1.taxStatus,
        familyMemberId : temp1.familyMemberId,
        clientId: temp1.clientId,
        advisorId: temp1.advisorId,
        holderList: this.temp,
        bankDetailList: this.bank,
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
    if (this.bankDetails.get('ifscCode').invalid) {
      this.bankDetails.get('ifscCode').markAsTouched();
      return;
    } else if (this.bankDetails.get('bankName').invalid) {
      this.bankDetails.get('bankName').markAsTouched();
      return;
    } else if (this.bankDetails.get('micrCode').invalid) {
      this.bankDetails.get('micrCode').markAsTouched();
      return
    } else if (this.bankDetails.get('accountNumber').invalid) {
      this.bankDetails.get('accountNumber').markAsTouched();
      return;
    } else if (this.bankDetails.get('accountType').invalid) {
      this.bankDetails.get('accountType').markAsTouched();
      return;
    } else if (this.bankDetails.get('firstHolder').invalid) {
      this.bankDetails.get('firstHolder').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchAdd1').invalid) {
      this.bankDetails.get('branchAdd1').markAsTouched();
      return;
    } else if (this.bankDetails.get('branchAdd2').invalid) {
      this.bankDetails.get('branchAdd2').markAsTouched();
      return;
    } else if (this.bankDetails.get('pinCode').invalid) {
      this.bankDetails.get('pinCode').markAsTouched();
      return;
    } else if (this.bankDetails.get('city').invalid) {
      this.bankDetails.get('city').markAsTouched();
      return;
    // } else if (this.bankDetails.get('state').invalid) {
    //   this.bankDetails.get('state').markAsTouched();
    //   return;
    // } else if (this.bankDetails.get('country').invalid) {
    //   this.bankDetails.get('country').markAsTouched();
    //   return;
    } else if (this.bankDetails.get('branchProof').invalid) {
      this.bankDetails.get('branchProof').markAsTouched();
      return;
    } else if (this.bankDetails.get('bankMandate').invalid) {
      this.bankDetails.get('bankMandate').markAsTouched();
      return;
    } else if (this.bankDetails.get('mandateDate').invalid) {
      this.bankDetails.get('mandateDate').markAsTouched();
      return;
    } else if (this.bankDetails.get('mandateAmount').invalid) {
      this.bankDetails.get('mandateAmount').markAsTouched();
      return;
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
