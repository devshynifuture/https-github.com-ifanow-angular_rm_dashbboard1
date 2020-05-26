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
  activeDetailsClass = 'first';


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
    console.log('Data in personal detail : ', data);
    this.clientData = data.clientData;
    this.obj1 = {...data};
    if (data && data.holderList) {
      this.getdataForm(data.holderList[0]);
      this.firstHolder = data.holderList[0];
      this.secondHolder = data.holderList[1];
      this.thirdHolder = data.holderList[2];
    } else if (data && data.firstHolder) {
      this.getdataForm(data.firstHolder);
      this.firstHolder = data.firstHolder;
      this.secondHolder = data.secondHolder;
      this.thirdHolder = data.thirdHolder;
    }
  }

  get data() {
    return this.inputData;
  }

  thirdHolderButtonLabel = '+ Add Holder';
  personalDetails: any;
  holdingList: any;
  inputData: any;
  obj1: any;
  firstHolder: any = {};
  secondHolder: any = {};
  thirdHolder: any = {};
  holder = {
    type: 'first',
    data: ''
  };
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
  familyClientList;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.doneData = false;
    if (this.firstHolder && this.firstHolder.panNumber) {
      this.getdataForm(this.firstHolder);
    } else {
      this.getdataForm('');
      if (this.clientData) {
        this.getClientOrFamilyDetails(this.clientData);
      }
    }
    this.holdingList = [];
    if (this.inputData.holdingType != 'SI') {
      this.getNomineeList(this.clientData);
    }
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

  getClientOrFamilyDetails(data) {
    if (data.userType == 2) {
      this.sendObj = {
        clientId: data.clientId,
      };
      this.peopleService.getClientOrLeadData(this.sendObj).subscribe(
        data => {
          this.addressList = data;
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
          if (this.addressList.emailList.length > 0) {
            this.addressList.email = this.addressList.emailList[0].email;
          }
          if (this.addressList.mobileList.length > 0) {
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
      clientId: [data && data.clientId ? (data.clientId) : '0'],
      familyMemberId: [data && data.familyMemberId ? (data.familyMemberId) : '0'],
      userType: [data && data.userType ? (data.userType) : 1],
      panNumber: [!data ? '' : (data.pan) ? data.pan : data.panNumber, [Validators.required]],
      clientName: [!data ? '' : (data.name) ? data.name : data.clientName, [Validators.required]],
      // maidenName: [!data ? '' : data.maidenName, [Validators.required]],
      fatherName: [!data ? '' : data.fatherName, [Validators.required]],
      motherName: [!data ? '' : data.motherName],
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
    this.activeDetailsClass = value;

    if (flag == true) {
      this.doneData = true;
    }
    if (value == 'first') {

      this.savePersonalDetails(this.holder.type);
      if (this.holder.type == 'first') {
      } else {
        if (this.firstHolder && this.firstHolder.panNumber) {
          this.holder.type = value;
          this.getdataForm(this.firstHolder);
        } else {
          return;
        }
      }

    } else if (value == 'second') {
      if (this.holder.type == 'second' && !flag) {
      } else {
        if (this.savePersonalDetails(this.holder.type)) {
          if (this.secondHolder && this.secondHolder.panNumber) {
            this.holder.type = value;
            this.getdataForm(this.secondHolder);

            // this.personalDetails.setValue(this.secondHolder);
          } else {
            this.reset();
          }
          this.holder.type = value;
        } else if (this.holder.type == 'third') {
          this.reset();
          this.thirdHolderButtonLabel = '+ Add Holder';
          this.holder.type = value;
        }
      }
    } else if (value == 'third') {
      if (this.holder.type == 'third' && !flag) {
      } else {
        if (this.savePersonalDetails(this.holder.type)) {
          this.thirdHolderButtonLabel = 'Third Holder';
          if (this.thirdHolder && this.thirdHolder.panNumber) {
            this.getdataForm(this.thirdHolder);

            // this.personalDetails.setValue(this.thirdHolder);
          } else {
            this.reset();
          }
          this.holder.type = value;
        }
      }
    } else {
      this.savePersonalDetails(value);
    }

    this.obj1.firstHolder = this.firstHolder;
    const holderList: any = [];
    holderList.push(this.firstHolder);

    this.obj1.firstHolder.dob = new Date(this.firstHolder.dateOfBirth).getTime();
    this.obj1.secondHolder = this.secondHolder;
    if (this.secondHolder && this.secondHolder.clientName) {
      this.obj1.secondHolder.dob = new Date(this.secondHolder.dateOfBirth).getTime();
      holderList.push(this.secondHolder);

    }

    this.obj1.thirdHolder = this.thirdHolder;
    if (this.thirdHolder && this.thirdHolder.clientName) {
      this.obj1.thirdHolder.dob = new Date(this.thirdHolder.dateOfBirth).getTime();
      holderList.push(this.thirdHolder);
    }

    if (this.inputData.holdingType != 'SI' && holderList.length < 2 && flag) {
      this.eventService.openSnackBar('Please enter atleast two holders.');
      return;
    }

    this.obj1.holderList = holderList;
    if (flag == true) {
      this.openContactDetails(this.obj1);
    }
  }

  savePersonalDetails(value) {
    if (this.personalDetails.invalid) {
      for (const element in this.personalDetails.controls) {
        if (this.personalDetails.get(element).invalid) {
          // this.inputs.find(input => !input.ngControl.valid).focus();
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
        Object.assign(this.firstHolder, this.personalDetails.value);
        this.holder.type = value;
        break;

      case 'second':
        Object.assign(this.secondHolder, this.personalDetails.value);
        this.holder.type = value;
        break;

      case 'third':
        Object.assign(this.thirdHolder, this.personalDetails.value);
        this.holder.type = value;
        break;

    }
  }

  getNomineeList(data) {
    const obj = {
      userId: data.userType == 2 ? data.clientId : data.familyMemberId,
      userType: data.userType
    };
    this.peopleService.getClientFamilyMembers(obj).subscribe(
      responseData => this.getListOfFamilyByClientRes(responseData)
    );
  }

  getListOfFamilyByClientRes(data) {
    this.familyClientList = data;
  }

  selectedFamily(data) {
    this.getClientOrFamilyDetails(data);
  }
}
