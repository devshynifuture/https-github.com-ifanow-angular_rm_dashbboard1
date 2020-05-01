import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
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
import { MatInput } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-nominee-details-iin',
  templateUrl: './nominee-details-iin.component.html',
  styleUrls: ['./nominee-details-iin.component.scss']
})
export class NomineeDetailsIinComponent implements OnInit {
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

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
  doneData: any;
  familyMemberList: any;
  clientData: any;
  advisorId: any;
  nomineeFmList: any;
  addressList: any;
  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private onlineTransact: OnlineTransactionService, private postalService: PostalService,
    private processTransaction: ProcessTransactionService, private custumService: CustomerService,
    private peopleService: PeopleService,
    private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
    this.advisorId = AuthService.getAdvisorId()
  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.clientData = data.clientData
    console.log('all data in nominee', this.inputData)
    this.allData = data
    this.doneData = {}
    this.doneData.bank = true
    this.doneData.contact = true
    this.doneData.personal = true
    this.doneData.nominee = false
    if (data && data.nomineeList) {
      this.firstHolderNominee = data.nomineeList[0]
      this.secondHolderNominee = data.nomineeList[1]
      this.thirdHolderNominee = data.nomineeList[2]
      this.getdataForm(this.firstHolderNominee)
    }
    this.getNomineeList(this.clientData)

  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {

    if (this.firstHolderNominee) {
      this.getdataForm(this.firstHolderNominee)
    } else {
      this.getdataForm('')
      if (this.clientData) {
        this.getFamilyMembersList(this.clientData)
      }
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
  getNomineeList(data) {
    const obj = {
      userId: data.clientId,
      userType: 2
    };
    this.peopleService.getClientFamilyMembers(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getListOfFamilyByClientRes(data) {
    console.log('getListOfFamilyByClientRes', data)
    this.nomineeFmList = data
    this.nomineeFmList = this.nomineeFmList.filter(element => element.familyMemberId != this.clientData.familyMemberId);
    console.log('nomineeList',this.nomineeFmList)
  }
  selectedNominee(value) {
    this.getAddressList(value)
  }
  getAddressList(data) {
    this.addressList = data
    this.addressList.address = {}
    const obj = {
      userId: data.clientId,//to do,
      userType: 2//to do
    };
    this.custumService.getAddressList(obj).subscribe(
      data => {
        console.log(data);
        console.log('address stored', data)
        //  this.addressList = this.firstHolderContact
        this.addressList.address = data[0]
        this.getdataForm(this.addressList);
      },
      err => {
        this.addressList = {};
      }
    );
  }
  getFamilyMembersList(data) {
    const obj = {
      clientId: data.clientId,
      id: 0
    };
    this.custumService.getFamilyMembers(obj).subscribe(
      data => {
        this.familyMemberList = data;
        this.familyMemberList = this.utils.calculateAgeFromCurrentDate(data);
        console.log(this.familyMemberList);
        this.firstHolderNominee = this.familyMemberList[1]
        this.secondHolderNominee = this.familyMemberList[2]
        this.getdataForm(this.firstHolderNominee)
      },
      err => {
        console.error(err)
      }
    );
  }

  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      }
    }
    this.nomineeDetails = this.fb.group({
      nomineeName: [(!data) ? '' : (data.nomineeName) ? data.nomineeName : data.name, [Validators.required]],
      relationShip: [!data ? '' : (data.relationShip) ? data.relationShip : data.relationshipId + "", [Validators.required]],
      type: [!data ? '1' : (data.type) ? data.type +'' : '1', [Validators.required]],
      dob: [!data ? '' : (data.dob) ? new Date(data.dob) : new Date(data.dateOfBirth), [Validators.required]],
      percent: [!data ? '' : data.percent, [Validators.required, Validators.min(0), Validators.max(100)]],
      addressType: [!data.address ? '' : data.address.addressType, [Validators.required]],
      address1: [!data.address ? '' : data.address.address1, [Validators.required]],
      address2: [!data.address ? '' : data.address.address2, [Validators.required]],
      pinCode: [!data.address ? '' : data.address.pinCode, [Validators.required]],
      city: [!data.address ? '' : data.address.city, [Validators.required]],
      district: [!data.address ? '' : data.address.district, [Validators.required]],
      state: [!data.address ? '' : data.address.state, [Validators.required]],
      country: [!data.address ? '' : data.address.country, [Validators.required]],
    });
    // if (data.nomineeType == undefined) {
    //   this.nomineeDetails.controls.nomineeType.setValue('1')
    // }
  }
  getFormControl(): any {
    return this.nomineeDetails.controls;
  }
  pinInvalid: boolean = false;
  openBankDetails() {
    const subscription = this.processTransaction.openBank(this.inputData).subscribe(
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
        this.getdataForm(this.firstHolderNominee)
      } else {
        return;
      }
    }
    else if (value == 'second') {
      this.saveNomineeDetails(value);
      if (this.secondHolderNominee) {
        this.holder.type = value;
        this.getdataForm(this.secondHolderNominee)
      } else {
        this.reset();
      }
    }
    else if (value == 'third') {
      this.saveNomineeDetails(value);
      if (this.thirdHolderNominee) {
        this.holder.type = value;
        this.getdataForm(this.thirdHolderNominee)
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
      this.doneData = true
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
        generalDetails: this.allData.generalDetails,
        fatcaDetail: this.inputData.fatcaDetail,
        commMode: 1,
        confirmationFlag: 1,
        allData: this.inputData,
        tpUserSubRequestClientId1: 2,
        clientData: this.clientData
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
      relationShip: holder.relationShip,
      type: holder.type,
      dob: new Date(holder.dob).getTime(),
      percent: holder.percent,
      idNumber: holder.idNumber,
    }
    value.address = {
      addressType: holder.addressType,
      address1: holder.address1,
      address2: holder.address2,
      pinCode: holder.pinCode,
      city: holder.city,
      district: holder.district,
      state: holder.state,
      country: holder.country,
    }
    return value;
  }
  saveNomineeDetails(value) {
    if (this.nomineeDetails.invalid) {
      for (let element in this.nomineeDetails.controls) {
        console.log(element)
        if (this.nomineeDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.nomineeDetails.controls[element].markAsTouched();
        }
      }
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
