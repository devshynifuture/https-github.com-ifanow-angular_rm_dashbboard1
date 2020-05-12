import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {DatePipe} from '@angular/common';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ProcessTransactionService} from '../../../doTransaction/process-transaction.service';
import {OnlineTransactionService} from '../../../../online-transaction.service';
import {AuthService} from 'src/app/auth-service/authService';
import {MatInput} from '@angular/material';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-personal-details-inn',
  templateUrl: './personal-details-inn.component.html',
  styleUrls: ['./personal-details-inn.component.scss']
})
export class PersonalDetailsInnComponent implements OnInit {

  personalDetails: any;
  holdingList: any;
  inputData: any;
  generalDetails: any;
  obj1: any;
  firstHolder: any;
  secondHolder: any;
  thirdHolder: any;
  holder = {
    type: 'first',
    data: ''
  };
  replaceObj: { panNumber: any; clientName: any; maidenName: any; fatherName: any; motherName: any; dateOfBirth: any; gender: any; martialStatus: any; };
  validatorType = ValidatorType;
  changedValue: string;
  doneData: any;
  advisorId: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  addressList: any;
  clientId: any;
  clientData: any;
  sendObj: any;
  maxDate = new Date();


  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
              private processTransaction: ProcessTransactionService,
              private onlineTransact: OnlineTransactionService, private datePipe: DatePipe,
              private peopleService: PeopleService, private custumService: CustomerService,
              public utils: UtilService,
              public eventService: EventService) {
    this.clientId = AuthService.getClientId();
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.clientData = data.clientData;
    this.obj1 = {...data};
    console.log('all data in per', this.inputData);
    if (data && data.holderList) {
      this.getdataForm(data.holderList[0]);
      this.firstHolder = data.holderList[0];
      this.secondHolder = data.holderList[1];
      this.thirdHolder = data.holderList[2];
      console.log('return data', data);
    } else if (data && data.firstHolder) {
      this.getdataForm(data.firstHolder);
      this.firstHolder = data.firstHolder;
      this.secondHolder = data.secondHolder;
      this.thirdHolder = data.thirdHolder;
    }
    this.generalDetails = data;
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.doneData = false;
    if (this.firstHolder) {
      this.getdataForm(this.firstHolder);
    } else {
      this.getdataForm('');
      if (this.clientData) {
        this.getAddressList(this.clientData);
      }
    }
    this.holdingList = [];
    // this.obj1 = [];
  }

  close() {
    this.changedValue = 'close';
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }

  getAddressList(data) {
    if (data.userType == 2) {
      this.sendObj = {
        clientId: data.clientId,
      };
      this.peopleService.getClientOrLeadData(this.sendObj).subscribe(
        data => {
          console.log(data);
          this.addressList = data;
          console.log('adrress', this.addressList);
          if (this.addressList.emailList.length > 0) {
            this.addressList.email = this.addressList.emailList[0].email;
          }
          if (this.addressList.mobileList.length > 0) {
            this.addressList.mobileNo = this.addressList.mobileList[0].mobileNo;
          }
          this.getdataForm(this.addressList);
        },
        err => {
          this.addressList = {};
        }
      );
    } else {
      this.sendObj = {
        familyMemberId: data.familyMemberId,
      };
      this.custumService.getFamilyMembers(this.sendObj).subscribe(
        data => {
          this.addressList = data[0];
          console.log('adrress', this.addressList);
          if (this.addressList.emailList.length > 0) {
            this.addressList.email = this.addressList.emailList[0].email;
          } else if (this.addressList.mobileList.length > 0) {
            this.addressList.mobileNo = this.addressList.mobileList[0].mobileNo;
          }
          this.getdataForm(this.addressList);
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      };
    } else if (!data.address) {
      data.address = null;
    }

    this.personalDetails = this.fb.group({
      panNumber: [!data ? '' : (data.pan) ? data.pan : data.panNumber, [Validators.required]],
      clientName: [!data ? '' : (data.name) ? data.name : data.clientName, [Validators.required]],
      // maidenName: [!data ? '' : data.maidenName, [Validators.required]],
      fatherName: [!data ? '' : data.fatherName, [Validators.required]],
      motherName: [!data ? '' : data.motherName, [Validators.required]],
      dob: [!data ? '' : (data.dob)],
      dateOfBirth: [!data ? '' : (data.dob) ? new Date(data.dob) : new Date(data.dateOfBirth), [Validators.required]],
      gender: [!data ? '1' : data.genderId ? data.genderId + '' : data.gender, [Validators.required]],
      email: [!data ? '' : data.email],
      aadharNumber: [!data ? '' : (data.aadharNumber) ? data.aadharNumber : data.aadhaarNumber],
      mobileNo: [!data ? '' : data.mobileNo],
      phoneNo: [!data ? '' : data.phoneNo],
      maritalStatus: [!data ? '1' : data.martialStatusId ? data.martialStatusId + '' : data.maritalStatus, [Validators.required]],
      address1: [!data.address ? data.address1 : data.address.address1],
      address2: [!data.address ? data.address2 : data.address.address2],
      pinCode: [!data.address ? data.pinCode : data.address.pinCode],
      city: [!data.address ? data.city : data.address.city],
      state: [!data.address ? data.state : data.address.state],
      country: [!data.address ? data.country : data.address.country],
    });
  }

  getFormControl(): any {
    return this.personalDetails.controls;
  }

  openContactDetails(data) {
    this.doneData = true;
    const subscription = this.processTransaction.openContact(data).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  reset() {
    this.personalDetails.reset();
  }

  SendToForm(value, flag) {
    if (flag == true) {
      this.doneData = true;
    }
    if (value == 'first') {

      this.savePersonalDetails(value);
      if (this.holder.type == 'first') {
      } else {
        if (this.firstHolder && this.firstHolder.panNumber) {
          this.holder.type = value;
          this.personalDetails.setValue(this.firstHolder);
        } else {
          return;
        }
      }

    } else if (value == 'second') {
      if (this.holder.type == 'second') {
      } else {
        if (this.savePersonalDetails(value)) {
          if (this.secondHolder && this.secondHolder.panNumber) {
            this.holder.type = value;
            this.personalDetails.setValue(this.secondHolder);
          } else {
            this.reset();
          }
        } else if (this.holder.type == 'third') {
          this.reset();
        }
      }
    } else if (value == 'third') {
      if (this.holder.type == 'third') {
        return;
      } else {
        if (this.savePersonalDetails(value)) {
          if (this.thirdHolder && this.thirdHolder.panNumber) {
            this.holder.type = value;
            this.personalDetails.setValue(this.thirdHolder);
          } else {
            this.reset();
          }
        }
      }
    } else {
      this.savePersonalDetails(value);
    }

    this.obj1.firstHolder = this.firstHolder;
    this.obj1.firstHolder.dob = new Date(this.firstHolder.dateOfBirth).getTime();
    this.obj1.secondHolder = this.secondHolder;
    if (this.secondHolder) {
      this.obj1.secondHolder.dob = new Date(this.secondHolder.dateOfBirth).getTime();
    }

    this.obj1.thirdHolder = this.thirdHolder;
    if (this.thirdHolder) {
      this.obj1.thirdHolder.dob = new Date(this.thirdHolder.dateOfBirth).getTime();
    }

    this.obj1.generalDetails = this.generalDetails;
    this.obj1.holderList = this.inputData.holderList;
    this.obj1.bankDetailList = this.inputData.bankDetailList;
    this.obj1.nomineeList = this.inputData.nomineeList;
    this.obj1.fatcaDetail = this.inputData.fatcaDetail;
    this.obj1.clientData = this.clientData;
    if (flag == true) {
      this.openContactDetails(this.obj1);
    }
  }

  savePersonalDetails(value) {
    if (this.personalDetails.invalid) {
      for (const element in this.personalDetails.controls) {
        console.log(element);
        if (this.personalDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.personalDetails.controls[element].markAsTouched();
        }
      }
      return false;
    } else {
      this.setEditHolder(this.holder.type, value);
      return true;
    }
  }

  setEditHolder(type, value) {
    switch (type) {
      case 'first':
        this.firstHolder = this.personalDetails.value;
        this.holder.type = value;
        break;

      case 'second':
        this.secondHolder = this.personalDetails.value;
        this.holder.type = value;
        break;

      case 'third':
        this.thirdHolder = this.personalDetails.value;
        this.holder.type = value;
        break;

    }
  }
}
