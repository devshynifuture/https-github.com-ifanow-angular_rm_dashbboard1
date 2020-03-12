import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { PostalService } from 'src/app/services/postal.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';
import { FatcaDetailsInnComponent } from '../fatca-details-inn/fatca-details-inn.component';

@Component({
  selector: 'app-nominee-details-iin',
  templateUrl: './nominee-details-iin.component.html',
  styleUrls: ['./nominee-details-iin.component.scss']
})
export class NomineeDetailsIinComponent implements OnInit {
  validatorType = ValidatorType
  holdingList: any[];
  nomineeDetails: any;
  inputData: any;
  allData: any;
  nomineeList: any;
  holderList: any;
  bankDetailList: any;
  firstHolderNominee: any;
  secondHolderNominee: any;
  thirdHolderNominee: any;
  holder = {
    type: 'first',
    data: ''
  }
  obj1: any;
  sendObj: any;
  nominee: any;
  changedValue: string;
  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private onlineTransact: OnlineTransactionService, private postalService: PostalService,
    private processTransaction: ProcessTransactionService
    , private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.allData = data
    if (data && data.nomineeList) {
      this.firstHolderNominee = data.nomineeList[0]
      this.secondHolderNominee = data.nomineeList[1]
      this.thirdHolderNominee = data.nomineeList[2]
      this.getdataForm(this.firstHolderNominee)
    }

  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {

    if (this.firstHolderNominee) {
      this.getdataForm(this.firstHolderNominee)
    } else {
      this.getdataForm('')
    }

    this.holdingList = []
    this.nominee = []
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

    this.nomineeDetails = this.fb.group({
      nomineeName: [(!data) ? '' : data.nomineeName, [Validators.required]],
      relationType: [!data ? '' : data.relationType, [Validators.required]],
      nomineeType: [!data ? '' : data.nomineeType, [Validators.required]],
      nominneDOB: [!data ? '' : data.nominneDOB, [Validators.required]],
      nomineePercentage: [!data ? '' : data.addressType, [Validators.required]],
      addressType: [!data ? '' : data.nameAsPan, [Validators.required]],
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
    return this.nomineeDetails.controls;
  }
  pinInvalid: boolean = false;
  openBankDetails() {
    const subscription = this.processTransaction.openBank(this.allData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }
  openFatcaDetails(data) {
    var temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: FatcaDetailsInnComponent,
      state: 'open'
    }
    const subscription = this.eventService.changeUpperSliderState(temp).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
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

      this.getFormControl().pincode.setErrors(this.pinInvalid);
      this.getFormControl().city.setValue("");
      this.getFormControl().country.setValue("");
      this.getFormControl().district.setValue("");
      this.getFormControl().state.setValue("");

    }
    else {
      this.getFormControl().city.setValue(data[0].PostOffice[0].Region);
      this.getFormControl().district.setValue(data[0].PostOffice[0].District);
      this.getFormControl().country.setValue(data[0].PostOffice[0].Country);
      this.getFormControl().state.setValue(data[0].PostOffice[0].Circle);
      this.pinInvalid = false;
    }
  }
  reset() {
    this.nomineeDetails.reset();
  }
  SendToForm(value, flag) {
    if (value == 'first') {
      this.saveNomineeDetails(value);
      if (this.firstHolderNominee) {
        this.holder.type = value;
        this.nomineeDetails.setValue(this.firstHolderNominee);
      } else {
        this.reset();
      }
    }
    else if (value == 'second') {
      this.saveNomineeDetails(value);
      if (this.secondHolderNominee) {
        this.holder.type = value;
        this.nomineeDetails.setValue(this.secondHolderNominee);
      } else {
        this.reset();
      }
    }
    else if (value == 'third') {
      this.saveNomineeDetails(value);
      if (this.thirdHolderNominee) {
        this.holder.type = value;
        this.nomineeDetails.setValue(this.thirdHolderNominee);
      } else {
        this.reset();
      };
    } else {
      this.saveNomineeDetails(value);
    }
    console.log('contact details', this.obj1)

    this.obj1 = []
    this.obj1.push(this.firstHolderNominee)
    this.obj1.push(this.secondHolderNominee)
    this.obj1.push(this.thirdHolderNominee)
    this.obj1.forEach(element => {
      if (element) {
        this.getObj = this.setObj(element, value)
        this.nominee.push(this.getObj)
      }
    });
    if (flag == true) {
      const value = {}
      let obj = {
        ownerName: this.allData.ownerName,
        holdingType: this.allData.holdingType,
        taxStatus: this.allData.taxStatus,
        holderList: this.allData.holderList,
        bankDetailList: this.allData.bankDetailList,
        nomineeList: this.nominee,
        id: 2,
        aggregatorType: 1,
        familyMemberId: this.allData.familyMemberId,
        clientId: this.allData.clientId,
        advisorId: this.allData.advisorId,
        commMode: 1,
        confirmationFlag: 1,
        tpUserSubRequestClientId1: 2,
      }
      console.log('##### ALLL DATA ####', obj)
      this.openFatcaDetails(obj)
    }
  }
  getObj(getObj: any) {
    throw new Error("Method not implemented.");
  }

  setObj(holder, value) {

    value = {
      nomineeName: holder.nomineeName,
      relationType: holder.relationType,
      nomineeType: holder.nomineeType,
      nominneDOB: holder.nominneDOB,
      nomineePercentage: holder.nomineePercentage,
      idNumber: holder.idNumber,
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
  saveNomineeDetails(value) {
    if (this.nomineeDetails.get('nomineeName').invalid) {
      this.nomineeDetails.get('nomineeName').markAsTouched();
      return
    } else if (this.nomineeDetails.get('relationType').invalid) {
      this.nomineeDetails.get('relationType').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('nomineeType').invalid) {
      this.nomineeDetails.get('nomineeType').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('nominneDOB').invalid) {
      this.nomineeDetails.get('nominneDOB').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('nomineePercentage').invalid) {
      this.nomineeDetails.get('nomineePercentage').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('addressType').invalid) {
      this.nomineeDetails.get('addressType').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('addressLine1').invalid) {
      this.nomineeDetails.get('addressLine1').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('addressLine2').invalid) {
      this.nomineeDetails.get('addressLine2').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('pinCode').invalid) {
      this.nomineeDetails.get('pinCode').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('city').invalid) {
      this.nomineeDetails.get('city').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('district').invalid) {
      this.nomineeDetails.get('district').markAsTouched();
      return;
    } else if (this.nomineeDetails.get('country').invalid) {
      this.nomineeDetails.get('country').markAsTouched();
      return;
    } else {
      this.setEditHolder(this.holder.type, value)

    }
  }

  createIINUCCRes(data) {
    console.log('data to created', data)
  }
  setEditHolder(type, value) {
    switch (type) {
      case "first":
        this.firstHolderNominee = this.nomineeDetails.value;
        this.holder.type = value;
        break;

      case "second":
        this.secondHolderNominee = this.nomineeDetails.value;
        this.holder.type = value;
        break;

      case "third":
        this.thirdHolderNominee = this.nomineeDetails.value;
        this.holder.type = value;
        break;

    }

  }
}
